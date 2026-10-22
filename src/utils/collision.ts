import type { MapId } from '../types/game';

type Rect = { left: number; right: number; top: number; bottom: number };

// Coordinates are percentages of the map stage. These rectangles cover solid
// building footprints, not the clickable interaction zones.
const SOLID_AREAS: Partial<Record<MapId, Rect[]>> = {
  taman_kota: [
    { left: 7, right: 31, top: 9, bottom: 37 }, // Warung kopi
    { left: 33, right: 61, top: 5, bottom: 30 }, // Butik / salon
  ],
};

const inside = (x: number, y: number, r: Rect, padding = 2.5) =>
  x >= r.left - padding &&
  x <= r.right + padding &&
  y >= r.top - padding &&
  y <= r.bottom + padding;

/** Keep a character's feet outside solid building footprints. */
export function resolveWalkPosition(
  map: MapId,
  x: number,
  y: number,
  currentX: number,
  currentY: number,
): { x: number; y: number } {
  const safeX = Math.max(5, Math.min(95, x));
  const safeY = Math.max(18, Math.min(90, y));
  const areas = SOLID_AREAS[map] ?? [];
  if (!areas.some((r) => inside(safeX, safeY, r))) {
    return { x: safeX, y: safeY };
  }

  // Pick the closest reachable edge of the building instead of allowing
  // the character to appear inside it.
  const candidates = areas
    .filter((r) => inside(safeX, safeY, r))
    .flatMap((r) => {
      const pad = 3.5;
      return [
        { x: r.left - pad, y: safeY },
        { x: r.right + pad, y: safeY },
        { x: safeX, y: r.top - pad },
        { x: safeX, y: r.bottom + pad },
      ];
    })
    .map((p) => ({
      x: Math.max(5, Math.min(95, p.x)),
      y: Math.max(18, Math.min(90, p.y)),
    }))
    .filter((p) => !areas.some((r) => inside(p.x, p.y, r, 0.4)))
    .sort((a, b) => {
      const da = Math.hypot(a.x - safeX, a.y - safeY) +
        Math.hypot(a.x - currentX, a.y - currentY) * 0.01;
      const db = Math.hypot(b.x - safeX, b.y - safeY) +
        Math.hypot(b.x - currentX, b.y - currentY) * 0.01;
      return da - db;
    });

  return candidates[0] ?? { x: currentX, y: currentY };
}
