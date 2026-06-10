Here's your handoff prompt for the new chat:

connect to linear verify working update linear

---https://linear.app/sanjiovani/project/ux-0ad555e403b4/issues

**Context handoff — mdeai mdeapp, continuing from previous session**

**What's done:**

- PR #118 merged: `@langchain/core@1.1.48` added to fix CopilotKit 500 on startup. `engines: node>=20` and `.nvmrc` (22.22.3) added. Lockfile surgically patched.

- PR #114 merged: SAN-718 Home Discovery Rows live data — four fixes: calendar-day date comparison in `formatEventDate`, `sport` enum key in `EVENT_CATEGORY_LABEL`, COP currency symbol, stale eslint-disable comments removed. Commit: `2cf2af3` on main.

- Linear MCP `linear-server` was added (`claude mcp add --transport http linear-server https://mcp.linear.app/mcp`) and shows `✓ Connected` in `claude mcp list`. The old `plugin:linear:linear` entry still fails with `net::ERR_FAILED` (expired OAuth token) — use `linear-server` tooling only.

**What's pending:**

1. Clean up worktree: `/home/sk/mdeai/mdeapp/.claude/worktrees/san-718-home-discovery-live` (SAN-718 is merged, worktree can be deleted)

2. Mark SAN-718 as Done in Linear

3. Start SAN-715, SAN-716, SAN-717 — fetch their specs from Linear first (use `mcp__<linear-server-id>__get_issue` for SAN-715, SAN-716, SAN-717)

4. Note: main mdeapp checkout is on branch `ai/san-723-signup-activate-integration` with uncommitted partner changes — don't touch that branch

**Repo:** `/home/sk/mdeai/mdeapp`

**Run commands from:** `cd /home/sk/mdeai/mdeapp` (not the worktree)

**Secrets:** injected via `infisical run --silent --env=dev --path=/ --`

**Linear:** use `claude mcp list` to confirm `linear-server` is connected, then fetch SAN-715/716/717 issue details before starting any code

Start by: (1) confirm `linear-server` connected, (2) fetch SAN-715/716/717 from Linear, (3) clean up the SAN-718 worktree, (4) mark SAN-718 Done. we need to finish off the marketing website pages