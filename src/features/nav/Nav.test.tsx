import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import { ThemeProvider } from "@/shared/lib/ThemeProvider";
import { Nav } from "./Nav";

describe("Nav", () => {
  it("opens the mobile menu and closes it on Escape", async () => {
    const user = userEvent.setup();

    render(
      <ThemeProvider>
        <Nav />
      </ThemeProvider>,
    );

    const toggle = screen.getByRole("button", { name: "Open menu" });
    await user.click(toggle);

    expect(toggle).toHaveAttribute("aria-expanded", "true");
    expect(
      screen.getByRole("navigation", { name: "Mobile navigation" }),
    ).toBeInTheDocument();

    await user.keyboard("{Escape}");

    expect(toggle).toHaveAttribute("aria-expanded", "false");
  });

  it("updates the menu button accessible state when toggled", async () => {
    const user = userEvent.setup();

    render(
      <ThemeProvider>
        <Nav />
      </ThemeProvider>,
    );

    const toggle = screen.getByRole("button", { name: "Open menu" });
    expect(toggle).toHaveAttribute("aria-expanded", "false");
    await user.click(toggle);
    expect(
      screen.getByRole("button", { name: "Close menu" }),
    ).toBeInTheDocument();
    expect(toggle).toHaveAttribute("aria-expanded", "true");
    expect(
      screen.getByRole("navigation", { name: "Mobile navigation" }),
    ).toBeInTheDocument();
  });

  it("closes the mobile menu when a navigation link is selected", async () => {
    const user = userEvent.setup();

    render(
      <ThemeProvider>
        <Nav />
      </ThemeProvider>,
    );
    const toggle = screen.getByRole("button", { name: "Open menu" });
    await user.click(toggle);
    expect(
      screen.getByRole("navigation", { name: "Mobile navigation" }),
    ).toBeInTheDocument();
    const link = screen.getByRole("link", { name: "The Way" });
    await user.click(link);
    const afterLinkToggle = screen.getByRole("button", { name: "Open menu" });
    expect(afterLinkToggle).toHaveAttribute("aria-expanded", "false");
  });

  it("shows the close label when the mobile menu opens", async () => {
    const user = userEvent.setup();

    render(
      <ThemeProvider>
        <Nav />
      </ThemeProvider>,
    );

    const toggle = screen.getByRole("button", { name: "Open menu" });
    await user.click(toggle);
    expect(
      screen.getByRole("button", { name: "Close menu" }),
    ).toBeInTheDocument();
  });
});
