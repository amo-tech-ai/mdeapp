"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { NavThread } from "@/app/api/threads/route";

export type { NavThread };

export function useNavThreads() {
  const [threads, setThreads] = useState<NavThread[]>([]);
  const [loading, setLoading] = useState(true);
  const fetchedRef = useRef(false);

  const refresh = useCallback(() => {
    fetch("/api/threads")
      .then((r) => r.json() as Promise<{ threads: NavThread[] }>)
      .then((d) => {
        setThreads(d.threads ?? []);
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    if (fetchedRef.current) return;
    fetchedRef.current = true;
    refresh();
  }, [refresh]);

  return { threads, loading, refresh };
}
