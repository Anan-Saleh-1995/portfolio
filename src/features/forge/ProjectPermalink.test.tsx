import { afterEach, describe, expect, it, vi } from "vitest";
import { cleanup, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ProjectPermalink } from "./ProjectPermalink";

afterEach(() => {
  cleanup();
  vi.restoreAllMocks();
});

describe("ProjectPermalink", () => {
  it("copies an absolute link to the chosen project and confirms it", async () => {
    const user = userEvent.setup();
    const writeText = vi
      .spyOn(navigator.clipboard, "writeText")
      .mockResolvedValue(undefined);
    render(<ProjectPermalink id="work-dokimi" title="Dokimi Ledger" />);

    await user.click(
      screen.getByRole("button", { name: "Copy link to Dokimi Ledger" }),
    );

    const expected = new URL(window.location.href);
    expected.hash = "work-dokimi";
    expect(writeText).toHaveBeenCalledWith(expected.toString());
    expect(
      await screen.findByRole("button", {
        name: "Link to Dokimi Ledger copied",
      }),
    ).toBeEnabled();
    expect(screen.getByRole("status")).toHaveTextContent(
      "Link to Dokimi Ledger copied.",
    );
  });

  it("keeps a usable project anchor when clipboard access fails", async () => {
    const user = userEvent.setup();
    vi.spyOn(navigator.clipboard, "writeText").mockRejectedValue(
      new Error("Clipboard unavailable"),
    );
    render(<ProjectPermalink id="work-tanto" title="Tanto" />);

    await user.click(
      screen.getByRole("button", { name: "Copy link to Tanto" }),
    );

    expect(
      await screen.findByRole("link", { name: "Use project link" }),
    ).toHaveAttribute("href", "#work-tanto");
    expect(screen.getByRole("status")).toHaveTextContent("Couldn’t copy.");
    expect(
      screen.getByRole("button", { name: "Copy link to Tanto" }),
    ).toBeEnabled();
  });
});
