import { useEffect, useRef } from "react";
import { useMediaQuery } from "@/shared/lib/useMediaQuery";
import { useReducedMotion } from "@/shared/lib/useReducedMotion";
import styles from "./Cursor.module.css";

const LERP_FACTOR = 0.18;
const SETTLED_DISTANCE = 0.15;
const OFFSCREEN = -200;

export const useCursorTracking = () => {
  const finePointer = useMediaQuery("(hover: hover) and (pointer: fine)");
  const reducedMotion = useReducedMotion();
  const hasMouse = finePointer && !reducedMotion;
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!hasMouse) return;

    const position = { x: OFFSCREEN, y: OFFSCREEN };
    const smoothed = { ...position };
    let frame = 0;
    let positioned = false;
    document.documentElement.setAttribute("data-custom-cursor", "");

    const stop = () => {
      cancelAnimationFrame(frame);
      frame = 0;
    };
    const setVisible = (visible: boolean) => {
      if (dotRef.current) dotRef.current.style.opacity = visible ? "1" : "0";
      if (ringRef.current) ringRef.current.style.opacity = visible ? "1" : "0";
    };
    const tick = () => {
      frame = 0;
      const dx = position.x - smoothed.x;
      const dy = position.y - smoothed.y;
      const settled =
        Math.abs(dx) < SETTLED_DISTANCE && Math.abs(dy) < SETTLED_DISTANCE;
      smoothed.x = settled ? position.x : smoothed.x + dx * LERP_FACTOR;
      smoothed.y = settled ? position.y : smoothed.y + dy * LERP_FACTOR;
      if (dotRef.current)
        dotRef.current.style.transform = `translate3d(${position.x}px, ${position.y}px, 0)`;
      if (ringRef.current)
        ringRef.current.style.transform = `translate3d(${smoothed.x}px, ${smoothed.y}px, 0)`;
      if (!settled) frame = requestAnimationFrame(tick);
    };
    const onMove = (event: MouseEvent) => {
      position.x = event.clientX;
      position.y = event.clientY;
      if (!positioned) {
        smoothed.x = position.x;
        smoothed.y = position.y;
        positioned = true;
      }
      if (!frame && !document.hidden) frame = requestAnimationFrame(tick);
    };
    const onOver = (event: MouseEvent) => {
      if (!(event.target instanceof Element)) return;
      const nativeControl = event.target.closest("input, textarea, select");
      setVisible(!nativeControl);
      ringRef.current?.classList.toggle(
        styles.active,
        !nativeControl && Boolean(event.target.closest("a, button, summary")),
      );
    };
    const onLeave = () => {
      setVisible(false);
      stop();
      positioned = false;
    };
    const onEnter = () => setVisible(positioned);
    const onVisibilityChange = () => {
      if (document.hidden) onLeave();
    };

    setVisible(false);
    document.addEventListener("mousemove", onMove, { passive: true });
    document.addEventListener("mouseover", onOver, { passive: true });
    document.addEventListener("mouseleave", onLeave);
    document.addEventListener("mouseenter", onEnter);
    document.addEventListener("visibilitychange", onVisibilityChange);
    return () => {
      document.documentElement.removeAttribute("data-custom-cursor");
      document.removeEventListener("mousemove", onMove);
      document.removeEventListener("mouseover", onOver);
      document.removeEventListener("mouseleave", onLeave);
      document.removeEventListener("mouseenter", onEnter);
      document.removeEventListener("visibilitychange", onVisibilityChange);
      stop();
    };
  }, [hasMouse]);

  return { hasMouse, dotRef, ringRef };
};
