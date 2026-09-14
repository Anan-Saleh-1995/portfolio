import { useEffect, useRef } from "react";
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

const VISIBLE_POINTER_QUERY =
  "(pointer: fine) and (min-width: 80rem) and (min-height: 50rem)";
const SETTLED_DISTANCE = 0.000001;
const RESPONSE_TIME_MS = 65;

export const HeroCoordinates = () => {
  const rootRef = useRef<HTMLParagraphElement>(null);
  const readoutRef = useRef<HTMLSpanElement>(null);
  const hasVisiblePointer = useMediaQuery(VISIBLE_POINTER_QUERY);
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    const root = rootRef.current;
    const readout = readoutRef.current;

    if (!root || !readout) return;

    readout.textContent = TOKYO_REFERENCE_READOUT;

    if (!hasVisiblePointer || reduceMotion) return;

    const interactionSurface =
      root.closest<HTMLElement>("[data-hero-coordinate-surface], section") ??
      root.parentElement ??
      root;
    const currentCoordinates: HeroCoordinatePair = {
      ...TOKYO_REFERENCE_COORDINATES,
    };
    let targetCoordinates: HeroCoordinatePair = {
      ...TOKYO_REFERENCE_COORDINATES,
    };
    let pointer: { x: number; y: number } | null = null;
    let anchor: DOMRect | null = null;
    let geometryChanged = true;
    let pointerChanged = false;
    let animationFrame: number | null = null;
    let previousFrameTime: number | null = null;
    let lastReadout = TOKYO_REFERENCE_READOUT;

    const writeReadout = () => {
      const nextReadout = formatHeroCoordinates(currentCoordinates);
      if (nextReadout === lastReadout) return;
      readout.textContent = nextReadout;
      lastReadout = nextReadout;
    };

    const renderFrame = (time: number) => {
      animationFrame = null;
      if (document.hidden) return;

      if (pointer && (pointerChanged || geometryChanged)) {
        if (!anchor || geometryChanged) {
          anchor = root.getBoundingClientRect();
          geometryChanged = false;
        }
        targetCoordinates = calculatePointerCoordinates(
          pointer.x,
          pointer.y,
          anchor,
        );
        pointerChanged = false;
      }

      const elapsed =
        previousFrameTime === null
          ? 16
          : Math.min(time - previousFrameTime, 64);
      previousFrameTime = time;
      const response = 1 - Math.exp(-elapsed / RESPONSE_TIME_MS);
      currentCoordinates.latitude +=
        (targetCoordinates.latitude - currentCoordinates.latitude) * response;
      currentCoordinates.longitude +=
        (targetCoordinates.longitude - currentCoordinates.longitude) * response;

      const settled =
        Math.abs(targetCoordinates.latitude - currentCoordinates.latitude) <
          SETTLED_DISTANCE &&
        Math.abs(targetCoordinates.longitude - currentCoordinates.longitude) <
          SETTLED_DISTANCE;

      if (settled) {
        Object.assign(currentCoordinates, targetCoordinates);
        previousFrameTime = null;
      }
      writeReadout();

      if (!settled) animationFrame = requestAnimationFrame(renderFrame);
    };

    const requestFrame = () => {
      if (animationFrame === null && !document.hidden) {
        animationFrame = requestAnimationFrame(renderFrame);
      }
    };

    const handlePointerMove = (event: PointerEvent) => {
      if (document.hidden) return;
      if (pointer?.x === event.clientX && pointer.y === event.clientY) return;
      pointer = { x: event.clientX, y: event.clientY };
      pointerChanged = true;
      requestFrame();
    };

    const invalidateGeometry = () => {
      geometryChanged = true;
    };

    const handlePointerEnter = (event: PointerEvent) => {
      invalidateGeometry();
      handlePointerMove(event);
    };

    const restoreTokyo = () => {
      pointer = null;
      pointerChanged = false;
      targetCoordinates = { ...TOKYO_REFERENCE_COORDINATES };
      requestFrame();
    };

    const stopAnimation = () => {
      if (animationFrame !== null) cancelAnimationFrame(animationFrame);
      animationFrame = null;
      previousFrameTime = null;
    };

    const handleVisibilityChange = () => {
      invalidateGeometry();
      if (!document.hidden) return;
      stopAnimation();
      pointer = null;
      pointerChanged = false;
      targetCoordinates = { ...TOKYO_REFERENCE_COORDINATES };
      Object.assign(currentCoordinates, TOKYO_REFERENCE_COORDINATES);
      writeReadout();
    };

    const resizeObserver =
      typeof ResizeObserver === "undefined"
        ? null
        : new ResizeObserver(invalidateGeometry);
    resizeObserver?.observe(interactionSurface);
    resizeObserver?.observe(root);
    interactionSurface.addEventListener("pointerenter", handlePointerEnter, {
      passive: true,
    });
    interactionSurface.addEventListener("pointermove", handlePointerMove, {
      passive: true,
    });
    interactionSurface.addEventListener("pointerleave", restoreTokyo);
    window.addEventListener("resize", invalidateGeometry, { passive: true });
    window.addEventListener("scroll", invalidateGeometry, { passive: true });
    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      resizeObserver?.disconnect();
      interactionSurface.removeEventListener(
        "pointerenter",
        handlePointerEnter,
      );
      interactionSurface.removeEventListener("pointermove", handlePointerMove);
      interactionSurface.removeEventListener("pointerleave", restoreTokyo);
      window.removeEventListener("resize", invalidateGeometry);
      window.removeEventListener("scroll", invalidateGeometry);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      stopAnimation();
      readout.textContent = TOKYO_REFERENCE_READOUT;
    };
  }, [hasVisiblePointer, reduceMotion]);

  return (
    <p
      ref={rootRef}
      className={`${styles.coordinates} pointer-events-none absolute bottom-4 right-6 z-30 items-center gap-2 whitespace-nowrap [font-family:var(--font-mono)] text-[0.625rem] tabular-nums tracking-[0.08em] text-[var(--text-muted)] sm:right-8 lg:right-10`}
      aria-label={`Tokyo reference coordinates: ${TOKYO_REFERENCE_READOUT}`}
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
