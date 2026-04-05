import { useState, useEffect, useRef } from "react";

const SCROLL_THRESHOLD = 80;

export function useHideOnScroll() {
  const [hidden, setHidden] = useState(false);
  const lastScrollY = useRef(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      setHidden(
        currentScrollY > lastScrollY.current &&
          currentScrollY > SCROLL_THRESHOLD,
      );
      lastScrollY.current = currentScrollY;
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return hidden;
}
