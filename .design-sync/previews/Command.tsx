import {
  Command,
  CommandInput,
  CommandList,
  CommandGroup,
  CommandItem,
  CommandShortcut,
} from "mdeapp"

// Data-driven so the JSX tree stays shallow (DeepSource JS-R1000: ≤4 levels).
const groups = [
  {
    heading: "Events",
    items: [
      { label: "Create event", shortcut: "⌘N" },
      { label: "Publish to mdeai.co" },
      { label: "View attendees" },
    ],
  },
  {
    heading: "Rentals",
    items: [{ label: "Search apartments" }, { label: "Open map view" }],
  },
]

const Item = ({ label, shortcut }: { label: string; shortcut?: string }) => (
  <CommandItem>
    {label}
    {shortcut ? <CommandShortcut>{shortcut}</CommandShortcut> : null}
  </CommandItem>
)

export const Palette = () => (
  <Command className="w-80 rounded-lg border">
    <CommandInput placeholder="Search actions…" />
    <CommandList>
      {groups.map((g) => (
        <CommandGroup key={g.heading} heading={g.heading}>
          {g.items.map((it) => (
            <Item key={it.label} {...it} />
          ))}
        </CommandGroup>
      ))}
    </CommandList>
  </Command>
)
