import { DEFAULT_ENTITIES } from "./const";
import type { EntityKey } from "./types";

export function detectEntities(
  entityIds: string[]
): Partial<Record<EntityKey, string>> & { climate: string } {
  const present = new Set(entityIds);
  const out: Partial<Record<EntityKey, string>> = {};
  for (const [key, id] of Object.entries(DEFAULT_ENTITIES) as [EntityKey, string][]) {
    if (present.has(id)) out[key] = id;
  }
  const climate =
    out.climate ??
    entityIds.find((id) => id.startsWith("climate.") && id.includes("layzspa")) ??
    DEFAULT_ENTITIES.climate;
  return { ...out, climate };
}
