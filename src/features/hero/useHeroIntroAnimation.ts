import { useEffect, type RefObject } from "react";
import gsap from "gsap";
import { prefersReducedMotion } from "@/shared/lib/motion";

export const useHeroIntroAnimation = (
  overlayRef: RefObject<HTMLDivElement | null>,
) => {
  useEffect(() => {
    const overlay = overlayRef.current;
    if (!overlay) return;

    const introTargets =
      overlay.querySelectorAll<HTMLElement>("[data-animate]");
    if (!introTargets.length) return;

    if (prefersReducedMotion()) {
      introTargets.forEach((target) => {
        target.style.opacity = "1";
        target.style.transform = "none";
      });
      return;
    }

    const introAnimation = gsap.to(introTargets, {
      opacity: 1,
      y: 0,
      duration: 0.8,
      ease: "power3.out",
      stagger: 0.15,
      delay: 0.4,
    });

    return () => {
      introAnimation.kill();
    };
  }, [overlayRef]);
};
