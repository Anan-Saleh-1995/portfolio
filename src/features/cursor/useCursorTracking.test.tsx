import { fireEvent, render } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { Cursor } from "./Cursor";

vi.mock("@/shared/lib/useMediaQuery", () => ({ useMediaQuery: () => true }));
vi.mock("@/shared/lib/useReducedMotion", () => ({
  useReducedMotion: () => false,
}));

describe("cursor animation scheduling", () => {
  let frames: Map<number, FrameRequestCallback>;
  let nextId: number;

  beforeEach(() => {
    frames = new Map();
    nextId = 0;
    vi.spyOn(window, "requestAnimationFrame").mockImplementation((callback) => {
      frames.set(++nextId, callback);
      return nextId;
    });
    vi.spyOn(window, "cancelAnimationFrame").mockImplementation((id) => {
      frames.delete(id);
    });
  });
  afterEach(() => {
    vi.restoreAllMocks();
  });

  const flushFrame = () => {
    const queued = [...frames.values()];
    frames.clear();
    queued.forEach((callback) => callback(0));
  };

  it("coalesces pointer movement and stops scheduling when the ring settles", () => {
    render(<Cursor />);
    expect(frames.size).toBe(0);
    fireEvent.mouseMove(document, { clientX: 100, clientY: 100 });
    fireEvent.mouseMove(document, { clientX: 200, clientY: 150 });
    expect(frames.size).toBe(1);
    for (let index = 0; index < 100 && frames.size; index++) flushFrame();
    expect(frames.size).toBe(0);
    fireEvent.mouseMove(document, { clientX: 300, clientY: 150 });
    expect(frames.size).toBe(1);
  });

  it("cancels pending work on leave and unmount", () => {
    const { unmount } = render(<Cursor />);
    fireEvent.mouseMove(document, { clientX: 100, clientY: 100 });
    fireEvent.mouseLeave(document);
    expect(frames.size).toBe(0);
    fireEvent.mouseMove(document, { clientX: 200, clientY: 150 });
    expect(frames.size).toBe(1);
    unmount();
    expect(frames.size).toBe(0);
    expect(document.documentElement).not.toHaveAttribute("data-custom-cursor");
  });
});
