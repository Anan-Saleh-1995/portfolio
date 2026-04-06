import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it, vi } from "vitest";
import { useActionState } from "react";

vi.mock("react", async () => {
  const actual = await vi.importActual<typeof import("react")>("react");

  return {
    ...actual,
    useActionState: vi.fn(),
  };
});

import { ContactForm } from "./ContactForm";

const mockedUseActionState = vi.mocked(useActionState);

describe("ContactForm", () => {
  afterEach(() => {
    mockedUseActionState.mockReset();
  });

  it("returns to a fresh form after resetting from the success state", async () => {
    const user = userEvent.setup();
    const action = vi.fn();

    mockedUseActionState
      .mockReturnValueOnce([
        { success: true, errors: {}, errorMessage: "" },
        action,
        false,
      ])
      .mockReturnValue([
        { success: false, errors: {}, errorMessage: "" },
        action,
        false,
      ]);

    render(<ContactForm />);

    await user.click(screen.getByRole("button", { name: "Send Another" }));

    expect(screen.getByLabelText("Name")).toBeInTheDocument();
    expect(screen.getByLabelText("Email")).toBeInTheDocument();
    expect(screen.getByLabelText("Purpose")).toBeInTheDocument();
    expect(screen.getByLabelText("Message")).toBeInTheDocument();
    expect(screen.queryByText("Word Received")).not.toBeInTheDocument();
  });
});
