import { DEFAULT_ENTITIES, DEFAULT_SCHEDULE_DAYS, DEFAULT_SCHEDULE_TIMES } from "./const";
import type { EntityKey, LayZSpaCardConfig } from "./types";

export function detectEntities(
  entityIds: string[]
): Partial<LayZSpaCardConfig> & { climate: string } {
  const present = new Set(entityIds);
  const out: Partial<Record<EntityKey, string>> = {};
  for (const [key, id] of Object.entries(DEFAULT_ENTITIES) as [EntityKey, string][]) {
    if (present.has(id)) out[key] = id;
  }
  const climate =
    out.climate ??
    entityIds.find((id) => id.startsWith("climate.") && id.includes("layzspa")) ??
    DEFAULT_ENTITIES.climate;
  // El horario va entero o no va: las filas se emparejan por posición (L…D, Festivo)
  const schedule = [...DEFAULT_SCHEDULE_DAYS, ...DEFAULT_SCHEDULE_TIMES].every((id) => present.has(id))
    ? { schedule_days: DEFAULT_SCHEDULE_DAYS, schedule_times: DEFAULT_SCHEDULE_TIMES }
    : {};
  return { ...out, ...schedule, climate };
}
