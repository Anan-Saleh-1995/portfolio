import { render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it } from "vitest";
import { ThemeProvider } from "@/shared/lib/ThemeProvider";
import { HeroSpecimenPanel } from "./HeroSpecimenPanel";

const renderPanel = () =>
  render(
    <ThemeProvider>
      <HeroSpecimenPanel />
    </ThemeProvider>,
  );

describe("HeroSpecimenPanel", () => {
  beforeEach(() => {
    localStorage.clear();
    document.documentElement.removeAttribute("data-theme");
  });

  it("renders the reference anatomy vocabulary and textual equivalent", () => {
    renderPanel();

    expect(
      screen.getByRole("complementary", {
        name: "Ronin engineering specimen",
      }),
    ).toBeInTheDocument();
    expect(screen.getByText("浪人")).toHaveAttribute("lang", "ja");
    expect(screen.getAllByRole("listitem")).toHaveLength(6);

    for (const label of [
      "Interface engineering",
      "Security & identity",
      "Backend systems",
      "Data & persistence",
      "Protocols & tools",
      "Infrastructure",
    ]) {
      expect(screen.getByText(label)).toBeInTheDocument();
    }
  });

  it("keeps one inspect entry before the anatomy content in semantic order", () => {
    const { container } = renderPanel();
    const specimen = screen.getByRole("complementary", {
      name: "Ronin engineering specimen",
    });
    const actions = screen.getAllByRole("link", { name: "Inspect the record" });
    const [action] = actions;
    const anatomyImage = container.querySelector("img");
    const disciplineList = container.querySelector("ol");

    expect(actions).toHaveLength(1);
    expect(specimen).not.toHaveAttribute("hidden");
    expect(specimen).not.toHaveAttribute("aria-hidden");
    expect(specimen).not.toHaveAttribute("inert");
    expect(action).toBeVisible();
    expect(action).toHaveAttribute("href", "#the-way");
    expect(action).not.toHaveAttribute("aria-hidden");
    expect(action).not.toHaveAttribute("tabindex", "-1");
    expect(action?.tabIndex).toBe(0);
    expect(anatomyImage).not.toBeNull();
    expect(disciplineList).not.toBeNull();
    expect(
      action.compareDocumentPosition(anatomyImage!) &
        Node.DOCUMENT_POSITION_FOLLOWING,
    ).toBeTruthy();
    expect(
      action.compareDocumentPosition(disciplineList!) &
        Node.DOCUMENT_POSITION_FOLLOWING,
    ).toBeTruthy();
  });

  it.each([
    {
      theme: "dark",
      src: "/images/hero/ronin-anatomy-dark-v1.png",
      width: "971",
      height: "1619",
    },
    {
      theme: "light",
      src: "/images/hero/ronin-anatomy-light-v1.png",
      width: "992",
      height: "1586",
    },
  ])(
    "uses the dedicated $theme anatomy asset instead of the central hero artwork",
    ({ theme, src, width, height }) => {
      localStorage.setItem("theme", theme);
      const { container } = renderPanel();
      const anatomyImage = container.querySelector("img");

      expect(anatomyImage).toHaveAttribute("src", src);
      expect(anatomyImage).toHaveAttribute("width", width);
      expect(anatomyImage).toHaveAttribute("height", height);
      expect(anatomyImage).not.toHaveAttribute(
        "src",
        "/images/hero/ronin-dark-crimson-enso-alpha-safe-v3.png",
      );
    },
  );
});
