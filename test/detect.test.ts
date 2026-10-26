import { describe, it, expect } from "vitest";
import { detectEntities } from "../src/detect";
import { DEFAULT_ENTITIES, DEFAULT_SCHEDULE_DAYS, DEFAULT_SCHEDULE_TIMES } from "../src/const";

describe("detectEntities", () => {
  it("pone todas las entidades por defecto que existen", () => {
    expect(detectEntities(Object.values(DEFAULT_ENTITIES))).toEqual(DEFAULT_ENTITIES);
  });
  it("omite las que no existen", () => {
    const r = detectEntities([DEFAULT_ENTITIES.climate, DEFAULT_ENTITIES.bubbles]);
    expect(r).toEqual({ climate: DEFAULT_ENTITIES.climate, bubbles: DEFAULT_ENTITIES.bubbles });
  });
  it("busca otro climate layzspa si el de por defecto no existe", () => {
    expect(detectEntities(["climate.salon", "climate.layzspa_otro"]).climate).toBe(
      "climate.layzspa_otro"
    );
  });
  it("sin nada, deja el climate por defecto para que el usuario lo vea y lo cambie", () => {
    expect(detectEntities([])).toEqual({ climate: DEFAULT_ENTITIES.climate });
  });
  it("pone el horario semanal si existen sus 16 ayudantes", () => {
    const r = detectEntities([DEFAULT_ENTITIES.climate, ...DEFAULT_SCHEDULE_DAYS, ...DEFAULT_SCHEDULE_TIMES]);
    expect(r.schedule_days).toEqual(DEFAULT_SCHEDULE_DAYS);
    expect(r.schedule_times).toEqual(DEFAULT_SCHEDULE_TIMES);
  });
  it("sin el horario completo no lo pone", () => {
    const r = detectEntities([DEFAULT_ENTITIES.climate, ...DEFAULT_SCHEDULE_DAYS.slice(0, 7), ...DEFAULT_SCHEDULE_TIMES]);
    expect(r.schedule_days).toBeUndefined();
    expect(r.schedule_times).toBeUndefined();
  });
});
