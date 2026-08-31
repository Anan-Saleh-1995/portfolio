import { useLayoutEffect, type RefObject } from "react";
import gsap from "gsap";

export const useHeroIntroAnimation = (
  heroRef: RefObject<HTMLElement | null>,
  reduceMotion: boolean,
) => {
  useLayoutEffect(() => {
    const hero = heroRef.current;
    if (!hero) return;

    const context = gsap.context(() => {
      const introTargets = gsap.utils.toArray<HTMLElement>(
        "[data-hero-animate]",
        hero,
      );
      const media = hero.querySelector<HTMLElement>("[data-hero-media]");

      if (reduceMotion) {
        gsap.set(introTargets, { clearProps: "all" });
        if (media) gsap.set(media, { clearProps: "all" });
        return;
      }

      const timeline = gsap.timeline({ defaults: { ease: "power3.out" } });

      timeline.fromTo(
        introTargets,
        { autoAlpha: 0, y: 18 },
        {
          autoAlpha: 1,
          y: 0,
          duration: 0.72,
          stagger: 0.09,
          clearProps: "opacity,visibility,transform",
        },
        0.08,
      );

      if (media) {
        timeline.fromTo(
          media,
          { autoAlpha: 0, scale: 0.985 },
          {
            autoAlpha: 1,
            scale: 1,
            duration: 0.92,
            clearProps: "opacity,visibility,transform",
          },
          0.16,
        );
      }
    }, hero);

    return () => context.revert();
  }, [heroRef, reduceMotion]);
};
