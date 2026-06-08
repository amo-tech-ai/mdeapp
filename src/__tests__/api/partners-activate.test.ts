import { beforeEach, describe, expect, it, vi } from "vitest";
import type { SupabaseClient } from "@supabase/supabase-js";
import {
  activatePartnerInputSchema,
  sanitizePartnerSettings,
} from "@/lib/partners/activate-schema";
import {
  activatePartner,
  buildPartnerInsertRow,
} from "@/lib/partners/activate-partner";
import type { Database } from "@/lib/supabase/database.types";

const PROFILE_ID = "11111111-1111-4111-a111-111111111111";
const PARTNER_ID = "22222222-2222-4222-a222-222222222222";
const DRAFT_ID = "33333333-3333-4333-a333-333333333333";

type PartnerRow = {
  id: string;
  profile_id: string;
  type: string;
  status: string;
  completion_score: number;
  settings: Record<string, unknown>;
};

type MemberRow = {
  partner_id: string;
  profile_id: string;
  role: string;
};

type DraftRow = {
  id: string;
  profile_id: string;
  type: string;
  partner_id: string | null;
  submitted_at: string | null;
};

function makeMockDb(state: {
  partners?: PartnerRow[];
  members?: MemberRow[];
  drafts?: DraftRow[];
}) {
  const partners = [...(state.partners ?? [])];
  const members = [...(state.members ?? [])];
  const drafts = [...(state.drafts ?? [])];

  const db = {
    from(table: string) {
      if (table === "partners") {
        return {
          select: () => ({
            eq: (col: string, val: string) => ({
              eq: (_col2: string, val2: string) => ({
                maybeSingle: async () => {
                  if (col !== "profile_id") return { data: null, error: null };
                  const row = partners.find(
                    (p) => p.profile_id === val && p.type === val2,
                  );
                  return {
                    data: row
                      ? { id: row.id, type: row.type, status: row.status }
                      : null,
                    error: null,
                  };
                },
              }),
            }),
          }),
          insert: (row: PartnerRow) => ({
            select: () => ({
              single: async () => {
                const duplicate = partners.find(
                  (p) => p.profile_id === row.profile_id && p.type === row.type,
                );
                if (duplicate) {
                  return {
                    data: null,
                    error: { code: "23505", message: "duplicate key value" },
                  };
                }
                const inserted: PartnerRow = {
                  id: PARTNER_ID,
                  profile_id: row.profile_id,
                  type: row.type,
                  status: row.status,
                  completion_score: row.completion_score,
                  settings: row.settings,
                };
                partners.push(inserted);
                return {
                  data: {
                    id: inserted.id,
                    type: inserted.type,
                    status: inserted.status,
                  },
                  error: null,
                };
              },
            }),
          }),
        };
      }

      if (table === "partner_members") {
        return {
          upsert: async (row: MemberRow) => {
            const idx = members.findIndex(
              (m) =>
                m.partner_id === row.partner_id &&
                m.profile_id === row.profile_id,
            );
            if (idx >= 0) members[idx] = row;
            else members.push(row);
            return { error: null };
          },
        };
      }

      if (table === "partner_drafts") {
        return {
          select: () => ({
            eq: (col: string, val: string) => ({
              maybeSingle: async () => {
                if (col !== "id") return { data: null, error: null };
                const row = drafts.find((d) => d.id === val);
                return {
                  data: row
                    ? { id: row.id, profile_id: row.profile_id, type: row.type }
                    : null,
                  error: null,
                };
              },
            }),
          }),
          update: (patch: Partial<DraftRow>) => {
            const filters: Record<string, string> = {};
            const chain = {
              eq: (col: string, val: string) => {
                filters[col] = val;
                return chain;
              },
              select: () => chain,
              maybeSingle: async () => {
                const row = drafts.find((d) =>
                  Object.entries(filters).every(
                    ([key, value]) => d[key as keyof DraftRow] === value,
                  ),
                );
                if (row) Object.assign(row, patch);
                return {
                  data: row ? { id: row.id } : null,
                  error: null,
                };
              },
            };
            return chain;
          },
        };
      }

      throw new Error(`Unexpected table ${table}`);
    },
    _state: { partners, members, drafts },
  };

  return db as unknown as SupabaseClient<Database> & {
    _state: {
      partners: PartnerRow[];
      members: MemberRow[];
      drafts: DraftRow[];
    };
  };
}

describe("activate partner schema", () => {
  it("rejects invalid partner type", () => {
    const result = activatePartnerInputSchema.safeParse({ type: "hacker" });
    expect(result.success).toBe(false);
  });

  it("strips privileged settings keys", () => {
    const result = activatePartnerInputSchema.safeParse({
      type: "host",
      settings: {
        businessName: "Roof",
        status: "active",
        tier: "pro",
        completion_score: 100,
      },
    });
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.settings).toEqual({ businessName: "Roof" });
    }
  });
});

describe("buildPartnerInsertRow", () => {
  it("never accepts client status escalation", () => {
    const row = buildPartnerInsertRow(PROFILE_ID, {
      type: "host",
      settings: { status: "active", tier: "pro" },
    });
    expect(row.status).toBe("draft");
    expect(row.completion_score).toBe(0);
    expect(row.settings).toEqual({});
  });
});

describe("sanitizePartnerSettings", () => {
  it("blocks status tier and completion_score", () => {
    expect(
      sanitizePartnerSettings({
        status: "active",
        tier: "pro",
        completion_score: 99,
        activated_at: "2026-01-01",
        businessName: "OK",
      }),
    ).toEqual({ businessName: "OK" });
  });

  it("blocks prototype pollution keys", () => {
    expect(
      sanitizePartnerSettings({
        ["__proto__"]: { polluted: true },
        constructor: { polluted: true },
        prototype: { polluted: true },
        businessName: "OK",
      }),
    ).toEqual({ businessName: "OK" });
    expect(
      Object.getPrototypeOf(sanitizePartnerSettings({ businessName: "OK" })),
    ).toBeNull();
  });

  it("strips keys outside signup whitelist", () => {
    expect(
      sanitizePartnerSettings({
        businessName: "Roof",
        hackerKey: "nope",
      }),
    ).toEqual({ businessName: "Roof" });
  });
});

describe("activatePartner", () => {
  it("creates partner and owner member", async () => {
    const db = makeMockDb({});
    const result = await activatePartner(db, PROFILE_ID, { type: "host" });

    expect(result.ok).toBe(true);
    if (!result.ok) return;
    expect(result.data.created).toBe(true);
    expect(result.data.partnerId).toBe(PARTNER_ID);
    expect(result.data.status).toBe("draft");
    expect(result.data.redirectTo).toBe("/dashboard");
    expect(db._state.members).toEqual([
      { partner_id: PARTNER_ID, profile_id: PROFILE_ID, role: "owner" },
    ]);
  });

  it("returns existing partner idempotently", async () => {
    const db = makeMockDb({
      partners: [
        {
          id: PARTNER_ID,
          profile_id: PROFILE_ID,
          type: "host",
          status: "draft",
          completion_score: 0,
          settings: {},
        },
      ],
    });

    const result = await activatePartner(db, PROFILE_ID, { type: "host" });
    expect(result.ok).toBe(true);
    if (!result.ok) return;
    expect(result.data.created).toBe(false);
    expect(result.data.partnerId).toBe(PARTNER_ID);
    expect(db._state.partners).toHaveLength(1);
  });

  it("does not create partner when draftId is missing", async () => {
    const db = makeMockDb({});
    const result = await activatePartner(db, PROFILE_ID, {
      type: "host",
      draftId: DRAFT_ID,
    });

    expect(result.ok).toBe(false);
    if (result.ok) return;
    expect(result.error.code).toBe("draft_not_found");
    expect(db._state.partners).toHaveLength(0);
    expect(db._state.members).toHaveLength(0);
  });

  it("rejects draft type mismatch before partner writes", async () => {
    const db = makeMockDb({
      drafts: [
        {
          id: DRAFT_ID,
          profile_id: PROFILE_ID,
          type: "broker",
          partner_id: null,
          submitted_at: null,
        },
      ],
    });

    const result = await activatePartner(db, PROFILE_ID, {
      type: "host",
      draftId: DRAFT_ID,
    });

    expect(result.ok).toBe(false);
    if (result.ok) return;
    expect(result.error.code).toBe("draft_type_mismatch");
    expect(db._state.partners).toHaveLength(0);
    expect(db._state.members).toHaveLength(0);
  });

  it("handles concurrent insert race idempotently", async () => {
    const partners: PartnerRow[] = [];
    const db = {
      from(table: string) {
        if (table === "partners") {
          return {
            select: () => ({
              eq: (col: string, val: string) => ({
                eq: (_col2: string, val2: string) => ({
                  maybeSingle: async () => {
                    const row = partners.find(
                      (p) => p.profile_id === val && p.type === val2,
                    );
                    return {
                      data: row
                        ? { id: row.id, type: row.type, status: row.status }
                        : null,
                      error: null,
                    };
                  },
                }),
              }),
            }),
            insert: () => ({
              select: () => ({
                single: async () => {
                  partners.push({
                    id: PARTNER_ID,
                    profile_id: PROFILE_ID,
                    type: "host",
                    status: "draft",
                    completion_score: 0,
                    settings: {},
                  });
                  return {
                    data: null,
                    error: { code: "23505", message: "duplicate key value" },
                  };
                },
              }),
            }),
          };
        }
        if (table === "partner_members") {
          return {
            upsert: async () => {
              return { error: null };
            },
          };
        }
        throw new Error(`Unexpected table ${table}`);
      },
      _state: { partners, members: [], drafts: [] },
    } as unknown as SupabaseClient<Database> & {
      _state: { partners: PartnerRow[]; members: MemberRow[]; drafts: DraftRow[] };
    };

    const result = await activatePartner(db, PROFILE_ID, { type: "host" });
    expect(result.ok).toBe(true);
    if (!result.ok) return;
    expect(result.data.created).toBe(false);
    expect(result.data.partnerId).toBe(PARTNER_ID);
    expect(partners).toHaveLength(1);
  });

  it("links draft when draftId provided", async () => {
    const db = makeMockDb({
      drafts: [
        {
          id: DRAFT_ID,
          profile_id: PROFILE_ID,
          type: "host",
          partner_id: null,
          submitted_at: null,
        },
      ],
    });

    const result = await activatePartner(db, PROFILE_ID, {
      type: "host",
      draftId: DRAFT_ID,
    });

    expect(result.ok).toBe(true);
    expect(db._state.drafts[0]?.partner_id).toBe(PARTNER_ID);
    expect(db._state.drafts[0]?.submitted_at).not.toBeNull();
  });
});

describe("POST /api/partners/activate", () => {
  beforeEach(() => {
    vi.resetModules();
    vi.clearAllMocks();
  });

  it("returns 401 when unauthenticated", async () => {
    vi.doMock("@/lib/supabase/server", () => ({
      createClient: vi.fn(async () => ({
        auth: { getUser: async () => ({ data: { user: null } }) },
      })),
    }));
    vi.doMock("@/lib/supabase/service", () => ({
      createServiceRoleClient: vi.fn(() => ({})),
    }));

    const { POST } = await import("@/app/api/partners/activate/route");
    const res = await POST(
      new Request("http://localhost/api/partners/activate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type: "host" }),
      }),
    );

    expect(res.status).toBe(401);
  });

  it("returns 400 for invalid type", async () => {
    vi.doMock("@/lib/supabase/server", () => ({
      createClient: vi.fn(async () => ({
        auth: {
          getUser: async () => ({
            data: { user: { id: PROFILE_ID } },
          }),
        },
      })),
    }));
    vi.doMock("@/lib/supabase/service", () => ({
      createServiceRoleClient: vi.fn(() => ({})),
    }));

    const { POST } = await import("@/app/api/partners/activate/route");
    const res = await POST(
      new Request("http://localhost/api/partners/activate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type: "not-a-partner" }),
      }),
    );

    expect(res.status).toBe(400);
  });

  it("returns 201 on create and 200 on duplicate", async () => {
    const activatePartnerMock = vi
      .fn()
      .mockResolvedValueOnce({
        ok: true,
        data: {
          partnerId: PARTNER_ID,
          type: "host",
          status: "draft",
          redirectTo: "/dashboard",
          created: true,
        },
      })
      .mockResolvedValueOnce({
        ok: true,
        data: {
          partnerId: PARTNER_ID,
          type: "host",
          status: "draft",
          redirectTo: "/dashboard",
          created: false,
        },
      });

    vi.doMock("@/lib/supabase/server", () => ({
      createClient: vi.fn(async () => ({
        auth: {
          getUser: async () => ({
            data: { user: { id: PROFILE_ID } },
          }),
        },
      })),
    }));
    vi.doMock("@/lib/supabase/service", () => ({
      createServiceRoleClient: vi.fn(() => ({})),
    }));
    vi.doMock("@/lib/partners/activate-partner", () => ({
      activatePartner: activatePartnerMock,
    }));

    const { POST } = await import("@/app/api/partners/activate/route");
    const req = () =>
      POST(
        new Request("http://localhost/api/partners/activate", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ type: "host" }),
        }),
      );

    const created = await req();
    expect(created.status).toBe(201);
    const createdBody = await created.json();
    expect(createdBody.partnerId).toBe(PARTNER_ID);
    expect(createdBody.redirectTo).toBe("/dashboard");

    const duplicate = await req();
    expect(duplicate.status).toBe(200);
  });

  it("returns generic message for server errors", async () => {
    vi.doMock("@/lib/supabase/server", () => ({
      createClient: vi.fn(async () => ({
        auth: {
          getUser: async () => ({
            data: { user: { id: PROFILE_ID } },
          }),
        },
      })),
    }));
    vi.doMock("@/lib/supabase/service", () => ({
      createServiceRoleClient: vi.fn(() => ({})),
    }));
    vi.doMock("@/lib/partners/activate-partner", () => ({
      activatePartner: vi.fn(async () => ({
        ok: false,
        error: {
          code: "insert_failed",
          message: 'relation "partners" does not exist',
        },
      })),
    }));

    const { POST } = await import("@/app/api/partners/activate/route");
    const res = await POST(
      new Request("http://localhost/api/partners/activate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type: "host" }),
      }),
    );

    expect(res.status).toBe(500);
    const body = await res.json();
    expect(body.error).toBe("Partner activation failed");
    expect(body.error).not.toContain("relation");
  });
});
