import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
  TooltipProvider,
  Button,
} from "mdeapp"

export const Open = () => (
  <TooltipProvider>
    <div className="flex justify-center p-10">
      <Tooltip defaultOpen>
        <TooltipTrigger
          render={<Button variant="outline">Publish</Button>}
        />
        <TooltipContent>Goes live at mdeai.co immediately</TooltipContent>
      </Tooltip>
    </div>
  </TooltipProvider>
)
