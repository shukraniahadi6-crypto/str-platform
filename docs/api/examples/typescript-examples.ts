/**
 * typescript-examples.ts
 * React + TypeScript integration examples for the STR Platform API.
 */

import { useCallback, useEffect, useRef, useState } from "react";
import { STRClient, STRRealtimeClient, STRAPIError } from "@str-platform/sdk";
import type { Job, TrackingSnapshot } from "@str-platform/sdk/types";

// ─── Client Setup ────────────────────────────────────────────────────────────

const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? "https://api.strplatform.com/api/v1";

export const strClient = new STRClient({
  baseURL: API_BASE,
  accessToken: () => localStorage.getItem("accessToken") ?? "",
  onTokenExpired: async () => {
    const res = await fetch(`${API_BASE}/auth/refresh`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ refreshToken: localStorage.getItem("refreshToken") }),
    });
    const tokens = await res.json();
    localStorage.setItem("accessToken", tokens.accessToken);
    localStorage.setItem("refreshToken", tokens.refreshToken);
    return tokens.accessToken;
  },
});

// ─── Auth Hook ────────────────────────────────────────────────────────────────

interface LoginState {
  loading: boolean;
  error: string | null;
}

export function useLogin() {
  const [state, setState] = useState<LoginState>({ loading: false, error: null });

  const login = useCallback(async (email: string, password: string) => {
    setState({ loading: true, error: null });
    try {
      const { accessToken, refreshToken, user } = await strClient.auth.login({ email, password });
      localStorage.setItem("accessToken", accessToken);
      localStorage.setItem("refreshToken", refreshToken);
      return user;
    } catch (err) {
      const msg = err instanceof STRAPIError ? err.message : "Login failed";
      setState({ loading: false, error: msg });
      throw err;
    } finally {
      setState((s) => ({ ...s, loading: false }));
    }
  }, []);

  return { ...state, login };
}

// ─── Jobs Hook ────────────────────────────────────────────────────────────────

export function useJobs(status?: string) {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [cursor, setCursor] = useState<string | null>(null);
  const [hasNext, setHasNext] = useState(false);

  const fetchJobs = useCallback(
    async (nextCursor?: string) => {
      try {
        setLoading(true);
        const res = await strClient.jobs.list({
          status,
          limit: 20,
          cursor: nextCursor,
        });
        setJobs((prev) => (nextCursor ? [...prev, ...res.data] : res.data));
        setCursor(res.pagination.cursor ?? null);
        setHasNext(res.pagination.hasNext);
      } catch (err) {
        setError(err instanceof STRAPIError ? err.message : "Failed to load jobs");
      } finally {
        setLoading(false);
      }
    },
    [status]
  );

  useEffect(() => {
    fetchJobs();
  }, [fetchJobs]);

  const loadMore = () => {
    if (cursor && hasNext) fetchJobs(cursor);
  };

  return { jobs, loading, error, hasNext, loadMore };
}

// ─── Live Tracking Hook ───────────────────────────────────────────────────────

interface TrackingState {
  snapshot: TrackingSnapshot | null;
  connected: boolean;
}

export function useJobTracking(jobId: string): TrackingState {
  const [snapshot, setSnapshot] = useState<TrackingSnapshot | null>(null);
  const [connected, setConnected] = useState(false);
  const realtimeRef = useRef<STRRealtimeClient | null>(null);

  useEffect(() => {
    const realtime = new STRRealtimeClient({
      wsURL: process.env.NEXT_PUBLIC_WS_URL ?? "wss://api.strplatform.com",
      accessToken: () => localStorage.getItem("accessToken") ?? "",
    });

    realtime.on("connect", () => setConnected(true));
    realtime.on("disconnect", () => setConnected(false));

    realtime.onJobStatusChanged((event) => {
      if (event.jobId === jobId) {
        setSnapshot((prev) => prev ? { ...prev, status: event.status } : null);
      }
    });

    realtime.onLocationUpdate((event) => {
      if (event.jobId === jobId) {
        setSnapshot((prev) =>
          prev
            ? {
                ...prev,
                courierLocation: { lat: event.lat, lng: event.lng, heading: event.heading, speed: event.speed },
                etaMinutes: event.etaMinutes ?? prev.etaMinutes,
                lastUpdated: event.timestamp,
              }
            : null
        );
      }
    });

    realtime.joinJob(jobId);
    realtimeRef.current = realtime;

    return () => {
      realtime.leaveJob(jobId);
      realtime.disconnect();
    };
  }, [jobId]);

  return { snapshot, connected };
}

// ─── Offer Acceptance Hook ────────────────────────────────────────────────────

export function useAcceptOffer() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const accept = useCallback(async (offerId: string): Promise<Job | null> => {
    setLoading(true);
    setError(null);
    try {
      return await strClient.offers.accept(offerId);
    } catch (err) {
      if (err instanceof STRAPIError) {
        setError(err.code === "OFFER_EXPIRED" ? "Offer expired — wait for the next ping." : err.message);
      }
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  return { loading, error, accept };
}

// ─── Estimate Form Example ────────────────────────────────────────────────────

export async function handleEstimateSubmit(
  imageUrls: string[],
  address: string
) {
  try {
    const estimate = await strClient.jobs.estimate({ imageUrls, address });

    console.log("Estimated price:", estimate.estimatedPrice);
    console.log("Items found:", estimate.items.map((i) => `${i.quantity}x ${i.name}`).join(", "));
    console.log("Volume:", estimate.volumeYd3, "yd³");

    return estimate;
  } catch (err) {
    if (err instanceof STRAPIError && err.code === "IMAGE_ANALYSIS_FAILED") {
      throw new Error("Could not analyze the photos. Please use clearer images with good lighting.");
    }
    throw err;
  }
}
