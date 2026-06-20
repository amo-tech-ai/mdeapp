import { Toggle } from "mdeapp"

export const Default = () => <Toggle>Map view</Toggle>

export const Pressed = () => <Toggle defaultPressed>List view</Toggle>

export const Variants = () => (
  <div className="flex items-center gap-2">
    <Toggle variant="default" defaultPressed>
      Default
    </Toggle>
    <Toggle variant="outline">Outline</Toggle>
  </div>
)
