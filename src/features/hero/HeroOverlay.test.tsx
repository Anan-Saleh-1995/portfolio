import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { HeroOverlay } from "./HeroOverlay";

vi.mock("@/shared/lib/useReducedMotion", () => ({
  useReducedMotion: () => false,
}));

vi.mock("./HeroMedia", () => ({
  HeroMedia: () => <div data-testid="hero-media" aria-hidden="true" />,
}));

vi.mock("./HeroSpecimenPanel", () => ({
  HeroSpecimenPanel: () => <aside aria-label="Ronin engineering specimen" />,
}));

vi.mock("./RoninGlyphResolve", () => ({
  RoninGlyphResolve: ({ paused = false }: { paused?: boolean }) => (
    <span data-testid="ronin-glyph" data-paused={paused}>
      Rōnin.
    </span>
  ),
}));

const renderOverlay = () => render(<HeroOverlay />);

describe("HeroOverlay", () => {
  it("keeps semantic source order and a labeled secondary GitHub action", () => {
    renderOverlay();

    const heading = screen.getByRole("heading", {
      level: 1,
      name: "The Way of the Rōnin.",
    });
    const media = screen.getByTestId("hero-media");
    const specimen = screen.getByRole("complementary", {
      name: "Ronin engineering specimen",
    });
    const githubLink = screen.getByRole("link", {
      name: "View Anan's GitHub profile (opens in a new tab)",
    });

    expect(media).toHaveAttribute("aria-hidden", "true");
    expect(
      heading.compareDocumentPosition(media) & Node.DOCUMENT_POSITION_FOLLOWING,
    ).toBeTruthy();
    expect(
      media.compareDocumentPosition(specimen) &
        Node.DOCUMENT_POSITION_FOLLOWING,
    ).toBeTruthy();
    expect(githubLink).toHaveAttribute(
      "href",
      "https://github.com/Anan-Saleh-1995",
    );
    expect(githubLink).toHaveAttribute("target", "_blank");
    expect(githubLink).toHaveAttribute(
      "rel",
      expect.stringContaining("noopener"),
    );
    expect(githubLink).toHaveAttribute(
      "rel",
      expect.stringContaining("noreferrer"),
    );
    expect(githubLink).toHaveTextContent("View GitHub");
  });

  it("keeps the reference title composition on exactly two visual lines", () => {
    const { container } = renderOverlay();
    const visualTitle = container.querySelector("#hero-title + div");
    const visualLines = visualTitle?.children ?? [];

    expect(visualTitle).toHaveAttribute("aria-hidden", "true");
    expect(visualLines).toHaveLength(2);
    expect(visualLines[0]).toHaveTextContent(/^The Way$/);
    expect(visualLines[1]).toHaveTextContent(/^of the Rōnin\.$/);
  });

  it("keeps its accessible H1 immutable while the user pauses and resumes title motion", async () => {
    const user = userEvent.setup();
    renderOverlay();

    const heading = screen.getByRole("heading", {
      level: 1,
      name: "The Way of the Rōnin.",
    });
    const glyph = screen.getByTestId("ronin-glyph");
    const pauseButton = screen.getByRole("button", {
      name: "Pause title signal",
    });

    expect(screen.getAllByRole("heading", { level: 1 })).toHaveLength(1);
    expect(pauseButton).toHaveAttribute("aria-pressed", "false");
    expect(glyph).toHaveAttribute("data-paused", "false");

    await user.click(pauseButton);

    const resumeButton = screen.getByRole("button", {
      name: "Resume title signal",
    });
    expect(resumeButton).toHaveAttribute("aria-pressed", "true");
    expect(glyph).toHaveAttribute("data-paused", "true");
    expect(
      screen.getByRole("heading", {
        level: 1,
        name: "The Way of the Rōnin.",
      }),
    ).toBe(heading);

    await user.click(resumeButton);

    expect(
      screen.getByRole("button", { name: "Pause title signal" }),
    ).toHaveAttribute("aria-pressed", "false");
    expect(glyph).toHaveAttribute("data-paused", "false");
    expect(
      screen.getByRole("heading", {
        level: 1,
        name: "The Way of the Rōnin.",
      }),
    ).toBe(heading);
  });
});
