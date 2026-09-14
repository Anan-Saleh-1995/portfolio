import { cleanup, fireEvent, render } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { HeroCoordinates } from "./HeroCoordinates";
import {
  calculatePointerCoordinates,
  formatHeroCoordinates,
  TOKYO_REFERENCE_COORDINATES,
  TOKYO_REFERENCE_READOUT,
} from "./heroCoordinateMath";

const environment = vi.hoisted(() => ({
  interactiveViewport: true,
  reducedMotion: false,
  mediaQuery: "",
  pageHidden: false,
}));

vi.mock("@/shared/lib/useMediaQuery", () => ({
  useMediaQuery: (query: string) => {
    environment.mediaQuery = query;
    return environment.interactiveViewport;
  },
}));

vi.mock("@/shared/lib/useReducedMotion", () => ({
  useReducedMotion: () => environment.reducedMotion,
}));

const anchor = { left: 100, top: 50, width: 200, height: 40 };
const pendingFrames = new Map<number, FrameRequestCallback>();
let nextFrameId = 0;
let frameTime = 0;

const requestFrame = vi.fn((callback: FrameRequestCallback) => {
  const id = ++nextFrameId;
  pendingFrames.set(id, callback);
  return id;
});

const cancelFrame = vi.fn((id: number) => {
  pendingFrames.delete(id);
});

const advanceFrame = () => {
  frameTime += 16;
  const callbacks = [...pendingFrames.values()];
  pendingFrames.clear();
  callbacks.forEach((callback) => callback(frameTime));
};

const settleFrames = () => {
  let frames = 0;
  while (pendingFrames.size && frames < 120) {
    advanceFrame();
    frames += 1;
  }
  expect(pendingFrames.size).toBe(0);
};

const movePointer = (surface: HTMLElement, x: number, y: number) => {
  fireEvent(
    surface,
    new MouseEvent("pointermove", { bubbles: true, clientX: x, clientY: y }),
  );
};

const renderCoordinates = () => {
  const result = render(
    <section data-hero-coordinate-surface>
      <HeroCoordinates />
    </section>,
  );
  const surface = result.container.querySelector("section");
  const readout = result.container.querySelector<HTMLElement>(
    "[data-coordinate-readout]",
  );
  const root = readout?.closest("p");

  if (!surface || !readout || !root) {
    throw new Error("Coordinate surface was not rendered");
  }

  const measure = vi.spyOn(root, "getBoundingClientRect").mockReturnValue({
    ...anchor,
    right: 300,
    bottom: 90,
    x: 100,
    y: 50,
    toJSON: () => ({}),
  });

  return { ...result, surface, readout, root, measure };
};

describe("hero coordinate helpers", () => {
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
    environment.interactiveViewport = true;
    environment.reducedMotion = false;
    environment.pageHidden = false;
    environment.mediaQuery = "";
    pendingFrames.clear();
    nextFrameId = 0;
    frameTime = 0;
    requestFrame.mockClear();
    cancelFrame.mockClear();
    vi.stubGlobal("requestAnimationFrame", requestFrame);
    vi.stubGlobal("cancelAnimationFrame", cancelFrame);
    vi.stubGlobal("ResizeObserver", undefined);
    vi.spyOn(document, "hidden", "get").mockImplementation(
      () => environment.pageHidden,
    );
  });

  afterEach(() => {
    cleanup();
    vi.unstubAllGlobals();
    vi.restoreAllMocks();
  });

  it("starts idle, eases the visible value, and returns to Tokyo after leaving", () => {
    const { surface, readout, root } = renderCoordinates();

    expect(pendingFrames.size).toBe(0);
    expect(root).toHaveAccessibleName(
      `Tokyo reference coordinates: ${TOKYO_REFERENCE_READOUT}`,
    );
    expect(readout).toHaveAttribute("dir", "ltr");
    expect(readout).toHaveAttribute("translate", "no");

    movePointer(surface, 520, 70);
    advanceFrame();
    expect(readout.textContent).not.toBe(TOKYO_REFERENCE_READOUT);
    expect(readout.textContent).not.toBe("35.6895° N · 139.7007° E");
    settleFrames();
    expect(readout).toHaveTextContent("35.6895° N · 139.7007° E");
    expect(root).toHaveAccessibleName(
      `Tokyo reference coordinates: ${TOKYO_REFERENCE_READOUT}`,
    );

    fireEvent.pointerLeave(surface);
    advanceFrame();
    expect(readout.textContent).not.toBe(TOKYO_REFERENCE_READOUT);
    settleFrames();
    expect(readout).toHaveTextContent(TOKYO_REFERENCE_READOUT);
  });

  it("coalesces a pointer burst into one frame and reuses geometry until it changes", () => {
    const { surface, readout, measure } = renderCoordinates();

    for (let x = 300; x <= 700; x += 10) movePointer(surface, x, 70);

    expect(requestFrame).toHaveBeenCalledTimes(1);
    expect(measure).not.toHaveBeenCalled();
    settleFrames();
    expect(measure).toHaveBeenCalledTimes(1);
    expect(readout).toHaveTextContent(
      formatHeroCoordinates(calculatePointerCoordinates(700, 70, anchor)),
    );

    movePointer(surface, 600, 70);
    settleFrames();
    expect(measure).toHaveBeenCalledTimes(1);

    fireEvent.resize(window);
    expect(pendingFrames.size).toBe(0);
    movePointer(surface, 500, 70);
    settleFrames();
    expect(measure).toHaveBeenCalledTimes(2);
  });

  it.each([
    { interactiveViewport: false, reducedMotion: false },
    { interactiveViewport: true, reducedMotion: true },
  ])(
    "does no pointer work for interactiveViewport=$interactiveViewport and reducedMotion=$reducedMotion",
    ({ interactiveViewport, reducedMotion }) => {
      environment.interactiveViewport = interactiveViewport;
      environment.reducedMotion = reducedMotion;
      const { surface, readout, measure } = renderCoordinates();

      expect(environment.mediaQuery).toBe(
        "(pointer: fine) and (min-width: 80rem) and (min-height: 50rem)",
      );
      movePointer(surface, 520, 70);
      fireEvent.pointerLeave(surface);

      expect(readout).toHaveTextContent(TOKYO_REFERENCE_READOUT);
      expect(requestFrame).not.toHaveBeenCalled();
      expect(measure).not.toHaveBeenCalled();
    },
  );

  it("cancels work while the document is hidden and waits for new input on return", () => {
    const { surface, readout } = renderCoordinates();
    movePointer(surface, 520, 70);
    advanceFrame();

    environment.pageHidden = true;
    fireEvent(document, new Event("visibilitychange"));

    expect(pendingFrames.size).toBe(0);
    expect(readout).toHaveTextContent(TOKYO_REFERENCE_READOUT);
    movePointer(surface, 700, 70);
    expect(pendingFrames.size).toBe(0);

    environment.pageHidden = false;
    fireEvent(document, new Event("visibilitychange"));
    expect(pendingFrames.size).toBe(0);
  });

  it("cancels the pending frame and removes listeners on cleanup", () => {
    const { surface, unmount } = renderCoordinates();
    movePointer(surface, 520, 70);
    expect(pendingFrames.size).toBe(1);

    unmount();

    expect(pendingFrames.size).toBe(0);
    expect(cancelFrame).toHaveBeenCalledTimes(1);
    movePointer(surface, 600, 70);
    expect(requestFrame).toHaveBeenCalledTimes(1);
  });
});
