import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardAction,
  CardContent,
  CardFooter,
  Button,
  Badge,
} from "mdeapp"

export const EventCard = () => (
  <Card className="w-80">
    <CardHeader>
      <CardTitle>Salsa Night at Envy Rooftop</CardTitle>
      <CardDescription>Fri, Jun 27 · El Poblado, Medellín</CardDescription>
      <CardAction>
        <Badge variant="secondary">Draft</Badge>
      </CardAction>
    </CardHeader>
    <CardContent className="text-sm text-muted-foreground">
      Live band, two dance floors, and a welcome cocktail. 240 tickets across
      three tiers.
    </CardContent>
    <CardFooter className="justify-between">
      <span className="text-sm font-medium">From $35</span>
      <Button size="sm">Publish</Button>
    </CardFooter>
  </Card>
)
