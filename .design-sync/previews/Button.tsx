import { Button } from "mdeapp"

export const Primary = () => <Button>Publish event</Button>

export const Variants = () => (
  <div className="flex flex-wrap items-center gap-2">
    <Button variant="default">Default</Button>
    <Button variant="secondary">Secondary</Button>
    <Button variant="outline">Outline</Button>
    <Button variant="ghost">Ghost</Button>
    <Button variant="destructive">Cancel ticket</Button>
    <Button variant="link">View details</Button>
  </div>
)

export const Sizes = () => (
  <div className="flex flex-wrap items-center gap-2">
    <Button size="sm">Small</Button>
    <Button size="default">Default</Button>
    <Button size="lg">Large</Button>
  </div>
)

export const Disabled = () => <Button disabled>Publishing…</Button>
