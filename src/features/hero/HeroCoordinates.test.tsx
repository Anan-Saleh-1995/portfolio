import { fireEvent, render } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { HeroCoordinates } from "./HeroCoordinates";
import {
  calculatePointerCoordinates,
  formatHeroCoordinates,
  TOKYO_REFERENCE_COORDINATES,
  TOKYO_REFERENCE_READOUT,
  type HeroCoordinatePair,
} from "./heroCoordinateMath";

const environment = vi.hoisted(() => ({
  finePointer: true,
  reducedMotion: false,
}));

const gsapMock = vi.hoisted(() => ({
  kill: vi.fn(),
  to: vi.fn(),
}));

vi.mock("@/shared/lib/useMediaQuery", () => ({
  useMediaQuery: () => environment.finePointer,
}));

vi.mock("@/shared/lib/useReducedMotion", () => ({
  useReducedMotion: () => environment.reducedMotion,
}));

vi.mock("gsap", () => ({
  default: {
    to: gsapMock.to,
  },
}));

const renderCoordinates = () =>
  render(
    <section data-hero-coordinate-surface>
      <HeroCoordinates />
    </section>,
  );

const getReadout = (container: HTMLElement) => {
  const readout = container.querySelector<HTMLElement>(
    "[data-coordinate-readout]",
  );

  if (!readout) throw new Error("Coordinate readout was not rendered");
  return readout;
};

describe("hero coordinate helpers", () => {
  const anchor = { left: 100, top: 50, width: 200, height: 40 };

  it("keeps Tokyo at the center of the readout", () => {
    expect(calculatePointerCoordinates(200, 70, anchor)).toEqual(
      TOKYO_REFERENCE_COORDINATES,
    );
  });

  it("maps pointer direction and distance to a bounded coordinate offset", () => {
    const halfwayEast = calculatePointerCoordinates(520, 70, anchor);
    const farEast = calculatePointerCoordinates(2000, 70, anchor);

    expect(halfwayEast.latitude).toBeCloseTo(
      TOKYO_REFERENCE_COORDINATES.latitude,
    );
    expect(halfwayEast.longitude).toBeCloseTo(139.7007, 4);
    expect(farEast.longitude).toBeCloseTo(139.7097, 4);
  });

  it("formats hemispheres and fixed precision predictably", () => {
    expect(formatHeroCoordinates({ latitude: -12.5, longitude: -45.25 })).toBe(
      "12.5000° S · 45.2500° W",
    );
    expect(TOKYO_REFERENCE_READOUT).toBe("35.6895° N · 139.6917° E");
  });
});

describe("HeroCoordinates", () => {
  beforeEach(() => {
    environment.finePointer = true;
    environment.reducedMotion = false;
    gsapMock.kill.mockReset();
    gsapMock.to.mockReset();
    gsapMock.to.mockImplementation(
      (target: HeroCoordinatePair, vars: Record<string, unknown>) => {
        target.latitude = vars.latitude as number;
        target.longitude = vars.longitude as number;
        (vars.onUpdate as (() => void) | undefined)?.();
        return { kill: gsapMock.kill };
      },
    );
  });

  it("keeps the accessible Tokyo value static while the visible LTR readout responds and restores", () => {
    const { container } = renderCoordinates();
    const surface = container.querySelector("section");
    const readout = getReadout(container);
    const root = readout.closest("p");

    if (!surface || !root)
      throw new Error("Coordinate surface was not rendered");

    vi.spyOn(root, "getBoundingClientRect").mockReturnValue({
      left: 100,
      top: 50,
      width: 200,
      height: 40,
      right: 300,
      bottom: 90,
      x: 100,
      y: 50,
      toJSON: () => ({}),
    });

    expect(root).toHaveAccessibleName(
      `Tokyo reference coordinates: ${TOKYO_REFERENCE_READOUT}`,
    );
    expect(readout).toHaveAttribute("dir", "ltr");
    expect(readout).toHaveAttribute("translate", "no");

    fireEvent.pointerMove(surface, { clientX: 520, clientY: 70 });

    expect(readout).toHaveTextContent("35.6895° N · 139.7007° E");
    expect(root).toHaveAccessibleName(
      `Tokyo reference coordinates: ${TOKYO_REFERENCE_READOUT}`,
    );

    fireEvent.pointerLeave(surface);

    expect(readout).toHaveTextContent(TOKYO_REFERENCE_READOUT);
  });

  it.each([
    { finePointer: false, reducedMotion: false },
    { finePointer: true, reducedMotion: true },
  ])(
    "stays static for finePointer=$finePointer and reducedMotion=$reducedMotion",
    ({ finePointer, reducedMotion }) => {
      environment.finePointer = finePointer;
      environment.reducedMotion = reducedMotion;
      const { container } = renderCoordinates();
      const surface = container.querySelector("section");

      if (!surface) throw new Error("Coordinate surface was not rendered");

      fireEvent.pointerMove(surface, { clientX: 520, clientY: 70 });

      expect(getReadout(container)).toHaveTextContent(TOKYO_REFERENCE_READOUT);
      expect(gsapMock.to).not.toHaveBeenCalled();
    },
  );

  it("removes interaction listeners and kills the active tween on cleanup", () => {
    const { container, unmount } = renderCoordinates();
    const surface = container.querySelector("section");
    const readout = getReadout(container);
    const root = readout.closest("p");

    if (!surface || !root)
      throw new Error("Coordinate surface was not rendered");

    vi.spyOn(root, "getBoundingClientRect").mockReturnValue({
      left: 100,
      top: 50,
      width: 200,
      height: 40,
      right: 300,
      bottom: 90,
      x: 100,
      y: 50,
      toJSON: () => ({}),
    });

    fireEvent.pointerMove(surface, { clientX: 520, clientY: 70 });
    expect(gsapMock.to).toHaveBeenCalledTimes(1);

    unmount();

    expect(gsapMock.kill).toHaveBeenCalledTimes(1);
    fireEvent.pointerMove(surface, { clientX: 600, clientY: 70 });
    expect(gsapMock.to).toHaveBeenCalledTimes(1);
  });
});
