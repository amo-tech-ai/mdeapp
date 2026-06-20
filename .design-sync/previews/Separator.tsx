import { Separator } from "mdeapp"

export const Horizontal = () => (
  <div className="w-72">
    <div className="text-sm font-medium">Event details</div>
    <Separator className="my-3" />
    <div className="text-sm text-muted-foreground">Venue · Tickets · Schedule</div>
  </div>
)

export const Vertical = () => (
  <div className="flex h-8 items-center gap-3 text-sm">
    <span>240 tickets</span>
    <Separator orientation="vertical" />
    <span>3 tiers</span>
    <Separator orientation="vertical" />
    <span>From $35</span>
  </div>
)
