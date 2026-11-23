import { describe, it, expect } from "vitest";
import { careView, careResetCall, formatDays } from "../src/care";
import type { States } from "../src/status";
import type { LayZSpaCardConfig } from "../src/types";

const cfg: LayZSpaCardConfig = {
  type: "custom:lay-z-spa-card",
  climate: "climate.spa",
  chlorine_age: "sensor.cloro",
  chlorine_interval: "number.cloro_int",
  chlorine_reset: "button.cloro_reset",
  filter_rinse_age: "sensor.aclarado",
  filter_rinse_interval: "number.aclarado_int",
  filter_rinse_reset: "button.aclarado_reset",
  filter_clean_age: "sensor.limpieza",
  filter_clean_interval: "number.limpieza_int",
  filter_clean_reset: "button.limpieza_reset",
  filter_change_age: "sensor.cambio",
  filter_change_interval: "number.cambio_int",
  filter_change_reset: "button.cambio_reset",
};
const s = (state: string) => ({ state, attributes: {} });
function base(over: States = {}): States {
  return {
    "sensor.cloro": s("30.51"),
    "number.cloro_int": s("7"),
    "sensor.aclarado": s("3.2"),
    "number.aclarado_int": s("7"),
    "sensor.limpieza": s("20"),
    "number.limpieza_int": s("20"),
    "sensor.cambio": s("30.51"),
    "number.cambio_int": s("60"),
    ...over,
  };
}

describe("careView", () => {
  it("solo las tareas cuyos días llegan al intervalo, en orden fijo", () => {
    const v = careView(base(), cfg);
    expect(v.map((t) => t.key)).toEqual(["chlorine", "filter_clean"]);
    expect(v[0]).toMatchObject({ label: "Cloro", age: 30.51, interval: 7, age_entity: "sensor.cloro", reset: "button.cloro_reset" });
  });
  it("intervalo 0 o sin datos: no avisa", () => {
    const v = careView(base({ "number.cloro_int": s("0"), "sensor.limpieza": s("unavailable") }), cfg);
    expect(v).toEqual([]);
  });
  it("sin claves configuradas: nada", () => {
    expect(careView(base(), { type: "x", climate: "climate.spa" })).toEqual([]);
  });
  it("sin botón de reinicio sigue avisando, con reset null", () => {
    const v = careView(base(), { ...cfg, chlorine_reset: undefined });
    expect(v[0]).toMatchObject({ key: "chlorine", reset: null });
  });
});

describe("careResetCall / formatDays", () => {
  it("pulsa el botón", () => {
    expect(careResetCall("button.cloro_reset")).toEqual({ domain: "button", service: "press", data: { entity_id: "button.cloro_reset" } });
    expect(careResetCall("script.cloro")).toEqual({ domain: "script", service: "turn_on", data: { entity_id: "script.cloro" } });
  });
  it("días enteros, con singular", () => {
    expect(formatDays(30.51)).toBe("30 días");
    expect(formatDays(1.2)).toBe("1 día");
    expect(formatDays(0.4)).toBe("0 días");
  });
});
