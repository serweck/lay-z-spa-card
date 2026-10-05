export const ARC_START = 210;
export const ARC_END = 510; // hueco de 60° centrado abajo
export const ARC_SWEEP = ARC_END - ARC_START;
export const ARC_R = 80;
export const ARC_W = 18;
/** Final del arco en 0..360 (510 - 360). */
const ARC_END_WRAPPED = ARC_END - 360;
/** Margen angular para agarrar la bolita. */
const GRAB_DEG = 22;

export function polarToCartesian(cx: number, cy: number, r: number, angleDeg: number) {
  const a = ((angleDeg - 90) * Math.PI) / 180;
  return { x: cx + r * Math.cos(a), y: cy + r * Math.sin(a) };
}

export function arcPath(cx: number, cy: number, r: number, startAngle: number, endAngle: number): string {
  const start = polarToCartesian(cx, cy, r, endAngle);
  const end = polarToCartesian(cx, cy, r, startAngle);
  const largeArc = endAngle - startAngle <= 180 ? "0" : "1";
  return `M ${start.x} ${start.y} A ${r} ${r} 0 ${largeArc} 0 ${end.x} ${end.y}`;
}

export function clampTarget(v: number, min: number, max: number, step: number): number {
  const rounded = Math.round(v / step) * step;
  return Number(Math.min(max, Math.max(min, rounded)).toFixed(2));
}

export function angleOfValue(v: number, min: number, max: number): number {
  const frac = Math.min(1, Math.max(0, (v - min) / (max - min)));
  return ARC_START + frac * ARC_SWEEP;
}

export function fracFromAngle(angle: number): number {
  let frac: number;
  if (angle >= ARC_START) {
    frac = (angle - ARC_START) / ARC_SWEEP;
  } else if (angle <= ARC_END_WRAPPED) {
    frac = (angle + 360 - ARC_START) / ARC_SWEEP;
  } else {
    // zona muerta inferior: al extremo mas cercano
    frac = angle - ARC_END_WRAPPED < ARC_START - angle ? 1 : 0;
  }
  return Math.min(1, Math.max(0, frac));
}

export function valueFromAngle(angle: number, min: number, max: number, step: number): number {
  return clampTarget(min + fracFromAngle(angle) * (max - min), min, max, step);
}

/** Angulo del puntero respecto al centro: 0 = arriba, sentido horario, 0..360. */
export function pointerAngle(dx: number, dy: number): number {
  let ang = (Math.atan2(dy, dx) * 180) / Math.PI + 90;
  if (ang < 0) ang += 360;
  return ang;
}

/** Hit-test geometrico (no getBoundingClientRect de la bolita: en WebViews de movil el
 *  drop-shadow infla su caja). dx/dy en px desde el centro; scale = px por unidad del viewBox. */
export function isNearHandle(dx: number, dy: number, scale: number, handleAngle: number): boolean {
  const dist = Math.hypot(dx, dy);
  if (Math.abs(dist - ARC_R * scale) > (ARC_W / 2 + 12) * scale) return false;
  let diff = Math.abs(pointerAngle(dx, dy) - handleAngle);
  if (diff > 180) diff = 360 - diff;
  return diff <= GRAB_DEG;
}
