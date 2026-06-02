"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { NavThread } from "@/app/api/threads/route";

export type { NavThread };

export function useNavThreads() {
  const [threads, setThreads] = useState<NavThread[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const fetchedRef = useRef(false);

  const refresh = useCallback(async () => {
    setLoading(true);
    setError(false);
    try {
      const r = await fetch("/api/threads");
      if (!r.ok) throw new Error(`/api/threads ${r.status}`);
      const d = (await r.json()) as { threads: NavThread[] };
      setThreads(d.threads ?? []);
    } catch {
      setError(true);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (fetchedRef.current) return;
    fetchedRef.current = true;
    refresh();
  }, [refresh]);

  return { threads, loading, error, refresh };
}
