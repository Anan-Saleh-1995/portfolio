import { setupI18n } from "@lingui/core";
import { I18nProvider } from "@lingui/react";
import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { Hero } from "./Hero";

vi.mock("@/shared/lib/useReducedMotion", () => ({
  useReducedMotion: () => true,
}));

vi.mock("./useHeroIntroAnimation", () => ({
  useHeroIntroAnimation: vi.fn(),
}));

vi.mock("./HeroOverlay", () => ({
  HeroOverlay: () => <h1 id="hero-title">The Way of the Rōnin.</h1>,
}));

const testI18n = setupI18n({
  locale: "en",
  messages: {
    en: {
      "hero.specimen.coordinatesLabel": "Tokyo reference coordinates",
    },
  },
});

const renderHero = () =>
  render(
    <I18nProvider i18n={testI18n}>
      <Hero />
    </I18nProvider>,
  );

describe("Hero", () => {
  it("keeps the field-wide signal layer direct and hidden from accessibility", () => {
    const { container } = renderHero();
    const hero = container.querySelector("section");
    const signalField = Array.from(hero?.children ?? []).find(
      (child) =>
        child.matches("div[aria-hidden='true']") &&
        child.querySelectorAll(":scope > span").length > 0,
    );

    expect(signalField).toBeInTheDocument();
    expect(signalField?.parentElement).toBe(hero);
    expect(signalField).toHaveAttribute("aria-hidden", "true");
    expect(signalField).not.toHaveAttribute("role");
    expect(signalField).not.toHaveAttribute("aria-label");
  });

  it("owns the far-right coordinates as a technical LTR island", () => {
    renderHero();

    const coordinates = screen.getByText("35.6895° N · 139.6917° E");
    const coordinateRow = coordinates.closest("p");

    expect(coordinates).toHaveAttribute("dir", "ltr");
    expect(coordinates).toHaveAttribute("translate", "no");
    expect(coordinates).toHaveTextContent("35.6895° N · 139.6917° E");
    expect(coordinateRow).toHaveClass("absolute", "right-6");
    expect(coordinateRow).not.toHaveClass("start-6", "end-6");
    expect(coordinateRow).toHaveAccessibleName(
      "Tokyo reference coordinates: 35.6895° N · 139.6917° E",
    );
  });
});
