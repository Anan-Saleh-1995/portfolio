import { useEffect, useRef } from "react";
import { useLingui } from "@lingui/react/macro";
import gsap from "gsap";
import { useMediaQuery } from "@/shared/lib/useMediaQuery";
import { useReducedMotion } from "@/shared/lib/useReducedMotion";
import {
  calculatePointerCoordinates,
  formatHeroCoordinates,
  TOKYO_REFERENCE_COORDINATES,
  TOKYO_REFERENCE_READOUT,
  type HeroCoordinatePair,
} from "./heroCoordinateMath";
import styles from "./Hero.module.css";

const FINE_POINTER_QUERY = "(pointer: fine)";

export const HeroCoordinates = () => {
  const { t } = useLingui();
  const rootRef = useRef<HTMLParagraphElement>(null);
  const readoutRef = useRef<HTMLSpanElement>(null);
  const hasFinePointer = useMediaQuery(FINE_POINTER_QUERY);
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    const root = rootRef.current;
    const readout = readoutRef.current;

    if (!root || !readout) return;

    readout.textContent = TOKYO_REFERENCE_READOUT;

    if (!hasFinePointer || reduceMotion) return;

    const interactionSurface =
      root.closest<HTMLElement>("[data-hero-coordinate-surface], section") ??
      root.parentElement ??
      root;
    const currentCoordinates: HeroCoordinatePair = {
      ...TOKYO_REFERENCE_COORDINATES,
    };
    let activeTween: gsap.core.Tween | null = null;

    const animateTo = (coordinates: HeroCoordinatePair) => {
      activeTween?.kill();
      activeTween = gsap.to(currentCoordinates, {
        latitude: coordinates.latitude,
        longitude: coordinates.longitude,
        duration: 0.38,
        ease: "power3.out",
        overwrite: "auto",
        onUpdate: () => {
          readout.textContent = formatHeroCoordinates(currentCoordinates);
        },
      });
    };

    const handlePointerMove = (event: PointerEvent) => {
      animateTo(
        calculatePointerCoordinates(
          event.clientX,
          event.clientY,
          root.getBoundingClientRect(),
        ),
      );
    };

    const restoreTokyo = () => {
      animateTo({ ...TOKYO_REFERENCE_COORDINATES });
    };

    interactionSurface.addEventListener("pointermove", handlePointerMove, {
      passive: true,
    });
    interactionSurface.addEventListener("pointerleave", restoreTokyo);

    return () => {
      interactionSurface.removeEventListener("pointermove", handlePointerMove);
      interactionSurface.removeEventListener("pointerleave", restoreTokyo);
      activeTween?.kill();
      readout.textContent = TOKYO_REFERENCE_READOUT;
    };
  }, [hasFinePointer, reduceMotion]);

  const accessibleLabel = t({
    id: "hero.specimen.coordinatesLabel",
    message: "Tokyo reference coordinates",
  });

  return (
    <p
      ref={rootRef}
      className={`${styles.coordinates} pointer-events-none absolute bottom-4 right-6 z-30 items-center gap-2 whitespace-nowrap [font-family:var(--font-mono)] text-[0.625rem] tabular-nums tracking-[0.08em] text-[var(--text-muted)] sm:right-8 lg:right-10`}
      aria-label={`${accessibleLabel}: ${TOKYO_REFERENCE_READOUT}`}
    >
      <span
        className="size-1.5 rounded-full bg-[var(--token)]"
        aria-hidden="true"
      />
      <span
        ref={readoutRef}
        dir="ltr"
        translate="no"
        aria-hidden="true"
        data-coordinate-readout
      >
        {TOKYO_REFERENCE_READOUT}
      </span>
    </p>
  );
};
