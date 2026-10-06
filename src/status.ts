import type { LayZSpaCardConfig } from "./types";
import { RCD_POWER_THRESHOLD_W } from "./const";

export interface EntityState {
  state: string;
  attributes: Record<string, unknown>;
}
export type States = Record<string, EntityState | undefined>;

const NO_DATA = new Set(["unavailable", "unknown"]);
/** Un tiempo mayor no es real: la placa lo da al principio, sin historial de calentado. */
const MAX_TIME_TO_READY_H = 96;

export function toNumber(v: unknown): number | null {
  if (v === null || v === undefined || v === "") return null;
  const n = Number(v);
  return Number.isFinite(n) ? n : null;
}

export function isValid(e?: EntityState): e is EntityState {
  return !!e && !NO_DATA.has(e.state);
}

export function numberOf(e?: EntityState): number | null {
  return isValid(e) ? toNumber(e.state) : null;
}

function get(states: States, id?: string): EntityState | undefined {
  return id ? states[id] : undefined;
}

export type Availability = "ok" | "no_power" | "rcd_tripped" | "board_offline";

export function availability(states: States, cfg: LayZSpaCardConfig): Availability {
  if (get(states, cfg.power_switch)?.state === "off") return "no_power";
  const conn = get(states, cfg.connection);
  const connDown = !!cfg.connection && conn?.state !== "on";
  if (connDown) {
    const w = numberOf(get(states, cfg.power));
    return w !== null && w < RCD_POWER_THRESHOLD_W ? "rcd_tripped" : "board_offline";
  }
  return isValid(states[cfg.climate]) ? "ok" : "board_offline";
}

export const AVAILABILITY_TEXT: Record<
  Exclude<Availability, "ok">,
  { icon: string; title: string; detail: string }
> = {
  no_power: {
    icon: "mdi:power-plug-off",
    title: "Sin corriente",
    detail: "Enchufe del jacuzzi apagado",
  },
  rcd_tripped: {
    icon: "mdi:flash-alert",
    title: "Sin corriente en la bomba",
    detail: "Rearma el diferencial del cable del jacuzzi",
  },
  board_offline: {
    icon: "mdi:wifi-off",
    title: "Placa WiFi sin conexión",
    detail: "La bomba tiene corriente pero la placa no responde",
  },
};

export function errorCode(states: States, cfg: LayZSpaCardConfig): string | null {
  const n = numberOf(get(states, cfg.error));
  if (n === null || n === 0) return null;
  return `E${String(Math.trunc(n)).padStart(2, "0")}`;
}

/** Hora a la que estará listo: "a las 21:50" o "mañana a las 05:50". */
export function formatReadyAt(h: number, now: Date): string {
  const at = new Date(now.getTime() + Math.round(h * 60) * 60000);
  const hhmm = `${String(at.getHours()).padStart(2, "0")}:${String(at.getMinutes()).padStart(2, "0")}`;
  return at.toDateString() === now.toDateString() ? `a las ${hhmm}` : `mañana a las ${hhmm}`;
}

export function formatPower(w: number): string {
  return String(Math.round(w)).replace(/\B(?=(\d{3})+(?!\d))/g, ".");
}

export type ReadyView = { kind: "ready" } | { kind: "eta"; text: string } | { kind: "none" };

export function readyView(states: States, cfg: LayZSpaCardConfig, now: Date = new Date()): ReadyView {
  const climate = states[cfg.climate];
  if (!climate || climate.state !== "heat") return { kind: "none" };
  const ready = get(states, cfg.ready);
  if (isValid(ready)) {
    if (ready.state === "on") return { kind: "ready" };
  } else {
    const cur = toNumber(climate.attributes.current_temperature);
    const tgt = toNumber(climate.attributes.temperature);
    if (cur !== null && tgt !== null && cur >= tgt) return { kind: "ready" };
  }
  const h = numberOf(get(states, cfg.time_to_ready));
  if (h === null || h <= 0 || h > MAX_TIME_TO_READY_H) return { kind: "none" };
  return { kind: "eta", text: formatReadyAt(h, now) };
}

export function dialRange(attrs: Record<string, unknown>): { min: number; max: number; step: number } {
  let min = toNumber(attrs.min_temp) ?? 20;
  let max = toNumber(attrs.max_temp) ?? 40;
  if (min >= max) {
    min = 20;
    max = 40;
  }
  const rawStep = toNumber(attrs.target_temp_step);
  const step = rawStep !== null && rawStep > 0 ? rawStep : 1;
  return { min, max, step };
}

/** Objetivo enviado a HA que aun no ha vuelto confirmado por MQTT. */
export interface PendingTarget {
  value: number;
  at: number;
}
export const PENDING_TIMEOUT_MS = 10000;

/** Valor pendiente que debe mostrarse y usarse como base de −/+, o null si ya no aplica
 *  (HA lo confirmo o caduco). Evita perder pulsaciones rapidas y el salto atras al soltar. */
export function pendingTarget(p: PendingTarget | null, actual: number | null, now: number): number | null {
  if (!p) return null;
  if (actual !== null && actual === p.value) return null;
  if (now - p.at > PENDING_TIMEOUT_MS) return null;
  return p.value;
}

/** Objetivo a mostrar: el que se arrastra, el pendiente de confirmar o el real. null = sin dato. */
export function displayTarget(drag: number | null, pending: number | null, actual: number | null): number | null {
  return drag ?? pending ?? actual;
}

/** Valor que hay que enviar al soltar el arrastre, o null si no hay que enviar nada. */
export function dragResult(drag: number | null, shown: number | null, available: boolean): number | null {
  if (!available || drag === null || drag === shown) return null;
  return drag;
}

/** Temperatura con un decimal y coma, sin ",0" (23,5 · 27). */
export function formatTemp(v: number): string {
  const r = Math.round(v * 10) / 10;
  return (Number.isInteger(r) ? String(r) : r.toFixed(1)).replace(".", ",");
}

export type BubblesState = "none" | "on" | "off" | "unavailable";

export function bubblesState(states: States, cfg: LayZSpaCardConfig): BubblesState {
  if (!cfg.bubbles) return "none";
  const e = states[cfg.bubbles];
  if (!isValid(e)) return "unavailable";
  return e.state === "on" ? "on" : "off";
}
