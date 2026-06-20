import { Input, Label } from "mdeapp"

export const Default = () => (
  <Input className="w-72" placeholder="Search Medellín events…" />
)

export const WithLabel = () => (
  <div className="grid w-72 gap-1.5">
    <Label htmlFor="event-name">Event name</Label>
    <Input id="event-name" defaultValue="Salsa Night at Envy Rooftop" />
  </div>
)

export const Disabled = () => (
  <Input className="w-72" placeholder="Locked while publishing" disabled />
)
