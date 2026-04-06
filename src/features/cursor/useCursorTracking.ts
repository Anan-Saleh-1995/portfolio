import { useEffect, useRef } from "react";
import { useMediaQuery } from "@/shared/lib/useMediaQuery";
import styles from "./Cursor.module.css";

const LERP_FACTOR = 0.1;
const OFFSCREEN = -200;

const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

export const useCursorTracking = () => {
  const hasMouse = useMediaQuery("(hover: hover) and (pointer: fine)");
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const pos = useRef({ x: OFFSCREEN, y: OFFSCREEN });
  const smoothed = useRef({ x: OFFSCREEN, y: OFFSCREEN });
  const rafRef = useRef(0);

  useEffect(() => {
    if (!hasMouse) return;

    document.documentElement.setAttribute("data-custom-cursor", "");

    const onMove = (e: MouseEvent) => {
      pos.current = { x: e.clientX, y: e.clientY };
    };

    const onOver = (e: MouseEvent) => {
      const target = e.target as Element;
      const overNativeControl = target.closest("input, textarea, select");

      if (overNativeControl) {
        if (dotRef.current) dotRef.current.style.opacity = "0";
        if (ringRef.current) ringRef.current.style.opacity = "0";
        ringRef.current?.classList.remove(styles.active);
        return;
      }

      if (dotRef.current) dotRef.current.style.opacity = "1";
      if (ringRef.current) ringRef.current.style.opacity = "1";

      if (target.closest("a, button")) {
        ringRef.current?.classList.add(styles.active);
      } else {
        ringRef.current?.classList.remove(styles.active);
      }
    };

    const onLeave = () => {
      if (dotRef.current) dotRef.current.style.opacity = "0";
      if (ringRef.current) ringRef.current.style.opacity = "0";
    };

    const onEnter = () => {
      if (dotRef.current) dotRef.current.style.opacity = "1";
      if (ringRef.current) ringRef.current.style.opacity = "1";
    };

    document.addEventListener("mousemove", onMove);
    document.addEventListener("mouseover", onOver);
    document.addEventListener("mouseleave", onLeave);
    document.addEventListener("mouseenter", onEnter);

    const tick = () => {
      smoothed.current.x = lerp(smoothed.current.x, pos.current.x, LERP_FACTOR);
      smoothed.current.y = lerp(smoothed.current.y, pos.current.y, LERP_FACTOR);

      if (dotRef.current) {
        dotRef.current.style.transform = `translate(${pos.current.x}px, ${pos.current.y}px)`;
      }
      if (ringRef.current) {
        ringRef.current.style.transform = `translate(${smoothed.current.x}px, ${smoothed.current.y}px)`;
      }

      rafRef.current = requestAnimationFrame(tick);
    };

    rafRef.current = requestAnimationFrame(tick);

    return () => {
      document.documentElement.removeAttribute("data-custom-cursor");
      document.removeEventListener("mousemove", onMove);
      document.removeEventListener("mouseover", onOver);
      document.removeEventListener("mouseleave", onLeave);
      document.removeEventListener("mouseenter", onEnter);
      cancelAnimationFrame(rafRef.current);
    };
  }, [hasMouse]);

  return { hasMouse, dotRef, ringRef };
};
