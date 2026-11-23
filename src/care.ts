import type { LayZSpaCardConfig } from "./types";
import { numberOf, type States } from "./status";

/** Mantenimientos que cuenta la placa (firmware visualapproach): días desde el último y cada cuántos toca. */
export type CareKey = "chlorine" | "filter_rinse" | "filter_clean" | "filter_change";

export const CARE_META: Record<CareKey, { label: string; icon: string; action: string }> = {
  chlorine: { label: "Cloro", icon: "mdi:flask-outline", action: "Echar cloro" },
  filter_rinse: { label: "Aclarado", icon: "mdi:water-sync", action: "Aclarar el filtro" },
  filter_clean: { label: "Limpieza", icon: "mdi:spray-bottle", action: "Limpiar el filtro" },
  filter_change: { label: "Filtro", icon: "mdi:filter-remove", action: "Cambiar el filtro" },
};
/** Orden fijo: cada tarea tiene su esquina del dial (sup. izq., sup. der., inf. izq., inf. der.). */
export const CARE_KEYS: CareKey[] = ["chlorine", "filter_rinse", "filter_clean", "filter_change"];

export type CareTask = {
  key: CareKey;
  label: string;
  icon: string;
  action: string;
  age: number;
  interval: number;
  age_entity: string;
  reset: string | null;
};

/** Tareas vencidas: días desde el último ≥ intervalo (intervalo 0 = desactivado). */
export function careView(states: States, cfg: LayZSpaCardConfig): CareTask[] {
  const out: CareTask[] = [];
  for (const key of CARE_KEYS) {
    const ageEntity = cfg[`${key}_age`];
    const intervalEntity = cfg[`${key}_interval`];
    if (!ageEntity || !intervalEntity) continue;
    const age = numberOf(states[ageEntity]);
    const interval = numberOf(states[intervalEntity]);
    if (age === null || interval === null || interval <= 0 || age < interval) continue;
    out.push({ key, ...CARE_META[key], age, interval, age_entity: ageEntity, reset: cfg[`${key}_reset`] ?? null });
  }
  return out;
}

/** button → press; script → turn_on (por si el reinicio es un script propio). */
export function careResetCall(entity: string) {
  const domain = entity.split(".")[0];
  return { domain, service: domain === "script" ? "turn_on" : "press", data: { entity_id: entity } };
}

export function formatDays(days: number): string {
  const n = Math.floor(days);
  return `${n} ${n === 1 ? "día" : "días"}`;
}
