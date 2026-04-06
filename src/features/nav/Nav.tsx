import { useState, useCallback, useEffect } from "react";
import { Menu, X } from "lucide-react";
import { homeContent } from "@/shared/content/en/home";
import { EnsoMark } from "@/shared/ui/EnsoMark";
import { ThemeToggle } from "@/shared/ui/ThemeToggle";
import { useHideOnScroll } from "./useHideOnScroll";
import { useEscapeKey } from "@/shared/lib/useEscapeKey";
import styles from "./Nav.module.css";

const MOBILE_MENU_EVENT = "portfolio:mobile-menu-toggle";

export const Nav = () => {
  const hidden = useHideOnScroll();
  const [menuOpen, setMenuOpen] = useState(false);
  const { nav } = homeContent;

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

  return (
    <header className={`${styles.root} ${hidden ? styles.hidden : ""}`}>
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
            className={styles.hamburger}
            onClick={() => setMenuOpen((prev) => !prev)}
            aria-expanded={menuOpen}
            aria-label={menuOpen ? nav.closeMenuLabel : nav.openMenuLabel}
          >
            {menuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      <div
        className={`${styles.mobileMenu} ${menuOpen ? styles.mobileMenuOpen : ""}`}
        aria-hidden={!menuOpen}
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
