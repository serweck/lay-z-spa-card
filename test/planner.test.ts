import { describe, it, expect } from "vitest";
import { plannerActive, targetSource, targetCall, planView, usageView, maintenanceView, gridExtraW, readyForTarget, plannerToggle, readyTimeView, timeSettingView, settingsSummary, answerView, answerCall } from "../src/planner";
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
  ready_time: "input_datetime.hora",
  answer_script: "script.respuesta",
  ready_until: "input_datetime.fin",
  ready_time_workday: "input_datetime.lab",
  ready_time_holiday: "input_datetime.fest",
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
    "input_datetime.hora": s("20:00:00", { has_date: false, has_time: true }),
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
    expect(planView(base(), cfg)).toEqual({ text: "Precalentando en valle hasta 34 °C", heating: true, grid: true, observing: false, rule: 4, ask: false, kept: false });
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

describe("readyTimeView", () => {
  it("con uso Hoy/Siempre muestra la hora de listo sin segundos", () => {
    expect(readyTimeView(base(), cfg)).toEqual({ entity: "input_datetime.hora", value: "20:00" });
    expect(readyTimeView(base({ "input_datetime.hora": s("14:30:00") }), cfg)?.value).toBe("14:30");
  });
  it("nada con uso No, planificador apagado, sin configurar o sin dato", () => {
    expect(readyTimeView(base({ "input_select.uso": s("No", { options: ["No"] }) }), cfg)).toBeNull();
    expect(readyTimeView(base({ "input_boolean.plan": s("off") }), cfg)).toBeNull();
    expect(readyTimeView(base(), { ...cfg, ready_time: undefined })).toBeNull();
    expect(readyTimeView(base({ "input_datetime.hora": s("unavailable") }), cfg)).toBeNull();
  });
});

describe("settingsSummary", () => {
  it("resume mantenimiento y hora del baño para el bloque plegado", () => {
    expect(settingsSummary({ value: 30 }, { value: "20:00" })).toBe("Mant. 30 °C · Baño 20:00");
  });
  it("con hora de fin, el baño como franja (00:00 = sin fin)", () => {
    expect(settingsSummary({ value: 30 }, { value: "20:00" }, { value: "23:30" })).toBe("Mant. 30 °C · Baño 20:00–23:30");
    expect(settingsSummary({ value: 30 }, { value: "20:00" }, { value: "00:00" })).toBe("Mant. 30 °C · Baño 20:00");
  });
  it("con solo uno, o sin dato", () => {
    expect(settingsSummary({ value: 29.5 }, null)).toBe("Mant. 29,5 °C");
    expect(settingsSummary(null, { value: "14:30" })).toBe("Baño 14:30");
    expect(settingsSummary({ value: null }, null)).toBe("Mant. -- °C");
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

describe("plannerToggle (botón de la cabecera)", () => {
  it("encendido", () => {
    expect(plannerToggle(base(), cfg)).toEqual({ entity: "input_boolean.plan", on: true });
  });
  it("apagado también se muestra, para poder volver a encenderlo", () => {
    expect(plannerToggle(base({ "input_boolean.plan": s("off") }), cfg)).toEqual({ entity: "input_boolean.plan", on: false });
  });
  it("sin la clave o sin dato: no hay botón", () => {
    expect(plannerToggle(base(), { type: "x", climate: "climate.spa" })).toBeNull();
    expect(plannerToggle(base({ "input_boolean.plan": s("unavailable") }), cfg)).toBeNull();
  });
});

describe("answerView (botones de «no llega»)", () => {
  const noLlega = '{"a":"no_calentar","t":30,"r":false,"n":10,"m":"No llega a las 22:00: ¿calentar igualmente?","h":3.8,"l":"","v":false,"i":true}';
  const conScript = (over: States = {}) => base({ "sensor.plan": s(noLlega), "script.respuesta": s("off"), ...over });
  it("con el plan en «no llega» y el script disponible: botones", () => {
    expect(answerView(conScript(), cfg)).toEqual({ script: "script.respuesta", kept: false });
  });
  it("con «mantener» respondido: solo el botón de calentar", () => {
    const kept = '{"a":"no_calentar","t":30,"r":false,"n":10,"m":"Mantenido a 30 °C por hoy (no llega a las 22:00)","h":3,"l":"","v":false,"i":false,"k":true}';
    expect(answerView(conScript({ "sensor.plan": s(kept) }), cfg)).toEqual({ script: "script.respuesta", kept: true });
  });
  it("sin «no llega» no hay botones", () => {
    expect(answerView(base({ "script.respuesta": s("off") }), cfg)).toBeNull();
  });
  it("en modo observar, sin el script o sin la clave: no hay botones", () => {
    expect(answerView(conScript({ "input_boolean.obs": s("on") }), cfg)).toBeNull();
    expect(answerView(base({ "sensor.plan": s(noLlega) }), cfg)).toBeNull();
    expect(answerView(conScript(), { ...cfg, answer_script: undefined })).toBeNull();
  });
  it("con el planificador apagado no hay botones", () => {
    expect(answerView(conScript({ "input_boolean.plan": s("off") }), cfg)).toBeNull();
  });
});

describe("answerCall", () => {
  it("lanza el script con la respuesta y quién responde", () => {
    expect(answerCall("script.respuesta", "jacuzzi_calentar", "Alexis")).toEqual({
      domain: "script",
      service: "turn_on",
      data: { entity_id: "script.respuesta", variables: { respuesta: "jacuzzi_calentar", quien: "Alexis" } },
    });
  });
  it("sin nombre de usuario: Alguien", () => {
    expect(answerCall("script.respuesta", "jacuzzi_mantener", undefined).data.variables.quien).toBe("Alguien");
  });
});

describe("timeSettingView (horas de los ajustes)", () => {
  const con = (over: States = {}) =>
    base({ "input_datetime.fin": s("23:30:00"), "input_datetime.lab": s("20:00:00"), "input_datetime.fest": s("12:00:00"), ...over });
  it("lee cada hora sin segundos", () => {
    expect(timeSettingView(con(), cfg, "ready_until")).toEqual({ entity: "input_datetime.fin", value: "23:30" });
    expect(timeSettingView(con(), cfg, "ready_time_workday")?.value).toBe("20:00");
    expect(timeSettingView(con(), cfg, "ready_time_holiday")?.value).toBe("12:00");
  });
  it("nada con el planificador apagado, sin configurar o sin dato", () => {
    expect(timeSettingView(con({ "input_boolean.plan": s("off") }), cfg, "ready_until")).toBeNull();
    expect(timeSettingView(con(), { ...cfg, ready_until: undefined }, "ready_until")).toBeNull();
    expect(timeSettingView(con({ "input_datetime.fin": s("unknown") }), cfg, "ready_until")).toBeNull();
  });
});
