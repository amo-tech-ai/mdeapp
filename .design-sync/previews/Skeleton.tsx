import { Skeleton } from "mdeapp"

export const Line = () => <Skeleton className="h-4 w-48" />

export const EventCardLoading = () => (
  <div className="flex w-80 items-center gap-3">
    <Skeleton className="size-12 rounded-full" />
    <div className="grid flex-1 gap-2">
      <Skeleton className="h-4 w-3/4" />
      <Skeleton className="h-3 w-1/2" />
    </div>
  </div>
)
