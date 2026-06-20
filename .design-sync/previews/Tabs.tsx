import { Tabs, TabsList, TabsTrigger, TabsContent } from "mdeapp"

export const EventWizard = () => (
  <Tabs defaultValue="details" className="w-96">
    <TabsList>
      <TabsTrigger value="details">Details</TabsTrigger>
      <TabsTrigger value="tickets">Tickets</TabsTrigger>
      <TabsTrigger value="venue">Venue</TabsTrigger>
    </TabsList>
    <TabsContent value="details" className="pt-3 text-sm text-muted-foreground">
      Name, date, and description for your Medellín event.
    </TabsContent>
    <TabsContent value="tickets" className="pt-3 text-sm text-muted-foreground">
      Three tiers — General, VIP, and Table service.
    </TabsContent>
    <TabsContent value="venue" className="pt-3 text-sm text-muted-foreground">
      Envy Rooftop, El Poblado · capacity 240.
    </TabsContent>
  </Tabs>
)
