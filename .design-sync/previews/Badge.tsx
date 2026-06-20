import { Badge } from "mdeapp"

export const Default = () => <Badge>Published</Badge>

export const Variants = () => (
  <div className="flex flex-wrap items-center gap-2">
    <Badge variant="default">Live</Badge>
    <Badge variant="secondary">Draft</Badge>
    <Badge variant="outline">Scheduled</Badge>
    <Badge variant="destructive">Sold out</Badge>
    <Badge variant="ghost">Archived</Badge>
  </div>
)
