import { setupI18n } from "@lingui/core";
import { I18nProvider } from "@lingui/react";
import { fireEvent, render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { ThemeProvider } from "@/shared/lib/ThemeProvider";
import { Nav } from "./Nav";

const localeMock = vi.hoisted(() => ({
  state: {
    locale: "en" as const,
    direction: "ltr" as const,
    pendingLocale: null,
    isLocaleChanging: false,
    localeChangeError: null,
    setLocale: vi.fn(() => Promise.resolve(true)),
  },
}));

vi.mock("@/shared/i18n/useLocale", () => ({
  useLocale: () => localeMock.state,
}));

const messages = {
  "language.changeFailed": "Language change failed. Try again.",
  "language.label": "Language",
  "language.preview": "Preview",
  "language.switching": "Switching language to {pendingEndonym}",
  "nav.backToTop": "Back to top",
  "nav.brand": "anan",
  "nav.brandTagline": "Crafting digital experiences",
  "nav.link.arsenal": "Arsenal",
  "nav.link.engagement": "Engagement",
  "nav.link.forge": "Forge",
  "nav.link.provingGround": "Proving Ground",
  "nav.link.theWay": "The Way",
  "nav.mainNavigation": "Main navigation",
  "nav.menu.close": "Close menu",
  "nav.menu.open": "Open menu",
  "nav.mobileNavigation": "Mobile navigation",
  "nav.navigation": "Navigation",
  "nav.skipToContent": "Skip to content",
  "nav.source.ariaLabel": "View portfolio source on GitHub",
  "nav.source.label": "Source",
  "theme.switchToDark": "Switch to dark mode",
  "theme.switchToLight": "Switch to light mode",
};

const testI18n = setupI18n({ locale: "en", messages: { en: messages } });

const renderNav = () =>
  render(
    <I18nProvider i18n={testI18n}>
      <ThemeProvider>
        <Nav />
        <main id="main-content" />
        <footer />
      </ThemeProvider>
    </I18nProvider>,
  );

describe("Nav", () => {
  beforeEach(() => {
    document.documentElement.style.overflow = "";
    document.body.style.overflow = "";
  });

  it("does not steal focus on initial render", () => {
    renderNav();

    expect(screen.getByRole("button", { name: "Open menu" })).not.toHaveFocus();
    expect(
      screen.getByText("Crafting digital experiences"),
    ).toBeInTheDocument();
  });

  it("opens the drawer, locks background interaction, and focuses close", async () => {
    const user = userEvent.setup();
    renderNav();

    const toggle = screen.getByRole("button", { name: "Open menu" });
    await user.click(toggle);

    expect(toggle).toHaveAttribute("aria-expanded", "true");
    expect(
      within(
        screen.getByRole("dialog", { name: "Mobile navigation" }),
      ).getByRole("button", { name: "Close menu" }),
    ).toHaveFocus();
    expect(document.documentElement.style.overflow).toBe("hidden");
    expect(document.body.style.overflow).toBe("hidden");
    expect(document.getElementById("main-content")!.inert).toBe(true);
  });

  it("closes on Escape, restores scrolling, and returns focus", async () => {
    const user = userEvent.setup();
    renderNav();

    const toggle = screen.getByRole("button", { name: "Open menu" });
    await user.click(toggle);
    await user.keyboard("{Escape}");

    expect(toggle).toHaveAttribute("aria-expanded", "false");
    expect(toggle).toHaveFocus();
    expect(document.documentElement.style.overflow).toBe("");
    expect(document.body.style.overflow).toBe("");
    expect(document.getElementById("main-content")!.inert).toBe(false);
  });

  it("contains keyboard focus inside the open drawer", async () => {
    const user = userEvent.setup();
    renderNav();

    await user.click(screen.getByRole("button", { name: "Open menu" }));
    const dialog = screen.getByRole("dialog", { name: "Mobile navigation" });
    const close = within(dialog).getByRole("button", { name: "Close menu" });
    const source = within(dialog).getByRole("link", {
      name: "View portfolio source on GitHub",
    });

    source.focus();
    await user.tab();
    expect(close).toHaveFocus();

    await user.tab({ shift: true });
    expect(source).toHaveFocus();
  });

  it("closes when its backdrop is selected", async () => {
    const user = userEvent.setup();
    renderNav();

    const toggle = screen.getByRole("button", { name: "Open menu" });
    await user.click(toggle);
    const dialog = screen.getByRole("dialog", { name: "Mobile navigation" });
    const backdrop = dialog.parentElement?.firstElementChild;

    expect(backdrop).not.toBeNull();
    fireEvent.click(backdrop!);
    expect(toggle).toHaveAttribute("aria-expanded", "false");
    expect(toggle).toHaveFocus();
  });

  it("keeps the existing one-page anchors and closes after selection", async () => {
    const user = userEvent.setup();
    renderNav();

    const toggle = screen.getByRole("button", { name: "Open menu" });
    await user.click(toggle);
    const dialog = screen.getByRole("dialog", { name: "Mobile navigation" });
    const link = within(dialog).getByRole("link", { name: "The Way" });

    expect(link).toHaveAttribute("href", "#the-way");
    await user.click(link);

    expect(toggle).toHaveAttribute("aria-expanded", "false");
    expect(toggle).toHaveFocus();
  });
});
