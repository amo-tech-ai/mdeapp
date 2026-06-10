/**
 * WhatsApp message templates for lead notifications — D11.5.
 *
 * Plain text bodies in Spanish (es-CO), formal "tú" register since
 * landlords are peers (not customers). Two templates:
 *
 *   1. New lead — fired on landlord_inbox INSERT (channel='form').
 *   2. 30-min reminder — fired by lead-reminder-tick if status='new'
 *      and reminder_sent_at IS NULL after 30 min.
 *
 * Pure functions. The deno test asserts content + length so a careless
 * edit doesn't blow past Twilio's 1600-char limit.
 */

export type MoveWhen = "now" | "soon" | "later";

const MOVE_WHEN_LABEL_ES: Record<MoveWhen, string> = {
  now: "ahora (próximas semanas)",
  soon: "pronto (1-3 meses)",
  later: "más adelante (sin apuro)",
};

export interface NewLeadInput {
  /** First-name greeting (e.g. "Mario"). */
  landlordFirstName: string;
  /** Renter name from form. */
  renterName: string;
  /** Apartment title (truncated to 60 chars). */
  apartmentTitle: string;
  /** Apartment neighborhood, optional. */
  apartmentNeighborhood?: string | null;
  /** When the renter wants to move (or null for chat-channel leads pre D8). */
  moveWhen?: MoveWhen | null;
  /** First ~200 chars of the renter's free-text message. */
  messageSnippet: string;
  /** Public URL to the lead detail page (D9 inbox). */
  leadUrl: string;
}

export interface ReminderInput {
  landlordFirstName: string;
  renterName: string;
  apartmentTitle: string;
  /** How long ago the lead landed (already pretty-printed e.g. "30 min"). */
  ageLabel: string;
  leadUrl: string;
}

const PROMPT_LABEL = "📬 Ver y responder";

function truncate(s: string, max: number): string {
  const t = s.trim();
  return t.length > max ? `${t.slice(0, max - 1).trim()}…` : t;
}

/** Body for the FIRST send (when the lead lands). */
export function renderNewLeadMessage(input: NewLeadInput): string {
  const greeting = `Hola ${input.landlordFirstName.trim() || "Anfitrión"} 👋`;
  const where = input.apartmentNeighborhood
    ? `${truncate(input.apartmentTitle, 60)} (${input.apartmentNeighborhood})`
    : truncate(input.apartmentTitle, 60);
  const renter = truncate(input.renterName, 40);
  const moveLine = input.moveWhen
    ? `🗓️ Quiere mudarse: ${MOVE_WHEN_LABEL_ES[input.moveWhen]}`
    : `🗓️ Sin fecha indicada`;
  const message = truncate(input.messageSnippet, 200);

  return [
    `${greeting} — tienes una nueva consulta en mdeai 🏠`,
    ``,
    `📍 ${where}`,
    `👤 ${renter} pregunta:`,
    `"${message}"`,
    ``,
    moveLine,
    ``,
    `${PROMPT_LABEL}: ${input.leadUrl}`,
  ].join("\n");
}

/** Body for the 30-minute reminder. */
export function renderReminderMessage(input: ReminderInput): string {
  return [
    `⏰ Recordatorio (${input.ageLabel})`,
    ``,
    `${input.renterName} aún espera respuesta sobre "${truncate(input.apartmentTitle, 60)}".`,
    ``,
    `Las primeras horas son las más importantes — los renters comparan 3-5 anuncios y reservan rápido.`,
    ``,
    `${PROMPT_LABEL}: ${input.leadUrl}`,
  ].join("\n");
}
