#!/usr/bin/env npx tsx
/**
 * VEC-004 — drain pending embedding_jobs into *_embeddings tables.
 * Run: cd mdeapp && npx tsx scripts/intelligence/embed-worker.ts [--limit=10]
 */
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import {
  EMBEDDING_DIM,
  EMBEDDING_MODEL,
  formatEntityEmbedText,
  assertEmbeddingDimensions,
} from "../../src/mastra/lib/embedding-registry";
import { vectorLiteral } from "../../src/mastra/lib/query-embedding";

function loadEnv() {
  const path = resolve(process.cwd(), ".env.local");
  const raw = readFileSync(path, "utf8");
  for (const line of raw.split("\n")) {
    const m = line.match(/^([A-Z0-9_]+)=(.*)$/);
    if (m && !process.env[m[1]]) {
      process.env[m[1]] = m[2].replace(/^"|"$/g, "");
    }
  }
}

async function embedText(text: string): Promise<number[]> {
  const key = process.env.GOOGLE_GENERATIVE_AI_API_KEY;
  if (!key?.trim()) throw new Error("GOOGLE_GENERATIVE_AI_API_KEY missing");

  const res = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/${EMBEDDING_MODEL}:embedContent?key=${key}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        model: `models/${EMBEDDING_MODEL}`,
        content: { parts: [{ text }] },
        outputDimensionality: EMBEDDING_DIM,
      }),
    },
  );
  if (!res.ok) throw new Error(`embed API ${res.status}: ${await res.text()}`);
  const json = (await res.json()) as { embedding?: { values?: number[] } };
  const values = json.embedding?.values;
  if (!values?.length) throw new Error("empty embedding");
  assertEmbeddingDimensions(values);
  return values;
}

type Job = {
  id: string;
  entity_type: string;
  entity_id: string;
  content_hash: string;
};

async function main() {
  loadEnv();
  const limitArg = process.argv.find((a) => a.startsWith("--limit="));
  const limit = limitArg ? Number(limitArg.split("=")[1]) : 10;

  const url = process.env.SUPABASE_URL!;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY ?? process.env.SUPABASE_SECRET_KEY!;
  const db = createClient(url, key, {
    auth: { autoRefreshToken: false, persistSession: false },
  });

  const { data: jobs, error } = await db
    .from("embedding_jobs")
    .select("id, entity_type, entity_id, content_hash")
    .eq("status", "pending")
    .order("created_at", { ascending: true })
    .limit(limit);

  if (error) throw error;
  if (!jobs?.length) {
    console.log("No pending embedding_jobs");
    return;
  }

  let done = 0;
  for (const job of jobs as Job[]) {
    await db
      .from("embedding_jobs")
      .update({ status: "processing", attempts: 1 })
      .eq("id", job.id);

    try {
      const text = await loadEntityText(db, job);
      const values = await embedText(text);
      await upsertEmbedding(db, job, values);
      await db
        .from("embedding_jobs")
        .update({
          status: "done",
          processed_at: new Date().toISOString(),
        })
        .eq("id", job.id);
      done += 1;
      console.log("done", job.entity_type, job.entity_id);
    } catch (e) {
      const msg = (e as Error).message;
      await db
        .from("embedding_jobs")
        .update({ status: "failed", last_error: msg.slice(0, 500) })
        .eq("id", job.id);
      console.error("failed", job.id, msg);
    }
  }

  console.log(`Processed ${done}/${jobs.length} jobs`);
}

async function loadEntityText(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  db: SupabaseClient<any>,
  job: Job,
): Promise<string> {
  if (job.entity_type === "apartment") {
    const { data } = await db
      .from("apartments")
      .select("title, description, neighborhood, amenities")
      .eq("id", job.entity_id)
      .maybeSingle();
    if (!data) throw new Error("apartment not found");
    const row = data as {
      title: string;
      description: string | null;
      neighborhood: string | null;
      amenities: string[] | null;
    };
    return formatEntityEmbedText({
      title: row.title,
      description: row.description,
      neighborhood: row.neighborhood,
      tags: row.amenities,
    });
  }
  if (job.entity_type === "event") {
    const { data } = await db
      .from("events")
      .select("name, description, event_type, address")
      .eq("id", job.entity_id)
      .maybeSingle();
    if (!data) throw new Error("event not found");
    const row = data as {
      name: string;
      description: string | null;
      event_type: string | null;
      address: string | null;
    };
    return formatEntityEmbedText({
      title: row.name,
      description: [row.description, row.event_type, row.address].filter(Boolean).join(" "),
    });
  }
  if (job.entity_type === "restaurant") {
    const { data } = await db
      .from("restaurants")
      .select("name, description, cuisine_types, neighborhood, tags")
      .eq("id", job.entity_id)
      .maybeSingle();
    if (!data) throw new Error("restaurant not found");
    const row = data as {
      name: string;
      description: string | null;
      cuisine_types: string[] | null;
      neighborhood: string | null;
      tags: string[] | null;
    };
    return formatEntityEmbedText({
      title: row.name,
      description: row.description,
      neighborhood: row.neighborhood,
      tags: [...(row.cuisine_types ?? []), ...(row.tags ?? [])],
    });
  }
  throw new Error(`unsupported entity_type ${job.entity_type}`);
}

async function upsertEmbedding(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  db: SupabaseClient<any>,
  job: Job,
  values: number[],
) {
  const row = {
    embedding: vectorLiteral(values),
    model: EMBEDDING_MODEL,
    content_hash: job.content_hash,
    updated_at: new Date().toISOString(),
  };

  if (job.entity_type === "apartment") {
    await db.from("listing_embeddings").upsert({
      listing_id: job.entity_id,
      ...row,
    } as never);
    return;
  }
  if (job.entity_type === "event") {
    await db.from("event_embeddings").upsert({
      event_id: job.entity_id,
      ...row,
    } as never);
    return;
  }
  if (job.entity_type === "restaurant") {
    await db.from("restaurant_embeddings").upsert({
      restaurant_id: job.entity_id,
      ...row,
    } as never);
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
