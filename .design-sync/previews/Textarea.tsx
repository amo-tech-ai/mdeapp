import { Textarea, Label } from "mdeapp"

export const Default = () => (
  <Textarea
    className="w-80"
    rows={4}
    placeholder="Describe your event for guests…"
  />
)

export const WithLabel = () => (
  <div className="grid w-80 gap-1.5">
    <Label htmlFor="desc">Event description</Label>
    <Textarea
      id="desc"
      rows={4}
      defaultValue="Live band, two dance floors, and a welcome cocktail in El Poblado."
    />
  </div>
)
