export interface HeroCoordinatePair {
  latitude: number;
  longitude: number;
}

export interface CoordinateAnchorRect {
  left: number;
  top: number;
  width: number;
  height: number;
}

export const TOKYO_REFERENCE_COORDINATES = Object.freeze({
  latitude: 35.6895,
  longitude: 139.6917,
});

const POINTER_INFLUENCE_DISTANCE = 640;
const MAX_COORDINATE_DELTA = 0.018;

const formatAxis = (
  value: number,
  positiveHemisphere: string,
  negativeHemisphere: string,
) =>
  `${Math.abs(value).toFixed(4)}° ${value >= 0 ? positiveHemisphere : negativeHemisphere}`;

export const formatHeroCoordinates = ({
  latitude,
  longitude,
}: HeroCoordinatePair) =>
  `${formatAxis(latitude, "N", "S")} · ${formatAxis(longitude, "E", "W")}`;

export const TOKYO_REFERENCE_READOUT = formatHeroCoordinates(
  TOKYO_REFERENCE_COORDINATES,
);

export const calculatePointerCoordinates = (
  pointerX: number,
  pointerY: number,
  anchor: CoordinateAnchorRect,
): HeroCoordinatePair => {
  const centerX = anchor.left + anchor.width / 2;
  const centerY = anchor.top + anchor.height / 2;
  const deltaX = pointerX - centerX;
  const deltaY = pointerY - centerY;
  const distance = Math.hypot(deltaX, deltaY);

  if (!Number.isFinite(distance) || distance === 0) {
    return { ...TOKYO_REFERENCE_COORDINATES };
  }

  const influence = Math.min(distance / POINTER_INFLUENCE_DISTANCE, 1);
  const coordinateDelta = influence * MAX_COORDINATE_DELTA;
  const unitX = deltaX / distance;
  const unitY = deltaY / distance;

  return {
    latitude: TOKYO_REFERENCE_COORDINATES.latitude - unitY * coordinateDelta,
    longitude: TOKYO_REFERENCE_COORDINATES.longitude + unitX * coordinateDelta,
  };
};
