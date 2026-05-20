// SavedItemsCard — mdeai-themed adaptation of CopilotKit's ProverbsCard demo.
// Pattern: bidirectional shared state via `useCoAgent<T>` — items can be added/removed
// by either the user (click ✕) or the agent (state mutation via tool calls).
// Foundation for W5 Camila's saved-places list and similar list-of-things UX.
//
// Generic over T so each surface can wire its own state shape:
//   <SavedItemsCard items={state.savedItems} onRemove={...} />

export interface SavedItemsCardProps {
  title?: string;
  emptyMessage?: string;
  items: string[];
  /** Called when user removes an item; parent should update agent state. */
  onRemove?: (index: number) => void;
}

export function SavedItemsCard({
  title = "Saved items",
  emptyMessage = "Nothing saved yet. Ask the assistant to save something.",
  items,
  onRemove,
}: SavedItemsCardProps) {
  return (
    <div className="bg-white/85 backdrop-blur-md p-6 rounded-2xl shadow-xl max-w-2xl w-full text-slate-900">
      <h2 className="text-2xl font-bold mb-2 text-center">{title}</h2>
      <p className="text-slate-500 text-center text-sm italic mb-4">
        Shared state demo — agent and user can both add or remove items.
      </p>
      <hr className="border-slate-200 my-4" />

      <div className="flex flex-col gap-2">
        {items.map((item, index) => (
          <div
            key={`${index}-${item}`}
            className="bg-slate-100 p-3 rounded-lg relative group hover:bg-slate-200 transition-all"
          >
            <p className="pr-8 text-sm">{item}</p>
            {onRemove && (
              <button
                onClick={() => onRemove(index)}
                aria-label={`Remove ${item}`}
                className="absolute right-2 top-2 opacity-0 group-hover:opacity-100 transition-opacity
                  bg-red-500 hover:bg-red-600 text-white rounded-full h-6 w-6 flex items-center justify-center text-xs"
              >
                ✕
              </button>
            )}
          </div>
        ))}
      </div>

      {items.length === 0 && (
        <p className="text-center text-slate-400 italic my-6 text-sm">{emptyMessage}</p>
      )}
    </div>
  );
}
