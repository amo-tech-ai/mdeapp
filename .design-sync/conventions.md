# mdeapp UI Primitives — how to build with these components

These are the shadcn-style base primitives from the **mdeapp** Next.js app
(built on `@base-ui/react` + `class-variance-authority`). Compose them; do not
restyle them. They carry the mdeai brand: a teal `--primary`, gold `--accent`,
slate foreground, on an off-white background.

## Setup / wrapping
- **No global provider is required** for most components — import and render
  them directly.
- **Tooltip is the one exception**: wrap any tooltip in `<TooltipProvider>` and
  use `<Tooltip><TooltipTrigger render={<Button…/>} /><TooltipContent>…</TooltipContent></Tooltip>`.
- **Dark mode** is class-based: put `className="dark"` on an ancestor element.
  All tokens flip automatically; never hard-code hex colors.

## Styling idiom — Tailwind v4 utility classes, token-backed
Style layout and color with Tailwind utility classes whose color names resolve
to the design tokens. Use these token classes, NOT raw colors like `bg-blue-500`:

| Purpose | Classes |
|---|---|
| Brand action | `bg-primary` `text-primary-foreground` `ring-ring` |
| Accent (gold) | `bg-accent` `text-accent-foreground` |
| Surfaces | `bg-background` `bg-card` `bg-popover` `bg-background-elevated` |
| Muted / subdued | `bg-muted` `text-muted-foreground` `bg-secondary` |
| Text | `text-foreground` `text-muted-foreground` |
| Status | `text-destructive` `bg-destructive/10` `text-success` |
| Borders / rings | `border-border` `border-input` `ring-2` |
| Radius | `rounded-md` `rounded-lg` `rounded-xl` `rounded-full` (token-scaled) |
| Type | `text-sm` `font-medium` (the brand sans family is applied globally — no font utility needed) |

Use opacity modifiers the components already use (`bg-primary/80`,
`bg-destructive/10`). Spacing/sizing use ordinary Tailwind utilities
(`gap-2`, `p-3`, `w-72`, `size-8`).

## Where the truth lives
- The token definitions (light + `.dark`) and the full utility set are in the
  bound `styles.css` and `_ds_bundle.css` — read those before inventing classes.
- Each component's API contract is its `<Name>.d.ts`; usage examples are in its
  `<Name>.prompt.md`.

## One idiomatic example
```jsx
<Card className="w-80">
  <CardHeader>
    <CardTitle>Salsa Night at Envy Rooftop</CardTitle>
    <CardDescription>Fri, Jun 27 · El Poblado, Medellín</CardDescription>
    <CardAction><Badge variant="secondary">Draft</Badge></CardAction>
  </CardHeader>
  <CardContent className="text-sm text-muted-foreground">
    240 tickets across three tiers.
  </CardContent>
  <CardFooter className="justify-between">
    <span className="text-sm font-medium">From $35</span>
    <Button size="sm">Publish</Button>
  </CardFooter>
</Card>
```
Button variants: `default secondary outline ghost destructive link`; sizes
`sm default lg` (+ `icon` variants). Badge variants: `default secondary outline
destructive ghost`. Toggle: `default | outline`, controlled by `pressed` /
`defaultPressed`.
