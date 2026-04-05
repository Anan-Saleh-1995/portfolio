import { useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export function useScrollAnimations() {
  useEffect(() => {
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    if (prefersReducedMotion) {
      document.querySelectorAll<HTMLElement>("[data-animate]").forEach((el) => {
        el.style.opacity = "1";
        el.style.transform = "none";
      });
      return;
    }

    const ctx = gsap.context(() => {
      heroEntrance();
      revealSection("about");
      revealSection("arsenal");
      revealSection("forge");
      revealSection("contact");
      footerReveal();
    });

    return () => ctx.revert();
  }, []);
}

function heroEntrance() {
  const overlay = document.querySelector("[data-hero-overlay]");
  if (!overlay) return;

  const items = overlay.querySelectorAll("[data-animate]");
  if (!items.length) return;

  gsap.to(items, {
    opacity: 1,
    y: 0,
    duration: 0.8,
    ease: "power3.out",
    stagger: 0.15,
    delay: 0.4,
  });
}

function revealSection(id: string) {
  const section = document.getElementById(id);
  if (!section) return;

  const items = section.querySelectorAll("[data-animate]");
  if (!items.length) return;

  ScrollTrigger.create({
    trigger: section,
    start: "top 80%",
    once: true,
    onEnter: () => {
      gsap.to(items, {
        opacity: 1,
        y: 0,
        duration: 0.7,
        ease: "power3.out",
        stagger: 0.1,
      });
    },
  });
}

function footerReveal() {
  const footer = document.querySelector("footer");
  if (!footer) return;

  gsap.set(footer, { opacity: 0 });

  ScrollTrigger.create({
    trigger: footer,
    start: "top 95%",
    once: true,
    onEnter: () => {
      gsap.to(footer, { opacity: 1, duration: 0.5, ease: "power2.out" });
    },
  });
}
