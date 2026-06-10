import{getCorsHeaders,jsonResponse,errorBody}from"../_shared/http.ts";
import{getServiceClient}from"../_shared/supabase-clients.ts";
import{callGeminiStructured,withRetry}from"../_shared/gemini.ts";

interface InboundMessage{event:"message"|"message.received";messageId:string;from:string;chatId:string;body:string;type?:string;timestamp?:string;campaignId?:string;}
interface IntentResult{intent:"vote_confirm"|"ticket_status"|"leaderboard"|"event_info"|"opt_out"|"other";confidence:number;reply:string;}

const intentSchema={type:"object",properties:{intent:{type:"string",enum:["vote_confirm","ticket_status","leaderboard","event_info","opt_out","other"]},confidence:{type:"number",minimum:0,maximum:1},reply:{type:"string"}},required:["intent","confidence","reply"],additionalProperties:false};

const SYSTEM_INSTRUCTION=`You are a friendly event concierge bot for mdeai.co, a Medellin event platform.
Classify the user message into one of these intents:
- vote_confirm: confirming a vote or asking about their vote
- ticket_status: asking about ticket purchase, payment, or delivery
- leaderboard: asking about rankings, standings, or who is winning
- event_info: asking about event schedule, location, artist, or details
- opt_out: requesting to stop receiving messages (STOP, unsubscribe, remove me)
- other: anything that does not match the above

Write a short, helpful reply in English under 160 characters.
For opt_out, confirm removal and apologize for the interruption.
For other, offer to connect them with a human agent.`;

function verifyBearer(h:string|null,s:string):boolean{if(!h)return false;const e=`Bearer ${s}`;if(h.length!==e.length)return false;const a=new TextEncoder().encode(h);const b=new TextEncoder().encode(e);let d=0;for(let i=0;i<a.length;i++)d|=a[i]!^b[i]!;return d===0;}

async function sendReply(chatId:string,body:string):Promise<void>{
  const url=Deno.env.get("OPENCLAW_GATEWAY_URL");const tok=Deno.env.get("OPENCLAW_GATEWAY_TOKEN");
  if(!url||!tok){console.warn("gateway creds missing - skipping reply");return;}
  const res=await fetch(`${url}/api/sendText`,{method:"POST",headers:{"Content-Type":"application/json","Authorization":`Bearer ${tok}`},body:JSON.stringify({chatId,body})});
  if(!res.ok)console.error(`sendReply failed ${res.status}:`,await res.text().catch(()=>""));
}

Deno.serve(async(req)=>{
  if(req.method==="OPTIONS")return new Response("ok",{headers:getCorsHeaders(req)});
  const secret=Deno.env.get("OPENCLAW_WEBHOOK_SECRET");
  if(!secret)return jsonResponse(errorBody("CONFIG_ERROR","Webhook secret not configured"),500,req);
  if(!verifyBearer(req.headers.get("Authorization"),secret))return jsonResponse(errorBody("UNAUTHORIZED","Invalid webhook token"),401,req);
  let msg:InboundMessage;
  try{msg=await req.json() as InboundMessage;}catch{return jsonResponse(errorBody("BAD_REQUEST","Invalid JSON"),400,req);}
  if(!msg.body||!msg.from||!msg.messageId)return jsonResponse({ok:true,skipped:true},200,req);
  if(msg.type&&msg.type!=="text")return jsonResponse({ok:true,skipped:true,reason:"non-text"},200,req);
  const db=getServiceClient();
  const{error:insertErr}=await db.rpc("fn_insert_conversation",{p_data:{contact_phone:msg.from,direction:"inbound",channel:"whatsapp",body:msg.body,openclaw_message_id:msg.messageId,campaign_id:msg.campaignId??null,metadata:JSON.stringify({chatId:msg.chatId,event:msg.event})}});
  if(insertErr&&insertErr.code!=="23505")console.error("conversation insert error:",insertErr.message);
  const GEMINI_API_KEY=Deno.env.get("GEMINI_API_KEY");
  let result:IntentResult;
  if(!GEMINI_API_KEY){
    result={intent:"other",confidence:1,reply:"Thanks for your message. A team member will follow up shortly."};
  }else{
    try{
      const{data}=await withRetry(()=>callGeminiStructured<IntentResult>({model:"gemini-3-flash-preview",prompt:msg.body,systemInstruction:SYSTEM_INSTRUCTION,responseJsonSchema:intentSchema,thinkingLevel:"minimal",agentName:"concierge_bot",timeoutMs:10_000}));
      result=data;
    }catch(err){
      console.error("Gemini error:",err instanceof Error?err.message:err);
      result={intent:"other",confidence:0,reply:"Thanks for reaching out! We will get back to you soon."};
    }
  }
  await db.rpc("fn_update_conversation_intent",{p_message_id:msg.messageId,p_intent:result.intent,p_confidence:result.confidence,p_reply:result.reply});
  if(result.intent==="opt_out"){
    const identifier=msg.from.replace(/\D/g,"").replace(/^1/,"");
    await db.from("suppression_list").upsert({channel:"whatsapp",identifier,reason:"user_stop",source:"openclaw_concierge"},{onConflict:"channel,identifier"});
    console.log("openclaw-concierge-webhook: opted out",identifier);
  }
  await sendReply(msg.chatId,result.reply);
  await db.rpc("fn_insert_conversation",{p_data:{contact_phone:msg.from,direction:"outbound",channel:"whatsapp",body:result.reply,intent:result.intent,campaign_id:msg.campaignId??null,metadata:JSON.stringify({chatId:msg.chatId,in_reply_to:msg.messageId})}});
  console.log(`openclaw-concierge-webhook: ${msg.from} -> intent=${result.intent}`);
  return jsonResponse({ok:true,intent:result.intent,reply:result.reply},200,req);
});
