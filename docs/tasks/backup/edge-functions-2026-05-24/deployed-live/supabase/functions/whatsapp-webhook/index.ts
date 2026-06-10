/**
 * WhatsApp Webhook Edge Function
 * ============================================================================
 * MVP Implementation - Receive WhatsApp messages and respond with AI
 * Integration: Infobip WhatsApp Business API
 */

import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from 'jsr:@supabase/supabase-js@2';

// ============================================================================
// Types
// ============================================================================

interface InfobipWebhookPayload {
  results: Array<{
    from: string;
    to: string;
    messageId: string;
    message: {
      text?: string;
      type?: string;
    };
    timestamp: string;
  }>;
}

interface InfobipSendMessageRequest {
  messages: Array<{
    from: string;
    to: string;
    content: {
      text: string;
    };
  }>;
}

interface InfobipSendMessageResponse {
  messages: Array<{
    to: string;
    messageId: string;
    status: {
      groupId: number;
      groupName: string;
      id: number;
      name: string;
      description: string;
    };
  }>;
  bulkId?: string;
}

// ============================================================================
// Environment Variables
// ============================================================================

function getEnvVar(name: string, required = true): string {
  const value = Deno.env.get(name);
  if (!value && required) {
    throw new Error(`Missing required environment variable: ${name}`);
  }
  return value || '';
}

const ENV = {
  SUPABASE_URL: () => getEnvVar('SUPABASE_URL'),
  SUPABASE_SERVICE_ROLE_KEY: () => getEnvVar('SUPABASE_SERVICE_ROLE_KEY'),
  INFOBIP_API_KEY: () => getEnvVar('INFOBIP_API_KEY'),
  INFOBIP_BASE_URL: () => getEnvVar('INFOBIP_BASE_URL'),
  INFOBIP_PHONE_NUMBER: () => getEnvVar('INFOBIP_PHONE_NUMBER'),
  GEMINI_API_KEY: () => getEnvVar('GEMINI_API_KEY', false),
  ANTHROPIC_API_KEY: () => getEnvVar('ANTHROPIC_API_KEY', false),
};

// ============================================================================
// Supabase Client
// ============================================================================

function createServiceClient() {
  return createClient(
    ENV.SUPABASE_URL(),
    ENV.SUPABASE_SERVICE_ROLE_KEY(),
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    }
  );
}

// ============================================================================
// Database Operations
// ============================================================================

async function storeMessage(
  supabase: ReturnType<typeof createServiceClient>,
  phoneNumber: string,
  direction: 'inbound' | 'outbound',
  content: string,
  sender: 'user' | 'assistant',
  externalId?: string,
  status: 'pending' | 'sent' | 'delivered' | 'read' | 'failed' = 'pending'
) {
  const { data, error } = await supabase
    .from('whatsapp_messages')
    .insert({
      phone_number: phoneNumber,
      direction,
      message_type: 'text',
      content,
      sender,
      external_id: externalId,
      status,
    })
    .select()
    .single();

  if (error) {
    console.error('Error storing message:', error);
    throw error;
  }

  return data;
}

async function upsertConversation(
  supabase: ReturnType<typeof createServiceClient>,
  phoneNumber: string
) {
  // First, check if conversation exists
  const { data: existing } = await supabase
    .from('whatsapp_conversations')
    .select('message_count')
    .eq('phone_number', phoneNumber)
    .single();

  const newCount = (existing?.message_count || 0) + 1;

  const { data, error } = await supabase
    .from('whatsapp_conversations')
    .upsert(
      {
        phone_number: phoneNumber,
        last_message_at: new Date().toISOString(),
        message_count: newCount,
      },
      {
        onConflict: 'phone_number',
      }
    )
    .select()
    .single();

  if (error) {
    console.error('Error upserting conversation:', error);
    throw error;
  }

  return data;
}

async function getConversationHistory(
  supabase: ReturnType<typeof createServiceClient>,
  phoneNumber: string,
  limit: number = 5
) {
  const { data, error } = await supabase
    .from('whatsapp_messages')
    .select('sender, content, created_at')
    .eq('phone_number', phoneNumber)
    .order('created_at', { ascending: false })
    .limit(limit);

  if (error) {
    console.error('Error getting conversation history:', error);
    return [];
  }

  return (data || []).reverse(); // Reverse to get chronological order
}

// ============================================================================
// AI Integration
// ============================================================================

const SYSTEM_PROMPT = `You are ILM (I Love Medellín), a friendly AI concierge helping people discover and book apartments, cars, restaurants, and events in Medellín.

Keep responses:
- Short and friendly (under 160 characters when possible)
- In Spanish (respond in the user's language)
- Helpful and informative

You can help with:
- Finding apartments, cars, restaurants, events
- Answering questions about Medellín
- Providing recommendations

If the user asks about booking, say: "I can help you find options! What are you looking for? (Apartments, cars, restaurants, or events)"

Conversation history:
{conversation_history}

User message: {user_message}`;

async function callGemini(
  conversationHistory: Array<{ sender: string; content: string }>,
  userMessage: string
): Promise<string> {
  const apiKey = ENV.GEMINI_API_KEY();
  if (!apiKey) {
    throw new Error('GEMINI_API_KEY not configured');
  }

  // Format conversation history
  const historyText = conversationHistory
    .map((msg) => `${msg.sender === 'user' ? 'User' : 'Assistant'}: ${msg.content}`)
    .join('\n');

  const prompt = SYSTEM_PROMPT
    .replace('{conversation_history}', historyText || 'No previous messages')
    .replace('{user_message}', userMessage);

  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp:generateContent?key=${apiKey}`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [{ text: prompt }],
          },
        ],
        generationConfig: {
          temperature: 0.7,
          maxOutputTokens: 200,
        },
      }),
    }
  );

  if (!response.ok) {
    const errorText = await response.text();
    console.error('Gemini API error:', errorText);
    throw new Error(`Gemini API error: ${response.status}`);
  }

  const data = await response.json();
  const text = data.candidates?.[0]?.content?.parts?.[0]?.text;

  if (!text) {
    throw new Error('No text in Gemini response');
  }

  return text.trim();
}

async function callClaude(
  conversationHistory: Array<{ sender: string; content: string }>,
  userMessage: string
): Promise<string> {
  const apiKey = ENV.ANTHROPIC_API_KEY();
  if (!apiKey) {
    throw new Error('ANTHROPIC_API_KEY not configured');
  }

  // Format conversation history
  const messages = conversationHistory.map((msg) => ({
    role: msg.sender === 'user' ? 'user' : 'assistant',
    content: msg.content,
  }));

  messages.push({
    role: 'user',
    content: userMessage,
  });

  const response = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': apiKey,
      'anthropic-version': '2023-06-01',
    },
    body: JSON.stringify({
      model: 'claude-3-5-sonnet-20241022',
      max_tokens: 200,
      system: SYSTEM_PROMPT.replace('{conversation_history}', 'See conversation history').replace('{user_message}', ''),
      messages,
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error('Claude API error:', errorText);
    throw new Error(`Claude API error: ${response.status}`);
  }

  const data = await response.json();
  const text = data.content?.[0]?.text;

  if (!text) {
    throw new Error('No text in Claude response');
  }

  return text.trim();
}

async function getAIResponse(
  conversationHistory: Array<{ sender: string; content: string }>,
  userMessage: string
): Promise<string> {
  // Try Gemini first, fallback to Claude
  try {
    return await callGemini(conversationHistory, userMessage);
  } catch (error) {
    console.warn('Gemini failed, trying Claude:', error);
    try {
      return await callClaude(conversationHistory, userMessage);
    } catch (claudeError) {
      console.error('Both AI services failed:', claudeError);
      return 'Lo siento, estoy teniendo problemas técnicos. Por favor intenta de nuevo en un momento.';
    }
  }
}

// ============================================================================
// Infobip API Integration
// ============================================================================

async function sendWhatsAppMessage(
  to: string,
  text: string
): Promise<string> {
  const apiKey = ENV.INFOBIP_API_KEY();
  const baseUrl = ENV.INFOBIP_BASE_URL();
  const fromNumber = ENV.INFOBIP_PHONE_NUMBER();

  const payload: InfobipSendMessageRequest = {
    messages: [
      {
        from: fromNumber,
        to: to,
        content: {
          text: text,
        },
      },
    ],
  };

  const response = await fetch(`${baseUrl}/whatsapp/1/messages`, {
    method: 'POST',
    headers: {
      'Authorization': `App ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error('Infobip API error:', errorText);
    throw new Error(`Infobip API error: ${response.status} - ${errorText}`);
  }

  const data: InfobipSendMessageResponse = await response.json();
  const messageId = data.messages?.[0]?.messageId;

  if (!messageId) {
    throw new Error('No messageId in Infobip response');
  }

  return messageId;
}

// ============================================================================
// Webhook Handler
// ============================================================================

function normalizePhoneNumber(phone: string): string {
  // Remove all non-digit characters except +
  let normalized = phone.replace(/[^\d+]/g, '');
  
  // Ensure it starts with +
  if (!normalized.startsWith('+')) {
    normalized = '+' + normalized;
  }
  
  return normalized;
}

async function handleWebhook(req: Request): Promise<Response> {
  try {
    // Parse Infobip webhook payload
    const payload: InfobipWebhookPayload = await req.json();

    if (!payload.results || payload.results.length === 0) {
      console.log('No results in webhook payload');
      return new Response(JSON.stringify({ status: 'ok' }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const supabase = createServiceClient();

    // Process each message in the webhook
    for (const result of payload.results) {
      const phoneNumber = normalizePhoneNumber(result.from);
      const messageText = result.message?.text;

      if (!messageText) {
        console.log('No text in message, skipping');
        continue;
      }

      console.log(`Processing message from ${phoneNumber}: ${messageText}`);

      // Store inbound message
      await storeMessage(
        supabase,
        phoneNumber,
        'inbound',
        messageText,
        'user',
        result.messageId,
        'pending'
      );

      // Update conversation
      await upsertConversation(supabase, phoneNumber);

      // Get conversation history
      const history = await getConversationHistory(supabase, phoneNumber, 5);

      // Get AI response
      const aiResponse = await getAIResponse(
        history.map((h) => ({ sender: h.sender, content: h.content })),
        messageText
      );

      console.log(`AI response: ${aiResponse}`);

      // Send response via Infobip
      let externalId: string | undefined;
      try {
        externalId = await sendWhatsAppMessage(phoneNumber, aiResponse);
        console.log(`Message sent, ID: ${externalId}`);

        // Store outbound message
        await storeMessage(
          supabase,
          phoneNumber,
          'outbound',
          aiResponse,
          'assistant',
          externalId,
          'sent'
        );
      } catch (error) {
        console.error('Error sending message:', error);
        
        // Store failed message
        await storeMessage(
          supabase,
          phoneNumber,
          'outbound',
          aiResponse,
          'assistant',
          undefined,
          'failed'
        );
      }
    }

    return new Response(JSON.stringify({ status: 'ok' }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Webhook error:', error);
    
    // Always return 200 to avoid Infobip retries
    return new Response(
      JSON.stringify({ 
        status: 'error', 
        message: error instanceof Error ? error.message : 'Unknown error' 
      }),
      {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  }
}

// ============================================================================
// Main Handler
// ============================================================================

Deno.serve(async (req: Request) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response(null, {
      status: 204,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
      },
    });
  }

  // Only accept POST requests
  if (req.method !== 'POST') {
    return new Response(
      JSON.stringify({ error: 'Method not allowed' }),
      {
        status: 405,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  }

  return handleWebhook(req);
});