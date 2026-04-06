import { useEffect, type RefObject } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { prefersReducedMotion } from "./motion";

gsap.registerPlugin(ScrollTrigger);

export const useScrollReveal = (
  containerRef: RefObject<HTMLElement | null>,
) => {
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const revealTargets =
      container.querySelectorAll<HTMLElement>("[data-animate]");
    if (!revealTargets.length) return;

    if (prefersReducedMotion()) {
      revealTargets.forEach((target) => {
        target.style.opacity = "1";
        target.style.transform = "none";
      });
      return;
    }

    const revealAnimation = gsap.to(revealTargets, {
      opacity: 1,
      y: 0,
      duration: 0.7,
      ease: "power3.out",
      stagger: 0.1,
      paused: true,
    });

    const revealTrigger = ScrollTrigger.create({
      trigger: container,
      start: "top 80%",
      once: true,
      onEnter: () => revealAnimation.play(),
    });

    return () => {
      revealTrigger.kill();
      revealAnimation.kill();
    };
  }, [containerRef]);
};
