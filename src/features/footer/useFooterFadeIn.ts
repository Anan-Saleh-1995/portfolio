import { useEffect, type RefObject } from "react";
import gsap from "gsap";
import { prefersReducedMotion } from "@/shared/lib/motion";

export const useFooterFadeIn = (footerRef: RefObject<HTMLElement | null>) => {
  useEffect(() => {
    const footer = footerRef.current;
    if (!footer) return;

    if (prefersReducedMotion()) {
      footer.style.opacity = "1";
      return;
    }

    if (footer.getBoundingClientRect().top <= window.innerHeight) {
      gsap.set(footer, { opacity: 1 });
      return;
    }

    gsap.set(footer, { opacity: 0 });

    let hasRevealed = false;

    const revealFooter = () => {
      if (hasRevealed) return;
      hasRevealed = true;
      observer?.disconnect();
      gsap.to(footer, {
        opacity: 1,
        duration: 0.5,
        ease: "power2.out",
        overwrite: "auto",
      });
    };

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          revealFooter();
        }
      },
      {
        root: null,
        threshold: 0,
        rootMargin: "0px 0px -5% 0px",
      },
    );

    observer.observe(footer);

    const fallbackCheck = requestAnimationFrame(() => {
      if (footer.getBoundingClientRect().top <= window.innerHeight) {
        revealFooter();
      }
    });

    return () => {
      cancelAnimationFrame(fallbackCheck);
      observer.disconnect();
    };
  }, [footerRef]);
};
