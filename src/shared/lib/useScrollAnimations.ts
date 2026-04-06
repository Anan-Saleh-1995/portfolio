import { useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export const useScrollAnimations = () => {
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
      revealSection("the-way");
      revealSection("arsenal");
      revealSection("forge");
      revealSection("contact");
      footerReveal();
    });

    return () => ctx.revert();
  }, []);
};

const heroEntrance = () => {
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
};

const revealSection = (id: string) => {
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
};

const footerReveal = () => {
  const footer = document.querySelector<HTMLElement>("footer");
  if (!footer) return;

  if (footer.getBoundingClientRect().top <= window.innerHeight) {
    gsap.set(footer, { opacity: 1 });
    return;
  }

  gsap.fromTo(
    footer,
    { opacity: 0 },
    {
      opacity: 1,
      duration: 0.5,
      ease: "power2.out",
      immediateRender: false,
      scrollTrigger: {
        trigger: footer,
        start: "top bottom",
        once: true,
        invalidateOnRefresh: true,
      },
    },
  );
};
