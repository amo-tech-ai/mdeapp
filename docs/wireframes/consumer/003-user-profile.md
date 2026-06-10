# User Profile
> Route: `/me/profile`  
> User: All roles (Consumer, Host, Sponsor)  
> Phase: Core · P1

---

## Page Goal

Let the user view and update their identity, preferences, and AI memory. Preferences feed directly into the agent's working memory — better preferences → better recommendations. Hosts also manage their public listing profile here.

---

## User Stories

- As Camila, I want to update my budget and neighborhood preference so search results improve.
- As Roberto, I want to update my host profile bio so inquirers see it on my listings.
- As a user, I want to see what the AI has remembered about me and correct it.

---

## Desktop Wireframe — View Mode

```
┌────────────────────────────────────────────────────────────────────────────────┐
│  ▣ mdeai  My Profile                                              🔔  Camila  │
├─────────────────┬──────────────────────────────────────┬───────────────────────┤
│  LEFT 280px     │  CENTER                              │  RIGHT 360px          │
│  ─────────────  │                                      │                       │
│  👤 Profile ←  │  ┌─────────────────────────────┐    │  ┌─────────────────┐  │
│  🎟️ My Tickets  │  │  [Photo]  Camila González   │    │  │  🧠 AI Memory   │  │
│  📌 Saved       │  │           camila@example.co │    │  │  ─────────────  │  │
│  ─────────────  │  │           Consumer · Medelln│    │  │  Budget: $1,200│  │
│                 │  │           [Edit Profile]    │    │  │  Beds: 2BR     │  │
│                 │  └─────────────────────────────┘    │  │  Neighborhoods:│  │
│                 │                                      │  │  Laureles,     │  │
│                 │  Preferences                         │  │  El Poblado    │  │
│                 │  ─────────────────────────────────   │  │  Pets: Yes     │  │
│                 │  Budget (rentals): $800–$1,200/mo   │  │  ─────────────  │  │
│                 │  Neighborhoods: Laureles, Poblado   │  │  [Clear Memory]│  │
│                 │  Bedrooms: 2BR                      │  └─────────────────┘  │
│                 │  Pets: Yes                          │                       │
│                 │  Interests: Jazz, Live Music, Art   │                       │
│                 │  Move-in: January 2026              │                       │
│                 │  [Edit Preferences]                 │                       │
│                 │                                      │                       │
│                 │  ─────────────────────────────────   │                       │
│                 │  Security                            │                       │
│                 │  Email: camila@example.com          │                       │
│                 │  Password: ••••••• [Change]         │                       │
│                 │  Connected: 🔵 Google               │                       │
│                 │  [Sign Out]                         │                       │
└─────────────────┴──────────────────────────────────────┴───────────────────────┘
```

---

## Desktop Wireframe — Edit Preferences Mode

```
┌────────────────────────────────────────────────────────────────────────────────┐
│  ▣ mdeai  My Profile — Edit Preferences                           🔔  Camila  │
├─────────────────┬──────────────────────────────────────┬───────────────────────┤
│  LEFT 280px     │  CENTER                              │  RIGHT 360px          │
│                 │  Edit Preferences                    │                       │
│                 │  ─────────────────────────────────   │  ┌─────────────────┐  │
│                 │  Rental Budget (per month)           │  │  Preview        │  │
│                 │  [$800__] to [$1,200_]               │  │                 │  │
│                 │                                      │  │  Changes update │  │
│                 │  Preferred Neighborhoods (select up  │  │  your AI search │  │
│                 │  to 3)                               │  │  results        │  │
│                 │  ✓ Laureles  ✓ El Poblado            │  │  immediately.   │  │
│                 │  ○ Envigado  ○ El Centro             │  └─────────────────┘  │
│                 │  ○ Sabaneta  ○ Bello                 │                       │
│                 │                                      │                       │
│                 │  Bedrooms                            │                       │
│                 │  ○ Studio  ○ 1BR  ● 2BR  ○ 3BR+     │                       │
│                 │                                      │                       │
│                 │  Pets   ● Yes  ○ No                  │                       │
│                 │                                      │                       │
│                 │  Interests (select all that apply)   │                       │
│                 │  ✓ Jazz  ✓ Live Music  ○ Electronic  │                       │
│                 │  ✓ Art  ○ Sports  ○ Comedy           │                       │
│                 │                                      │                       │
│                 │  [Save Preferences]  [Cancel]        │                       │
└─────────────────┴──────────────────────────────────────┴───────────────────────┘
```

---

## Host Supplement — Roberto's Profile

```
┌────────────────────────────────────────────────────────┐
│  HOST PROFILE (visible to inquirers)                   │
│                                                        │
│  Display Name: Roberto Martínez                        │
│  Bio: [Jazz musician and event organizer from          │
│        Medellín with 5 years hosting experience...]    │
│                                                        │
│  Response time: ~2 hours (AI-calculated avg)          │
│  Events hosted: 12 · Avg rating: 4.9                  │
│                                                        │
│  [Edit Host Profile]                                   │
└────────────────────────────────────────────────────────┘
```

---

## Mobile Wireframe

```
┌─────────────────────────────────────┐
│  ← My Profile                      │
│  ─────────────────────────────     │
│  [Photo] Camila González           │
│  Consumer · Medellín               │
│  [Edit]                             │
│  ─────────────────────────────     │
│  Preferences                        │
│  Budget: $800–$1,200/mo            │
│  Neighborhoods: Laureles, Poblado  │
│  Beds: 2BR · Pets: Yes             │
│  Interests: Jazz, Live Music, Art  │
│  [Edit Preferences]                 │
│  ─────────────────────────────     │
│  🧠 AI Memory                      │
│  Budget: $1,200 · 2BR              │
│  Laureles, El Poblado              │
│  [Clear Memory]                    │
│  ─────────────────────────────     │
│  Security                          │
│  [Change Password] [Sign Out]      │
└─────────────────────────────────────┘
```

---

## States

### Loading State

```
┌────────────────────────────────────────────────────────┐
│  [████████░░░░░░░]  Camila G...                        │ ← skeleton photo+name
│  [████████████░░░░░░░░░░░░░░░░░░░░░░░]                 │ ← preference skeleton
└────────────────────────────────────────────────────────┘
```

### Save Success

```
┌────────────────────────────────────────────────────────┐
│  ✅ Preferences saved. Your search results will        │
│     reflect these changes immediately.                 │
└────────────────────────────────────────────────────────┘
```

### Clear Memory Confirmation

```
┌────────────────────────────────────────────────────────┐
│  Clear AI memory?                                      │
│                                                        │
│  This removes remembered facts like budget,           │
│  neighborhoods, and interests. Recommendations        │
│  will reset to generic until you chat again.          │
│                                                        │
│  [Yes, Clear]  [Cancel]                               │
└────────────────────────────────────────────────────────┘
```

---

## Components

| Component | Props | Notes |
|---|---|---|
| `ProfileCard` | `user`, `role`, `onEdit` | Photo, name, email, role badge |
| `ProfileEditForm` | `user`, `onSave` | Name, photo upload |
| `PreferenceForm` | `prefs`, `onSave` | Budget slider, neighborhood picker, etc. |
| `AIMemoryPanel` | `memory`, `onClear` | Shows current Mastra working memory |
| `HostProfileSection` | `hostProfile`, `onEdit` | Only shown for `role = host` |
| `SecuritySection` | `email`, `providers[]` | Change password, connected OAuth |
| `ClearMemoryModal` | `onConfirm`, `onCancel` | Destructive confirm |
| `ProfileSkeleton` | — | Loading state |

---

## Data Contract

```typescript
type UserProfile = {
  id: string
  email: string               // from auth.users
  full_name: string
  avatar_url: string | null
  role: "consumer" | "host" | "sponsor" | "admin"
  created_at: string
}

type UserPreferences = {
  user_id: string
  budget_min: number | null
  budget_max: number | null
  neighborhoods: string[]
  bedrooms: string | null      // "studio" | "1br" | "2br" | "3br+"
  pets: boolean | null
  interests: string[]          // ["jazz", "live_music", "art"]
  move_in_date: string | null
}

// Mastra working memory (LibSQL, thread-scoped)
type WorkingMemory = {
  budget?: string
  neighborhoods?: string[]
  bedrooms?: string
  pets?: boolean
  interests?: string[]
}
```

---

## AI Features

| Feature | Notes |
|---|---|
| Memory panel | Read-only display of Mastra working memory facts |
| Clear memory | Deletes LibSQL thread; agent starts fresh next session |
| Preference-to-memory sync | When prefs saved, agent's working memory is updated via tool call |

Working memory is the agent's truth; preferences are the user's persisted truth. On session start, preferences seed working memory if it's empty.

---

## RLS Policy

```sql
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "users_own_profile"
  ON profiles FOR ALL
  USING (id = auth.uid());

ALTER TABLE user_preferences ENABLE ROW LEVEL SECURITY;

CREATE POLICY "users_own_preferences"
  ON user_preferences FOR ALL
  USING (user_id = auth.uid());
```

---

## Analytics Events

| Event | Properties |
|---|---|
| `profile.viewed` | `role` |
| `profile.edited` | `fields_changed[]` |
| `preferences.saved` | `changed_fields[]` |
| `memory.cleared` | — |

---

## MVP / Post-MVP Scope

| Feature | Phase |
|---|---|
| View + edit profile | Core P1 |
| Preference form | Core P1 |
| AI memory panel + clear | Core P1 |
| Host profile section | Core P1 |
| Photo upload | MVP |
| Connected apps / OAuth | MVP |
| Notification preferences | MVP |
| Delete account | Post-MVP |
