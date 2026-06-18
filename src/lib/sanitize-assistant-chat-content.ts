/** Strip tool payloads the model sometimes echoes into chat prose. */

function findBalancedJsonEnd(text: string, start: number): number {
  if (text[start] !== "{") return -1;
  let depth = 0;
  let inString = false;
  let escape = false;

  for (let i = start; i < text.length; i++) {
    const c = text[i];
    if (escape) {
      escape = false;
      continue;
    }
    if (inString) {
      if (c === "\\") escape = true;
      else if (c === '"') inString = false;
      continue;
    }
    if (c === '"') {
      inString = true;
      continue;
    }
    if (c === "{") depth++;
    if (c === "}") {
      depth--;
      if (depth === 0) return i + 1;
    }
  }
  return -1;
}

// skipcq: JS-0067
function groundingResultsContainPlaceId(results: unknown[]): boolean {
  return results.some(
    (r) =>
      r &&
      typeof r === "object" &&
      ("placeId" in r || "place_id" in (r as object)),
  );
}

export function isToolLeakJson(value: unknown): boolean {
  if (typeof value !== "object" || value === null) return false;
  const o = value as Record<string, unknown>;
  if (o.success === true || o.success === false) {
    return Object.keys(o).length <= 2;
  }
  if (o.source === "grounding") return true;
  if (Array.isArray(o.results) && groundingResultsContainPlaceId(o.results)) {
    return true;
  }
  return false;
}

export function stripBalancedJsonObjects(
  text: string,
  shouldRemove: (parsed: unknown) => boolean,
): string {
  let result = text;
  let searchFrom = 0;

  while (searchFrom < result.length) {
    const start = result.indexOf("{", searchFrom);
    if (start === -1) break;
    const end = findBalancedJsonEnd(result, start);
    if (end === -1) break;

    const slice = result.slice(start, end);
    let remove = false;
    try {
      remove = shouldRemove(JSON.parse(slice));
    } catch {
      remove = false;
    }

    if (remove) {
      result = result.slice(0, start) + result.slice(end);
      searchFrom = start;
      continue;
    }
    searchFrom = start + 1;
  }

  return result;
}

/** Model echo of GroundingAttribution UI — venue list without links. */
function stripGoogleMapsSourcesEcho(content: string): string {
  const marker = /(?:^|\n)\s*Google Maps sources\s*\n/i;
  if (!marker.test(content)) return content;

  const idx = content.search(marker);
  const before = content.slice(0, idx).trim();
  const tail = content.slice(idx).trim();
  const tailLines = tail.split("\n").map((l) => l.trim()).filter(Boolean);
  const bodyLines = tailLines.slice(1);

  const venueListEcho =
    bodyLines.length > 0 &&
    bodyLines.every(
      (line) =>
        line.length < 120 &&
        !/[.!?]/.test(line) &&
        !/^I found/i.test(line) &&
        !line.startsWith("{"),
    );

  if (venueListEcho) return before;
  return content;
}

/** Rental cards render below chat — drop duplicated Mindtrip-style prose. */
function stripRentalResultsBoilerplate(content: string): string {
  const lower = content.toLowerCase();
  const hasRentalIntro =
    lower.includes("solid short-term rental") ||
    lower.includes("what i searched for");
  const hasRentalSections =
    lower.includes("best option") &&
    (lower.includes("next step") || lower.includes("why these match"));
  if (hasRentalIntro && hasRentalSections) return "";
  return content;
}

export function isRentalResultsBoilerplate(content: string): boolean {
  return stripRentalResultsBoilerplate(content) === "";
}

export function sanitizeAssistantChatContent(content: string): string {
  if (!content.trim()) return content;

  let out = stripBalancedJsonObjects(content, isToolLeakJson);
  out = stripGoogleMapsSourcesEcho(out);
  out = stripRentalResultsBoilerplate(out);

  out = out.replace(/^#{0,3}\s*maps grounding\s*$/gim, "");

  return out.replace(/\n{3,}/g, "\n\n").trim();
}

export function isToolPayloadChatContent(content: string): boolean {
  if (!content.trim()) return false;
  if (shouldHideAssistantChatContent(content)) return true;
  if (/"source"\s*:\s*"grounding"/.test(content)) return true;
  if (/"placeId"\s*:\s*"ChIJ/.test(content)) return true;
  if (/^\s*\{\s*"success"\s*:\s*true\s*\}\s*$/i.test(content.trim())) return true;
  return false;
}

export function shouldHideAssistantChatContent(content: string): boolean {
  const sanitized = sanitizeAssistantChatContent(content);
  if (!sanitized) return true;
  return !/[a-zA-Z0-9]/.test(sanitized);
}

export function getAssistantMessageText(message: {
  content?: unknown;
  text?: string;
}): string {
  if (typeof message.text === "string") return message.text;
  const { content } = message;
  if (typeof content === "string") return content;
  if (Array.isArray(content)) {
    return content
      .map((part) => {
        if (part && typeof part === "object" && "text" in part) {
          return typeof part.text === "string" ? part.text : "";
        }
        return "";
      })
      .filter(Boolean)
      .join("\n");
  }
  return "";
}
