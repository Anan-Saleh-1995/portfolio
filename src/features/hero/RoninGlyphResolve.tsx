import { useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { ScrambleTextPlugin } from "gsap/ScrambleTextPlugin";
import { useReducedMotion } from "@/shared/lib/useReducedMotion";
import styles from "./RoninGlyphResolve.module.css";

const INITIAL_GLYPH = "浪人|";
const FINAL_GLYPH = "Rōnin";

interface RoninGlyphResolveProps {
  paused?: boolean;
}

gsap.registerPlugin(ScrambleTextPlugin);

export const RoninGlyphResolve = ({
  paused = false,
}: RoninGlyphResolveProps) => {
  const glyphRef = useRef<HTMLSpanElement>(null);
  const reduceMotion = useReducedMotion();

  useLayoutEffect(() => {
    const glyph = glyphRef.current;
    if (!glyph) return;

    glyph.textContent = reduceMotion || paused ? FINAL_GLYPH : INITIAL_GLYPH;

    if (reduceMotion || paused) return;

    const context = gsap.context(() => {
      const timeline = gsap.timeline({ repeat: -1, paused: true });
      const settleGlyph = (value: string) => {
        glyph.textContent = value;
        gsap.set(glyph, {
          x: 0,
          skewX: 0,
          textShadow: "none",
        });
      };

      timeline
        .to(
          glyph,
          {
            duration: 0.07,
            x: "-0.045em",
            skewX: -8,
            textShadow: "0 0 13px var(--focus)",
            ease: "power4.in",
          },
          "+=0.2",
        )
        .to(glyph, {
          duration: 0.06,
          x: "0.07em",
          skewX: 6,
          textShadow: "-0.035em 0 var(--token), 0.035em 0 var(--text)",
          ease: "none",
        })
        .to(glyph, {
          duration: 0.62,
          x: 0,
          skewX: 0,
          textShadow:
            "0 0 9px color-mix(in srgb, var(--token) 68%, transparent)",
          ease: "power4.out",
          scrambleText: {
            text: FINAL_GLYPH,
            chars: "RŌNIN01|",
            revealDelay: 0.08,
            speed: 0.34,
            tweenLength: true,
          },
        })
        .call(() => settleGlyph(FINAL_GLYPH))
        .to(glyph, { duration: 3.6 })
        .to(glyph, {
          duration: 0.08,
          x: "0.055em",
          skewX: 7,
          textShadow: "0 0 13px var(--focus)",
          ease: "power4.in",
        })
        .to(glyph, {
          duration: 0.1,
          x: "-0.04em",
          skewX: -5,
          textShadow: "0.035em 0 var(--token), -0.035em 0 var(--text)",
          ease: "none",
        })
        .to(glyph, {
          duration: 0.52,
          x: 0,
          skewX: 0,
          textShadow: "0 0 0 transparent",
          ease: "power4.out",
          scrambleText: {
            text: INITIAL_GLYPH,
            chars: "浪人｜",
            revealDelay: 0.1,
            speed: 0.36,
            tweenLength: true,
          },
        })
        .call(() => settleGlyph(INITIAL_GLYPH))
        .to(glyph, { duration: 1.15 });

      let isIntersecting = true;
      const syncPlayback = () => {
        if (document.hidden || !isIntersecting) {
          timeline.pause();
          return;
        }

        timeline.play();
      };

      const observer =
        typeof IntersectionObserver === "undefined"
          ? null
          : new IntersectionObserver(
              ([entry]) => {
                isIntersecting = entry?.isIntersecting ?? false;
                syncPlayback();
              },
              { threshold: 0.15 },
            );

      observer?.observe(glyph);
      document.addEventListener("visibilitychange", syncPlayback);
      syncPlayback();

      return () => {
        observer?.disconnect();
        document.removeEventListener("visibilitychange", syncPlayback);
        timeline.kill();
      };
    }, glyph);

    return () => {
      context.revert();
      if (glyph.isConnected) glyph.textContent = FINAL_GLYPH;
    };
  }, [paused, reduceMotion]);

  return (
    <span className={`${styles.token} text-[var(--token)]`}>
      <span ref={glyphRef} className={styles.glyph} dir="ltr" translate="no">
        {reduceMotion || paused ? FINAL_GLYPH : INITIAL_GLYPH}
      </span>
      .
    </span>
  );
};
