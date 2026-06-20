import {
  Avatar,
  AvatarImage,
  AvatarFallback,
  AvatarGroup,
  AvatarGroupCount,
} from "mdeapp"

export const WithImage = () => (
  <Avatar>
    <AvatarImage src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='80' height='80' viewBox='0 0 80 80'%3E%3Crect width='80' height='80' rx='40' fill='%23E5E7EB'/%3E%3Ctext x='40' y='46' font-size='20' text-anchor='middle' fill='%236B7280' font-family='ui-sans-serif,system-ui'%3ERO%3C/text%3E%3C/svg%3E" alt="Roberto" />
    <AvatarFallback>RO</AvatarFallback>
  </Avatar>
)

export const Fallback = () => (
  <div className="flex items-center gap-3">
    <Avatar>
      <AvatarFallback>CA</AvatarFallback>
    </Avatar>
    <Avatar>
      <AvatarFallback>AN</AvatarFallback>
    </Avatar>
    <Avatar>
      <AvatarFallback>MI</AvatarFallback>
    </Avatar>
  </div>
)

export const Group = () => (
  <AvatarGroup>
    <Avatar>
      <AvatarFallback>CA</AvatarFallback>
    </Avatar>
    <Avatar>
      <AvatarFallback>RO</AvatarFallback>
    </Avatar>
    <Avatar>
      <AvatarFallback>AN</AvatarFallback>
    </Avatar>
    <AvatarGroupCount>+5</AvatarGroupCount>
  </AvatarGroup>
)
