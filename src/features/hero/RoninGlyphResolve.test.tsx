import { render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { RoninGlyphResolve } from "./RoninGlyphResolve";

const motionPreference = vi.hoisted(() => ({ reduced: false }));

vi.mock("@/shared/lib/useReducedMotion", () => ({
  useReducedMotion: () => motionPreference.reduced,
}));

describe("RoninGlyphResolve", () => {
  beforeEach(() => {
    motionPreference.reduced = false;
  });

  it("starts with the Japanese signal on first render when motion is allowed", () => {
    render(<RoninGlyphResolve />);

    expect(screen.getByText("浪人|")).toBeInTheDocument();
    expect(screen.queryByText("Rōnin")).not.toBeInTheDocument();
  });

  it("keeps the macron-bearing final word static under reduced motion", () => {
    motionPreference.reduced = true;
    render(<RoninGlyphResolve />);

    expect(screen.getByText("Rōnin")).toBeInTheDocument();
    expect(screen.queryByText("浪人|")).not.toBeInTheDocument();
  });

  it("keeps the macron-bearing final word static while title motion is paused", () => {
    render(<RoninGlyphResolve paused />);

    expect(screen.getByText("Rōnin")).toBeInTheDocument();
    expect(screen.queryByText("浪人|")).not.toBeInTheDocument();
  });
});
