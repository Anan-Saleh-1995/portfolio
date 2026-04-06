import { useState, useCallback, useEffect, useRef } from "react";
import { Menu, X } from "lucide-react";
import { getHomeContent } from "@/shared/i18n/getHomeContent";
import { EnsoMark } from "@/shared/ui/EnsoMark";
import { ThemeToggle } from "@/shared/ui/ThemeToggle";
import { useHideOnScroll } from "./useHideOnScroll";
import { useEscapeKey } from "@/shared/lib/useEscapeKey";
import styles from "./Nav.module.css";

const MOBILE_MENU_EVENT = "portfolio:mobile-menu-toggle";

export const Nav = () => {
  const hidden = useHideOnScroll();
  const [menuOpen, setMenuOpen] = useState(false);
  const toggleRef = useRef<HTMLButtonElement>(null);
  const mobileMenuRef = useRef<HTMLDivElement>(null);
  const { nav } = getHomeContent();

  const closeMenu = useCallback(() => setMenuOpen(false), []);
  useEscapeKey(closeMenu, menuOpen);

  useEffect(() => {
    window.dispatchEvent(
      new CustomEvent(MOBILE_MENU_EVENT, {
        detail: { open: menuOpen },
      }),
    );

    return () => {
      window.dispatchEvent(
        new CustomEvent(MOBILE_MENU_EVENT, {
          detail: { open: false },
        }),
      );
    };
  }, [menuOpen]);

  useEffect(() => {
    if (!menuOpen) {
      toggleRef.current?.focus();
      return;
    }

    const firstLink =
      mobileMenuRef.current?.querySelector<HTMLAnchorElement>("a");
    firstLink?.focus();
  }, [menuOpen]);

  const handleMobileMenuKeyDown = (
    event: React.KeyboardEvent<HTMLDivElement>,
  ) => {
    if (event.key !== "Tab") {
      return;
    }

    const focusable = mobileMenuRef.current?.querySelectorAll<
      HTMLAnchorElement | HTMLButtonElement
    >("a[href], button:not([disabled])");

    if (!focusable || focusable.length === 0) {
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

  return (
    <header className={`${styles.root} ${hidden ? styles.hidden : ""}`}>
      <a href="#main-content" className={styles.skipLink}>
        Skip to content
      </a>
      <div className={styles.inner}>
        <a href="#" className={styles.brand} aria-label={nav.backToTopLabel}>
          <EnsoMark size={20} />
          <span className={styles.brandName}>{nav.brand}</span>
        </a>

        <nav className={styles.desktopNav} aria-label={nav.mainNavigationLabel}>
          <ul className={styles.navList} role="list">
            {nav.links.map(({ href, label }) => (
              <li key={href}>
                <a href={href} className={styles.navLink}>
                  {label}
                </a>
              </li>
            ))}
          </ul>
          <ThemeToggle />
        </nav>

        <div className={styles.mobileControls}>
          <ThemeToggle />
          <button
            ref={toggleRef}
            className={styles.hamburger}
            onClick={() => setMenuOpen((prev) => !prev)}
            aria-expanded={menuOpen}
            aria-label={menuOpen ? nav.closeMenuLabel : nav.openMenuLabel}
            aria-controls="mobile-menu"
          >
            {menuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      <div
        id="mobile-menu"
        ref={mobileMenuRef}
        className={`${styles.mobileMenu} ${menuOpen ? styles.mobileMenuOpen : ""}`}
        aria-hidden={!menuOpen}
        {...(!menuOpen ? { inert: true } : {})}
        onKeyDown={handleMobileMenuKeyDown}
      >
        <nav aria-label={nav.mobileNavigationLabel}>
          <ul className={styles.mobileNavList} role="list">
            {nav.links.map(({ href, label }) => (
              <li key={href}>
                <a
                  href={href}
                  className={styles.mobileNavLink}
                  onClick={closeMenu}
                >
                  {label}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </header>
  );
};
