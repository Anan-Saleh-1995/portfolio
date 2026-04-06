import { useState, useCallback } from "react";
import { Menu, X } from "lucide-react";
import { EnsoMark } from "@/shared/ui/EnsoMark";
import { ThemeToggle } from "@/shared/ui/ThemeToggle";
import { useHideOnScroll } from "./useHideOnScroll";
import { useEscapeKey } from "@/shared/lib/useEscapeKey";
import styles from "./Nav.module.css";

const NAV_LINKS = [
  { href: "#the-way", label: "The Way" },
  { href: "#arsenal", label: "Arsenal" },
  { href: "#forge", label: "Forge" },
  { href: "#contact", label: "Engagement" },
];

export const Nav = () => {
  const hidden = useHideOnScroll();
  const [menuOpen, setMenuOpen] = useState(false);

  const closeMenu = useCallback(() => setMenuOpen(false), []);
  useEscapeKey(closeMenu, menuOpen);

  return (
    <header className={`${styles.root} ${hidden ? styles.hidden : ""}`}>
      <div className={styles.inner}>
        <a href="#" className={styles.brand} aria-label="Back to top">
          <EnsoMark size={20} />
          <span className={styles.brandName}>anan</span>
        </a>

        <nav className={styles.desktopNav} aria-label="Main navigation">
          <ul className={styles.navList} role="list">
            {NAV_LINKS.map(({ href, label }) => (
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
            aria-label={menuOpen ? "Close menu" : "Open menu"}
          >
            {menuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      <div
        className={`${styles.mobileMenu} ${menuOpen ? styles.mobileMenuOpen : ""}`}
        aria-hidden={!menuOpen}
      >
        <nav aria-label="Mobile navigation">
          <ul className={styles.mobileNavList} role="list">
            {NAV_LINKS.map(({ href, label }) => (
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
