"use client";

import { useState, useEffect, useRef, useCallback } from "react";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface QuoteData {
  symbol: string;
  price: number;
  previousClose: number;
  change: number;
  changePercent: number;
  marketState: "pre" | "regular" | "post" | "closed";
  currency: string;
  updatedAt: string;
}

interface UseQuoteReturn {
  price: QuoteData | null;
  loading: boolean;
  error: string | null;
  refresh: () => void;
}

// ---------------------------------------------------------------------------
// In-memory cache (shared across hook instances)
// ---------------------------------------------------------------------------

const cache = new Map<string, { data: QuoteData; ts: number }>();
const CACHE_TTL_MS = 10_000; // 10 seconds

// ---------------------------------------------------------------------------
// Hook
// ---------------------------------------------------------------------------

export function useQuote(symbol: string): UseQuoteReturn {
  const [price, setPrice] = useState<QuoteData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Ref to track the latest symbol so stale fetches don't clobber state
  const symbolRef = useRef(symbol);
  symbolRef.current = symbol;

  // Ref for the debounce timer
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Ref for the auto-refresh interval
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const fetchQuote = useCallback(
    async (sym: string) => {
      if (!sym) {
        setPrice(null);
        setError(null);
        setLoading(false);
        return;
      }

      const upper = sym.toUpperCase();

      // Check cache first
      const cached = cache.get(upper);
      if (cached && Date.now() - cached.ts < CACHE_TTL_MS) {
        setPrice(cached.data);
        setError(null);
        setLoading(false);
        return;
      }

      setLoading(true);
      setError(null);

      try {
        const res = await fetch(`/api/quote?symbol=${encodeURIComponent(upper)}`);
        const json = await res.json();

        // If the symbol changed while we were fetching, discard
        if (symbolRef.current.toUpperCase() !== upper) return;

        if (!res.ok) {
          setError(json.error ?? `HTTP ${res.status}`);
          setPrice(null);
        } else {
          const data = json as QuoteData;
          cache.set(upper, { data, ts: Date.now() });
          setPrice(data);
          setError(null);
        }
      } catch (err) {
        if (symbolRef.current.toUpperCase() !== upper) return;
        setError(err instanceof Error ? err.message : "Network error");
        setPrice(null);
      } finally {
        if (symbolRef.current.toUpperCase() === upper) {
          setLoading(false);
        }
      }
    },
    []
  );

  // Debounced fetch when symbol changes
  useEffect(() => {
    // Clear previous debounce
    if (debounceRef.current) clearTimeout(debounceRef.current);

    if (!symbol.trim()) {
      setPrice(null);
      setError(null);
      setLoading(false);
      return;
    }

    debounceRef.current = setTimeout(() => {
      fetchQuote(symbol);
    }, 500);

    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [symbol, fetchQuote]);

  // Auto-refresh every 30s when market is open
  useEffect(() => {
    if (intervalRef.current) clearInterval(intervalRef.current);

    if (!symbol.trim()) return;

    intervalRef.current = setInterval(() => {
      // Only refresh if market is open
      if (price && (price.marketState === "regular" || price.marketState === "pre" || price.marketState === "post")) {
        // Invalidate cache so we get fresh data
        cache.delete(symbol.toUpperCase());
        fetchQuote(symbol);
      }
    }, 30_000);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [symbol, price?.marketState, fetchQuote]);

  const refresh = useCallback(() => {
    if (symbol.trim()) {
      cache.delete(symbol.toUpperCase());
      fetchQuote(symbol);
    }
  }, [symbol, fetchQuote]);

  return { price, loading, error, refresh };
}
