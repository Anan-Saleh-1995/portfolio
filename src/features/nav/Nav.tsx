import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type KeyboardEvent,
} from "react";
import { Menu, X } from "lucide-react";
import { EnsoMark } from "@/shared/ui/EnsoMark";
import { ThemeToggle } from "@/shared/ui/ThemeToggle";
import { useEscapeKey } from "@/shared/lib/useEscapeKey";
import { SourceRepoLink } from "./SourceRepoLink";
import { useHideOnScroll } from "./useHideOnScroll";
import styles from "./Nav.module.css";

interface NavigationLink {
  href: string;
  label: string;
}

export const Nav = () => {
  const hidden = useHideOnScroll();
  const [menuOpen, setMenuOpen] = useState(false);
  const toggleRef = useRef<HTMLButtonElement>(null);
  const drawerCloseRef = useRef<HTMLButtonElement>(null);
  const mobileMenuRef = useRef<HTMLDivElement>(null);
  const wasMenuOpenRef = useRef(false);
  const restoreFocusRef = useRef(false);

  const navigationLinks: NavigationLink[] = [
    {
      href: "#the-way",
      label: "The Way",
    },
    {
      href: "#arsenal",
      label: "Arsenal",
    },
    {
      href: "#forge",
      label: "Forge",
    },
    {
      href: "#proving-ground",
      label: "Proving Ground",
    },
    {
      href: "#contact",
      label: "Engagement",
    },
  ];

  const closeMenu = useCallback((restoreFocus = true) => {
    restoreFocusRef.current = restoreFocus;
    setMenuOpen(false);
  }, []);

  const openMenu = useCallback(() => {
    restoreFocusRef.current = true;
    setMenuOpen(true);
  }, []);

  const toggleMenu = useCallback(() => {
    if (menuOpen) {
      closeMenu();
      return;
    }

    openMenu();
  }, [closeMenu, menuOpen, openMenu]);

  useEscapeKey(() => closeMenu(), menuOpen);

  useEffect(() => {
    window.dispatchEvent(
      new CustomEvent("portfolio:mobile-menu-toggle", {
        detail: { open: menuOpen },
      }),
    );

    return () => {
      window.dispatchEvent(
        new CustomEvent("portfolio:mobile-menu-toggle", {
          detail: { open: false },
        }),
      );
    };
  }, [menuOpen]);

  useEffect(() => {
    if (menuOpen) {
      wasMenuOpenRef.current = true;
      drawerCloseRef.current?.focus();
      return;
    }

    if (wasMenuOpenRef.current && restoreFocusRef.current) {
      toggleRef.current?.focus();
    }

    wasMenuOpenRef.current = false;
    restoreFocusRef.current = false;
  }, [menuOpen]);

  useEffect(() => {
    if (!menuOpen) {
      return;
    }

    const previousHtmlOverflow = document.documentElement.style.overflow;
    const previousBodyOverflow = document.body.style.overflow;
    const main = document.getElementById("main-content");
    const footer = document.querySelector("footer");
    const mainWasInert = main?.inert ?? false;
    const footerWasInert = footer?.inert ?? false;

    document.documentElement.style.overflow = "hidden";
    document.body.style.overflow = "hidden";
    if (main) {
      main.inert = true;
    }
    if (footer) {
      footer.inert = true;
    }

    return () => {
      document.documentElement.style.overflow = previousHtmlOverflow;
      document.body.style.overflow = previousBodyOverflow;

      if (!mainWasInert) {
        if (main) {
          main.inert = false;
        }
      }
      if (!footerWasInert) {
        if (footer) {
          footer.inert = false;
        }
      }
    };
  }, [menuOpen]);

  useEffect(() => {
    const desktopQuery = window.matchMedia("(min-width: 1280px)");
    const handleDesktopChange = (event: MediaQueryListEvent) => {
      if (event.matches) {
        closeMenu(false);
      }
    };

    desktopQuery.addEventListener("change", handleDesktopChange);
    return () =>
      desktopQuery.removeEventListener("change", handleDesktopChange);
  }, [closeMenu]);

  const handleMobileMenuKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key !== "Tab") {
      return;
    }

    const focusable = mobileMenuRef.current?.querySelectorAll<HTMLElement>(
      "a[href],button:not([disabled]),select:not([disabled]),[tabindex]:not([tabindex='-1'])",
    );

    if (!focusable?.length) {
      event.preventDefault();
      return;
    }

    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    const activeElement = document.activeElement;

    if (event.shiftKey && activeElement === first) {
      event.preventDefault();
      last.focus();
      return;
    }

    if (!event.shiftKey && activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  };

  const openMenuLabel = "Open menu";
  const closeMenuLabel = "Close menu";
  const mainNavigationLabel = "Main navigation";
  const mobileNavigationLabel = "Mobile navigation";

  return (
    <header
      className={`${styles.root} ${hidden && !menuOpen ? styles.hidden : ""}`}
    >
      <a
        href="#main-content"
        className="absolute -top-full start-4 z-[104] inline-flex min-h-11 items-center border border-[var(--token)] bg-[var(--bg)] px-4 py-3 [font-family:var(--font-mono)] text-xs tracking-[0.08em] text-[var(--text)] focus:top-3 focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-[var(--token)]"
      >
        Skip to content
      </a>

      <div
        className="relative mx-auto flex h-[4.5rem] max-w-[1440px] items-center justify-between px-[clamp(1rem,3vw,2.5rem)]"
        {...(menuOpen ? { inert: true, "aria-hidden": true } : {})}
      >
        <a
          href="#"
          className="inline-flex min-h-11 shrink-0 items-center gap-2.5 [font-family:var(--font-mono)] text-[var(--text)] no-underline transition-colors hover:text-[var(--token)] focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-[var(--token)] motion-reduce:transition-none"
          aria-label="Back to top"
        >
          <EnsoMark size={24} />
          <span className="flex flex-col items-start leading-none">
            <span
              className="text-sm tracking-[0.12em] opacity-90"
              dir="ltr"
              translate="no"
            >
              anan
            </span>
            <span className="mt-1 hidden whitespace-nowrap text-[0.48rem] uppercase tracking-[0.13em] text-[var(--token)] min-[430px]:block">
              Crafting digital experiences
            </span>
          </span>
        </a>

        <nav
          className={`${styles.desktopNav} items-center gap-[clamp(1rem,2vw,2rem)]`}
          aria-label={mainNavigationLabel}
        >
          <ul
            className="m-0 flex list-none items-center gap-[clamp(0.9rem,1.5vw,1.75rem)] p-0"
            role="list"
          >
            {navigationLinks.map(({ href, label }) => (
              <li key={href}>
                <a
                  href={href}
                  className="inline-flex min-h-11 items-center [font-family:var(--font-mono)] text-xs tracking-[0.08em] text-[var(--text-muted)] uppercase no-underline transition-colors hover:text-[var(--token)] focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-[var(--token)] motion-reduce:transition-none"
                >
                  {label}
                </a>
              </li>
            ))}
          </ul>

          <div className="flex items-center gap-2.5">
            <SourceRepoLink />
            <ThemeToggle />
          </div>
        </nav>

        <div className={`${styles.compactUtilities} items-center gap-1.5`}>
          <ThemeToggle />
          <button
            ref={toggleRef}
            type="button"
            className="inline-flex size-11 shrink-0 items-center justify-center rounded-full text-[var(--text)] transition-colors hover:bg-[color-mix(in_srgb,var(--surface-raised)_72%,transparent)] hover:text-[var(--token)] focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-[var(--token)] motion-reduce:transition-none"
            onClick={toggleMenu}
            aria-expanded={menuOpen}
            aria-label={menuOpen ? closeMenuLabel : openMenuLabel}
            aria-controls="mobile-menu"
          >
            {menuOpen ? (
              <X size={20} aria-hidden={true} />
            ) : (
              <Menu size={20} aria-hidden={true} />
            )}
          </button>
        </div>
      </div>

      <div
        id="mobile-menu"
        className={`fixed inset-0 z-[102] flex ${styles.mobileMenu} ${menuOpen ? styles.mobileMenuOpen : ""}`}
        aria-hidden={!menuOpen}
        {...(!menuOpen ? { inert: true } : {})}
      >
        <div
          className={`absolute inset-0 ${styles.mobileBackdrop}`}
          aria-hidden={true}
          onClick={() => closeMenu()}
        />

        <div
          ref={mobileMenuRef}
          className={`relative z-[1] ms-auto flex h-dvh w-[min(88vw,26rem)] flex-col overflow-y-auto border-s border-[var(--border)] px-[clamp(1.25rem,5vw,2rem)] pt-4 pb-8 motion-reduce:transition-none ${styles.mobilePanel} ${
            menuOpen ? "translate-x-0" : "translate-x-full"
          }`}
          role="dialog"
          aria-modal="true"
          aria-label={mobileNavigationLabel}
          onKeyDown={handleMobileMenuKeyDown}
        >
          <div className="mb-[clamp(2rem,7vh,4.5rem)] flex min-h-12 items-center justify-between">
            <span className="[font-family:var(--font-mono)] text-xs tracking-[0.14em] text-[var(--text-muted)] uppercase">
              Navigation
            </span>
            <button
              ref={drawerCloseRef}
              type="button"
              className="inline-flex size-11 shrink-0 items-center justify-center rounded-full text-[var(--text)] transition-colors hover:bg-[color-mix(in_srgb,var(--surface-raised)_72%,transparent)] hover:text-[var(--token)] focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-[var(--token)] motion-reduce:transition-none"
              onClick={() => closeMenu()}
              aria-label={closeMenuLabel}
            >
              <X size={20} aria-hidden={true} />
            </button>
          </div>

          <nav aria-label={mobileNavigationLabel}>
            <ul
              className="m-0 flex list-none flex-col items-start gap-[clamp(1.25rem,4vh,2.25rem)] p-0"
              role="list"
            >
              {navigationLinks.map(({ href, label }) => (
                <li key={href}>
                  <a
                    href={href}
                    className="inline-flex min-h-11 items-center [font-family:var(--font-display)] text-[clamp(2rem,8vw,var(--text-3xl))] leading-none font-semibold text-[var(--text)] no-underline transition-colors hover:text-[var(--token)] focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-[var(--token)] motion-reduce:transition-none"
                    onClick={() => closeMenu()}
                  >
                    {label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          <div className="mt-auto flex items-center pt-8">
            <SourceRepoLink />
          </div>
        </div>
      </div>
    </header>
  );
};
