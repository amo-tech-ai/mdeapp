/**
 * Founder-side notification dispatcher — Landlord V1 D6.
 *
 * V1 strategy: this is a stub that logs to the edge-function log so the
 * founder can copy/paste the moderation link during the early cohort
 * (D6-D10). D11 swaps the implementation for Resend without touching
 * callers — the contract here stays the same.
 *
 * If FOUNDER_NOTIFY_WEBHOOK is set (a Slack/Discord/Zapier webhook URL),
 * we POST the rendered email body to it as a fire-and-forget heads-up.
 * That covers the "I'm AFK and need to approve a listing" case without
 * the Resend wiring.
 */

export interface FounderEmail {
  /** Recipient address. Defaults to FOUNDER_EMAIL secret. */
  to?: string;
  subject: string;
  /** Plain-text body. Used by both stdout-log and webhook paths. */
  text: string;
  /** Optional HTML body for when D11 wires Resend. */
  html?: string;
}

export interface SendResult {
  /** Whether SOME delivery channel acknowledged. False on stub-only mode. */
  delivered: boolean;
  /** Channel(s) used: 'stdout' always; 'webhook' if configured + 200. */
  channels: ("stdout" | "webhook")[];
}

/**
 * Fire-and-forget. Errors are caught + logged so a webhook outage can't
 * fail the listing-create insert. Returns the channels that ack'd.
 */
export async function sendFounderEmail(
  email: FounderEmail,
): Promise<SendResult> {
  const channels: ("stdout" | "webhook")[] = [];
  const recipient = email.to ?? Deno.env.get("FOUNDER_EMAIL") ?? "(unset)";

  // Channel 1: stdout. Always logged so deno-deploy logs become the
  // audit trail until D11 ships real Resend.
  console.log(
    "[founder-email] subject=%s recipient=%s\n%s",
    email.subject,
    recipient,
    email.text,
  );
  channels.push("stdout");

  // Channel 2: optional webhook (Slack-incoming-webhook, Zapier catch-hook,
  // Discord webhook — anything that takes a JSON POST). Best-effort.
  const webhook = Deno.env.get("FOUNDER_NOTIFY_WEBHOOK");
  if (webhook) {
    try {
      const res = await fetch(webhook, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          text: `*${email.subject}*\n\n${email.text}`,
          // Slack-block-kit shape; harmless extras for other webhooks.
          blocks: [
            {
              type: "section",
              text: { type: "mrkdwn", text: `*${email.subject}*` },
            },
            { type: "section", text: { type: "mrkdwn", text: email.text } },
          ],
        }),
      });
      if (res.ok) channels.push("webhook");
      else console.warn("[founder-email] webhook non-2xx:", res.status);
    } catch (err) {
      console.warn("[founder-email] webhook send failed:", err);
    }
  }

  return { delivered: channels.length > 0, channels };
}
