import { describe, it, expect } from "vitest";
import { plannerActive, targetSource, targetCall, planView, usageView, maintenanceView, gridExtraW, readyForTarget } from "../src/planner";
import type { States } from "../src/status";
import type { LayZSpaCardConfig } from "../src/types";

const cfg: LayZSpaCardConfig = {
  type: "custom:lay-z-spa-card",
  climate: "climate.spa",
  usage: "input_select.uso",
  desired: "input_number.deseada",
  maintenance: "input_number.mant",
  plan: "sensor.plan",
  planner: "input_boolean.plan",
  observe: "input_boolean.obs",
  grid_extra: "sensor.extra",
};
const s = (state: string, attributes: Record<string, unknown> = {}) => ({ state, attributes });
const num = (v: string) => s(v, { min: 20, max: 40, step: 1 });
function base(over: States = {}): States {
  return {
    "climate.spa": s("heat", { temperature: 38, current_temperature: 30, min_temp: 20, max_temp: 40, target_temp_step: 1 }),
    "input_select.uso": s("Hoy", { options: ["No", "Hoy", "Siempre"] }),
    "input_number.deseada": num("37.0"),
    "input_number.mant": num("30.0"),
    "input_boolean.plan": s("on"),
    "input_boolean.obs": s("off"),
    "sensor.plan": s('{"a":"calentar","t":37,"r":true,"n":4,"m":"Precalentando en valle hasta 34 °C","h":2.3,"l":"05:12","v":true}'),
    "sensor.extra": s("1950"),
    ...over,
  };
}

describe("plannerActive / targetSource", () => {
  it("con planificador encendido y uso Hoy, el dial edita la deseada", () => {
    expect(plannerActive(base(), cfg)).toBe(true);
    expect(targetSource(base(), cfg)).toEqual({ kind: "helper", entity: "input_number.deseada", value: 37, min: 20, max: 40, step: 1, caption: "deseada" });
  });
  it("con uso Siempre también la deseada", () => {
    expect(targetSource(base({ "input_select.uso": s("Siempre", { options: ["No", "Hoy", "Siempre"] }) }), cfg).entity).toBe("input_number.deseada");
  });
  it("con uso No, el mantenimiento", () => {
    const t = targetSource(base({ "input_select.uso": s("No", { options: ["No", "Hoy", "Siempre"] }) }), cfg);
    expect(t).toMatchObject({ kind: "helper", entity: "input_number.mant", value: 30, caption: "mantenimiento" });
  });
  it("planificador apagado: el climate, como en la 0.1.1", () => {
    const st = base({ "input_boolean.plan": s("off") });
    expect(plannerActive(st, cfg)).toBe(false);
    expect(targetSource(st, cfg)).toEqual({ kind: "climate", entity: "climate.spa", value: 38, min: 20, max: 40, step: 1, caption: null });
  });
  it("sin claves del planificador: el climate", () => {
    const c: LayZSpaCardConfig = { type: "x", climate: "climate.spa" };
    expect(plannerActive(base(), c)).toBe(false);
    expect(targetSource(base(), c).kind).toBe("climate");
  });
  it("helper sin dato o con límites raros: valor null y rango por defecto", () => {
    const t = targetSource(base({ "input_number.deseada": s("unavailable", { min: 40, max: 20 }) }), cfg);
    expect(t).toMatchObject({ kind: "helper", value: null, min: 20, max: 40, step: 1 });
  });
});

describe("targetCall", () => {
  it("helper → input_number.set_value", () => {
    expect(targetCall(targetSource(base(), cfg), 36)).toEqual({ domain: "input_number", service: "set_value", data: { entity_id: "input_number.deseada", value: 36 } });
  });
  it("climate → climate.set_temperature", () => {
    const t = targetSource(base({ "input_boolean.plan": s("off") }), cfg);
    expect(targetCall(t, 39)).toEqual({ domain: "climate", service: "set_temperature", data: { entity_id: "climate.spa", temperature: 39 } });
  });
});

describe("planView", () => {
  it("lee el JSON del plan", () => {
    expect(planView(base(), cfg)).toEqual({ text: "Precalentando en valle hasta 34 °C", heating: true, grid: true, observing: false, rule: 4 });
  });
  it("marca el modo observar", () => {
    expect(planView(base({ "input_boolean.obs": s("on") }), cfg)?.observing).toBe(true);
  });
  it("sin JSON (arranque) o sin entidad: null", () => {
    expect(planView(base({ "sensor.plan": s("unknown") }), cfg)).toBeNull();
    expect(planView(base({ "sensor.plan": s("{roto") }), cfg)).toBeNull();
    expect(planView(base(), { type: "x", climate: "climate.spa" })).toBeNull();
  });
  it("con el planificador apagado no hay línea de plan", () => {
    expect(planView(base({ "input_boolean.plan": s("off") }), cfg)).toBeNull();
  });
});

describe("usageView", () => {
  it("opciones reales del input_select", () => {
    expect(usageView(base({ "input_select.uso": s("Fin de semana", { options: ["No", "Fin de semana"] }) }), cfg)).toEqual({ current: "Fin de semana", options: ["No", "Fin de semana"] });
  });
  it("con el planificador apagado no hay selector (como la 0.1.1)", () => {
    expect(usageView(base({ "input_boolean.plan": s("off") }), cfg)).toBeNull();
  });
  it("sin entidad o sin dato: null", () => {
    expect(usageView(base(), { type: "x", climate: "climate.spa" })).toBeNull();
    expect(usageView(base({ "input_select.uso": s("unavailable") }), cfg)).toBeNull();
  });
});

describe("maintenanceView", () => {
  it("con uso Hoy/Siempre se muestra aparte para poder editarlo", () => {
    expect(maintenanceView(base(), cfg)).toEqual({ entity: "input_number.mant", value: 30, min: 20, max: 40, step: 1 });
  });
  it("con uso No no (ya lo edita el dial) ni con el planificador apagado", () => {
    expect(maintenanceView(base({ "input_select.uso": s("No", { options: ["No"] }) }), cfg)).toBeNull();
    expect(maintenanceView(base({ "input_boolean.plan": s("off") }), cfg)).toBeNull();
  });
});

describe("gridExtraW", () => {
  it("solo si es mayor que 0", () => {
    expect(gridExtraW(base(), cfg)).toBe(1950);
    expect(gridExtraW(base({ "sensor.extra": s("0") }), cfg)).toBeNull();
    expect(gridExtraW(base({ "sensor.extra": s("unavailable") }), cfg)).toBeNull();
  });
});

describe("readyForTarget (revisión: 'Listo' con el planificador)", () => {
  const helper = { kind: "helper" as const, entity: "input_number.deseada", value: 37, min: 20, max: 40, step: 1, caption: "deseada" };
  it("la placa está lista a 34 (valle) pero la deseada es 37: no decir 'Listo'", () => {
    expect(readyForTarget({ kind: "ready" }, helper, 34)).toEqual({ kind: "none" });
  });
  it("con el agua en la deseada, 'Listo'", () => {
    expect(readyForTarget({ kind: "ready" }, helper, 37)).toEqual({ kind: "ready" });
  });
  it("sin dato de agua o de deseada, no afirmar 'Listo'", () => {
    expect(readyForTarget({ kind: "ready" }, helper, null)).toEqual({ kind: "none" });
    expect(readyForTarget({ kind: "ready" }, { ...helper, value: null }, 37)).toEqual({ kind: "none" });
  });
  it("con el climate (planificador apagado) no cambia nada, ni el 'Listo en'", () => {
    const climate = { ...helper, kind: "climate" as const, caption: null };
    expect(readyForTarget({ kind: "ready" }, climate, 34)).toEqual({ kind: "ready" });
    expect(readyForTarget({ kind: "eta", text: "2 h" }, helper, 30)).toEqual({ kind: "eta", text: "2 h" });
  });
});
