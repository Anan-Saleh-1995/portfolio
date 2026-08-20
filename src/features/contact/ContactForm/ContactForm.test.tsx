import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it, vi } from "vitest";
import { useActionState } from "react";
import { toast } from "sonner";
import { CONTACT_FEEDBACK_CODE } from "../contact.feedback";

vi.mock("react", async () => {
  const actual = await vi.importActual<typeof import("react")>("react");

  return {
    ...actual,
    useActionState: vi.fn(),
  };
});

vi.mock("sonner", () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
    warning: vi.fn(),
  },
}));

import { ContactForm } from "./ContactForm";

const mockedUseActionState = vi.mocked(useActionState);
const mockedToast = vi.mocked(toast);

describe("ContactForm", () => {
  afterEach(() => {
    mockedUseActionState.mockReset();
    mockedToast.success.mockReset();
    mockedToast.error.mockReset();
    mockedToast.warning.mockReset();
  });

  it("returns to a fresh form after resetting from the success state", async () => {
    const user = userEvent.setup();
    const action = vi.fn();

    mockedUseActionState
      .mockReturnValueOnce([
        {
          success: true,
          errors: {},
          errorMessage: "",
          values: { name: "", email: "", subject: "", message: "" },
          feedback: null,
        },
        action,
        false,
      ])
      .mockReturnValue([
        {
          success: false,
          errors: {},
          errorMessage: "",
          values: { name: "", email: "", subject: "", message: "" },
          feedback: null,
        },
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

  it("keeps submitted values when the action returns an error state", () => {
    const action = vi.fn();

    mockedUseActionState.mockReturnValue([
      {
        success: false,
        errors: {},
        errorMessage: "Your word could not be delivered.",
        values: {
          name: "Anan",
          email: "anan@example.com",
          subject: "Hiring Inquiry",
          message: "Hold the line.",
        },
        feedback: {
          code: CONTACT_FEEDBACK_CODE.DELIVERY_FAILED,
          kind: "error",
        },
      },
      action,
      false,
    ]);

    render(<ContactForm />);

    expect(screen.getByLabelText("Name")).toHaveValue("Anan");
    expect(screen.getByLabelText("Email")).toHaveValue("anan@example.com");
    expect(screen.getByLabelText("Purpose")).toHaveValue("Hiring Inquiry");
    expect(screen.getByLabelText("Message")).toHaveValue("Hold the line.");
    expect(mockedToast.error).toHaveBeenCalledWith("Delivery Faltered", {
      description:
        "Your word could not be delivered. Try again or use a direct channel.",
      duration: 5000,
    });
  });

  it("shows a warning toast without rendering the inline error banner", () => {
    const action = vi.fn();

    mockedUseActionState.mockReturnValue([
      {
        success: false,
        errors: {},
        errorMessage: "",
        values: {
          name: "Anan",
          email: "anan@example.com",
          subject: "Hiring Inquiry",
          message: "Hold the line.",
        },
        feedback: {
          code: CONTACT_FEEDBACK_CODE.RATE_LIMITED,
          kind: "warning",
        },
      },
      action,
      false,
    ]);

    render(<ContactForm />);

    expect(
      screen.queryByText(
        "The channel is cooling. Try again later or use a direct channel.",
      ),
    ).not.toBeInTheDocument();
    expect(mockedToast.warning).toHaveBeenCalledWith("The Gate Is Closed", {
      description:
        "The channel is cooling. Try again later or use a direct channel.",
      duration: 7000,
    });
  });
});
