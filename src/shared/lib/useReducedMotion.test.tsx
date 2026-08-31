import { act, renderHook } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { useReducedMotion } from "./useReducedMotion";

interface MatchMediaHarness {
  emit: (matches: boolean) => void;
  matchMedia: (query: string) => MediaQueryList;
}

const createMatchMediaHarness = (initialMatches = false): MatchMediaHarness => {
  let matches = initialMatches;
  const listeners = new Set<(event: MediaQueryListEvent) => void>();

  return {
    emit: (nextMatches) => {
      matches = nextMatches;
      const event = { matches } as MediaQueryListEvent;
      listeners.forEach((listener) => listener(event));
    },
    matchMedia: (query) =>
      ({
        get matches() {
          return matches;
        },
        media: query,
        onchange: null,
        addListener: vi.fn(),
        removeListener: vi.fn(),
        addEventListener: (
          _type: string,
          listener: EventListenerOrEventListenerObject,
        ) => {
          listeners.add(listener as (event: MediaQueryListEvent) => void);
        },
        removeEventListener: (
          _type: string,
          listener: EventListenerOrEventListenerObject,
        ) => {
          listeners.delete(listener as (event: MediaQueryListEvent) => void);
        },
        dispatchEvent: vi.fn(),
      }) as MediaQueryList,
  };
};

describe("useReducedMotion", () => {
  const originalMatchMedia = window.matchMedia;

  afterEach(() => {
    window.matchMedia = originalMatchMedia;
  });

  it("tracks reduced-motion preference changes", () => {
    const harness = createMatchMediaHarness();
    window.matchMedia = harness.matchMedia;
    const { result } = renderHook(() => useReducedMotion());

    expect(result.current).toBe(false);

    act(() => harness.emit(true));

    expect(result.current).toBe(true);
  });
});
