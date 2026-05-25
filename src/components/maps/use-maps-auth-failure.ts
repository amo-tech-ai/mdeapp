"use client";

import { useEffect, useState } from "react";

declare global {
  interface Window {
    __mdeMapsAuthFailed?: boolean;
    gm_authFailure?: () => void;
  }
}

const AUTH_EVENT = "mde-maps-auth-failure";

/** Google Maps calls `window.gm_authFailure` on RefererNotAllowed / key errors. */
export function useMapsAuthFailure(): boolean {
  const [failed, setFailed] = useState(
    () =>
      typeof window !== "undefined" && Boolean(window.__mdeMapsAuthFailed),
  );

  useEffect(() => {
    const onFailure = () => setFailed(true);
    window.addEventListener(AUTH_EVENT, onFailure);
    return () => window.removeEventListener(AUTH_EVENT, onFailure);
  }, []);

  return failed;
}
