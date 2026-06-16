/**
 * COST-001 — wraps a Gemini model so its token usage is recorded into the active
 * per-turn {@link TokenSink}. This is the only place model usage is observed; it
 * wraps the shared models in `./models` so every agent call is covered without
 * touching CopilotKit, AG-UI, or the agent definitions.
 *
 * Implemented as a transparent Proxy over the AI-SDK v2 model (rather than `ai`'s
 * `wrapLanguageModel`, which targets the v3 model spec while `@ai-sdk/google`
 * ships v2). The Proxy forwards every member untouched and only intercepts:
 *   - `doGenerate`: reads `result.usage` after a non-streaming call.
 *   - `doStream`: tees the stream and reads the `"finish"` part's usage without
 *     consuming the stream the caller still needs (streaming + tool-call turns).
 * Aborts/partial failures never emit `finish`, so the sink keeps its last total —
 * safe by construction. Multi-step turns add per call (cumulative).
 */
import type {
  LanguageModelV2,
  LanguageModelV2StreamPart,
} from "@ai-sdk/provider";
import { addModelUsage } from "./token-usage-als";

type DoStreamReturn = Awaited<ReturnType<LanguageModelV2["doStream"]>>;
type DoGenerateReturn = Awaited<ReturnType<LanguageModelV2["doGenerate"]>>;

function recordFromStream(
  stream: DoStreamReturn["stream"],
): DoStreamReturn["stream"] {
  const tap = new TransformStream<
    LanguageModelV2StreamPart,
    LanguageModelV2StreamPart
  >({
    transform(part, controller) {
      if (part.type === "finish") {
        addModelUsage({
          inputTokens: part.usage?.inputTokens,
          outputTokens: part.usage?.outputTokens,
          totalTokens: part.usage?.totalTokens,
        });
      }
      controller.enqueue(part);
    },
  });
  return stream.pipeThrough(tap);
}

/** Wrap a model so its token usage flows into the active turn's sink. */
export function withTokenUsageTracking(
  model: LanguageModelV2,
): LanguageModelV2 {
  return new Proxy(model, {
    get(target, prop, receiver) {
      if (prop === "doGenerate") {
        return async (
          ...args: Parameters<LanguageModelV2["doGenerate"]>
        ): Promise<DoGenerateReturn> => {
          const result = await target.doGenerate(...args);
          addModelUsage({
            inputTokens: result.usage?.inputTokens,
            outputTokens: result.usage?.outputTokens,
            totalTokens: result.usage?.totalTokens,
          });
          return result;
        };
      }
      if (prop === "doStream") {
        return async (
          ...args: Parameters<LanguageModelV2["doStream"]>
        ): Promise<DoStreamReturn> => {
          const { stream, ...rest } = await target.doStream(...args);
          return { stream: recordFromStream(stream), ...rest };
        };
      }
      return Reflect.get(target, prop, receiver);
    },
  });
}
