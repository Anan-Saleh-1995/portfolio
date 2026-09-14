import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { HeroSpecimenPanel } from "./HeroSpecimenPanel";

const viewport = vi.hoisted(() => ({ wide: true }));
vi.mock("@/shared/lib/useMediaQuery", () => ({
  useMediaQuery: () => viewport.wide,
}));

describe("HeroSpecimenPanel", () => {
  beforeEach(() => {
    viewport.wide = true;
  });

  it("keeps project navigation available on wider screens", () => {
    render(<HeroSpecimenPanel />);
    expect(
      screen.getByRole("navigation", { name: "Paths into the projects" }),
    ).toBeVisible();
    expect(
      screen.getByRole("link", { name: /Learning Space/ }),
    ).toHaveAttribute("href", "#work-learning-space");
    expect(screen.getByRole("link", { name: /Dokimi Ledger/ })).toHaveAttribute(
      "href",
      "#work-dokimi",
    );
    expect(
      screen.getByRole("link", { name: "Explore all projects" }),
    ).toHaveAttribute("href", "#forge");
  });

  it("lets narrow-screen visitors open and close the map without leaving the hero", async () => {
    viewport.wide = false;
    const user = userEvent.setup();
    render(<HeroSpecimenPanel />);
    const trigger = screen.getByRole("button", { name: "Explore the map" });
    expect(trigger).toHaveAttribute("aria-expanded", "false");
    expect(screen.queryByRole("navigation")).not.toBeInTheDocument();
    await user.click(trigger);
    expect(trigger).toHaveAttribute("aria-expanded", "true");
    expect(screen.getByRole("link", { name: /Nexzon/ })).toBeVisible();
    await user.click(screen.getByRole("button", { name: "Close map" }));
    expect(screen.queryByRole("navigation")).not.toBeInTheDocument();
    expect(trigger).toHaveFocus();
  });
});
