import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { RONIN_HERO_ASSET } from "./heroAssets";
import { HeroMedia } from "./HeroMedia";

describe("HeroMedia", () => {
  it("loads the selected v2 artwork eagerly without duplicating its meaning", () => {
    const { container } = render(<HeroMedia />);
    const stage = container.querySelector<HTMLElement>("[data-hero-media]");
    const portrait = container.querySelector<HTMLImageElement>("img");

    expect(RONIN_HERO_ASSET.src).toBe(
      "/images/hero/ronin-dark-crimson-enso-master-v2.png",
    );
    expect(stage).toHaveAttribute("data-status", "loading");
    expect(stage).toHaveAttribute("aria-hidden", "true");
    expect(portrait).toHaveAttribute("src", RONIN_HERO_ASSET.src);
    expect(portrait).toHaveAttribute("alt", "");
    expect(portrait).toHaveAttribute("loading", "eager");
    expect(portrait).toHaveAttribute("fetchpriority", "high");
    expect(screen.queryByRole("img")).not.toBeInTheDocument();

    fireEvent.load(portrait!);
    expect(stage).toHaveAttribute("data-status", "loaded");
  });
});
