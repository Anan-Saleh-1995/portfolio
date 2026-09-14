import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it } from "vitest";
import { ThemeProvider } from "@/shared/lib/ThemeProvider";
import { ThemeToggle } from "./ThemeToggle";

const renderToggle = () =>
  render(
    <ThemeProvider>
      <ThemeToggle />
    </ThemeProvider>,
  );

describe("ThemeToggle", () => {
  beforeEach(() => {
    localStorage.clear();
    document.documentElement.removeAttribute("data-theme");
  });

  it("describes the available theme action", () => {
    localStorage.setItem("theme", "dark");
    renderToggle();

    expect(
      screen.getByRole("button", { name: "Switch to light mode" }),
    ).toBeInTheDocument();
  });

  it("keeps the current theme behavior and updates its accessible label", async () => {
    const user = userEvent.setup();
    localStorage.setItem("theme", "dark");
    renderToggle();

    await user.click(
      screen.getByRole("button", { name: "Switch to light mode" }),
    );

    expect(document.documentElement).toHaveAttribute("data-theme", "light");
    expect(
      screen.getByRole("button", { name: "Switch to dark mode" }),
    ).toBeInTheDocument();
  });
});
