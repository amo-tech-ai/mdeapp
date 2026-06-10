# GitHub ↔ Linear (manual — ~5 min)

Linear has no API for integration settings. Do this once in the UI.

## Steps

1. Open **Linear → Settings → Integrations → GitHub**
2. Connect org **`amo-tech-ai`**, repo **`mdeapp`**
3. Enable:
   - Link PRs when branch/title/body contains `SAN-###` or `ai/san-###-`
   - **PR opened** → move issue to **In Review**
   - **PR merged** to `main` → move issue to **Done**

## Branch convention (already in use)

```text
ai/san-316-rnt-001-fix-rental-price-parsing-500-a-night
```

## Verify

Open [SAN-316](https://linear.app/sanjiovani/issue/SAN-316) after your next PR — should show linked PR and auto status.
