import { setupI18n } from "@lingui/core";
import { I18nProvider } from "@lingui/react";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { useLocale } from "@/shared/i18n/useLocale";
import { LanguageSwitcher } from "./LanguageSwitcher";

vi.mock("@/shared/i18n/useLocale", () => ({
  useLocale: vi.fn(),
}));

const messages = {
  "language.changeFailed": "Language change failed. Try again.",
  "language.current": "Language: {activeOptionLabel}",
  "language.label": "Language",
  "language.switching": "Switching language to {pendingEndonym}",
};

const testI18n = setupI18n({ locale: "en", messages: { en: messages } });
const mockedUseLocale = vi.mocked(useLocale);
const setLocale = vi.fn(() => Promise.resolve(true));

const renderSwitcher = (compact = false) =>
  render(
    <I18nProvider i18n={testI18n}>
      <LanguageSwitcher compact={compact} />
    </I18nProvider>,
  );

describe("LanguageSwitcher", () => {
  beforeEach(() => {
    setLocale.mockClear();
    mockedUseLocale.mockReturnValue({
      locale: "en",
      direction: "ltr",
      pendingLocale: null,
      isLocaleChanging: false,
      localeChangeError: null,
      setLocale,
    });
  });

  it("offers only the supported endonyms and marks previews", () => {
    renderSwitcher();

    const select = screen.getByRole("combobox", { name: "Language: English" });
    const options = screen.getAllByRole("option");

    expect(options).toHaveLength(3);
    expect(options.map((option) => option.textContent)).toEqual([
      "English",
      "עברית",
      "العربية",
    ]);
    expect(select).toHaveValue("en");
  });

  it("requests an asynchronous locale activation", async () => {
    const user = userEvent.setup();
    renderSwitcher();

    await user.selectOptions(
      screen.getByRole("combobox", { name: "Language: English" }),
      "he",
    );

    await waitFor(() => {
      expect(setLocale).toHaveBeenCalledWith("he");
    });
  });

  it("keeps preview status discoverable after activation", () => {
    mockedUseLocale.mockReturnValue({
      locale: "he",
      direction: "rtl",
      pendingLocale: null,
      isLocaleChanging: false,
      localeChangeError: null,
      setLocale,
    });

    renderSwitcher(true);

    expect(
      screen.getByRole("combobox", {
        name: "Language: עברית",
      }),
    ).toBeInTheDocument();
    expect(screen.getByText("עב")).toBeInTheDocument();
  });

  it("disables the control and exposes busy state during activation", () => {
    mockedUseLocale.mockReturnValue({
      locale: "en",
      direction: "ltr",
      pendingLocale: "ar",
      isLocaleChanging: true,
      localeChangeError: null,
      setLocale,
    });

    renderSwitcher();

    const select = screen.getByRole("combobox");
    expect(select).toBeDisabled();
    expect(select).toHaveAttribute("aria-busy", "true");
  });

  it("announces activation failure without changing the selected locale", () => {
    mockedUseLocale.mockReturnValue({
      locale: "en",
      direction: "ltr",
      pendingLocale: null,
      isLocaleChanging: false,
      localeChangeError: new Error("catalog failed"),
      setLocale,
    });

    renderSwitcher(true);

    expect(screen.getByRole("alert")).toHaveTextContent(
      "Language change failed. Try again.",
    );
    expect(screen.getByRole("combobox")).toHaveValue("en");
    expect(screen.getByText("EN")).toBeInTheDocument();
  });
});
