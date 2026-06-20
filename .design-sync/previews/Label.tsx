import { Label, Input } from "mdeapp"

export const Default = () => <Label>Ticket price</Label>

export const WithControl = () => (
  <div className="grid w-72 gap-1.5">
    <Label htmlFor="price">Ticket price (USD)</Label>
    <Input id="price" type="number" defaultValue={35} />
  </div>
)
