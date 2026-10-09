import { describe, it, expect } from "vitest";
import { plannerActive, targetSource, targetCall, planView, usageView, maintenanceView, gridExtraW, readyForTarget, plannerToggle, readyTimeView, timeSettingView, settingsSummary, answerView, answerCall, skipTodayView, skipTodayCall, filterView, formatHours, finishedView } from "../src/planner";
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
  skip_today: "input_boolean.hoy_no",
  filter_min: "input_number.dep_min",
  filter_today: "sensor.dep_hoy",
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
    expect(planView(base(), cfg)).toEqual({ text: "Precalentando en valle hasta 34 °C", heating: true, filtering: false, grid: true, observing: false, rule: 4, ask: false, kept: false, forced: false });
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
    expect(answerView(conScript(), cfg)).toEqual({ script: "script.respuesta", mode: "ask" });
  });
  it("con «mantener» respondido: solo el botón de calentar", () => {
    const kept = '{"a":"no_calentar","t":30,"r":false,"n":10,"m":"Mantenido a 30 °C por hoy (no llega a las 22:00)","h":3,"l":"","v":false,"i":false,"k":true}';
    expect(answerView(conScript({ "sensor.plan": s(kept) }), cfg)).toEqual({ script: "script.respuesta", mode: "kept" });
  });
  it("calentando igualmente: solo el botón de mantener, para volver atrás", () => {
    const forced = '{"a":"calentar","t":37,"r":false,"n":6,"m":"Calentando igualmente: listo a las 23:31","h":3,"l":"23:31","v":false,"i":false,"k":false,"c":true}';
    expect(answerView(conScript({ "sensor.plan": s(forced) }), cfg)).toEqual({ script: "script.respuesta", mode: "forced" });
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

describe("skipTodayView («Hoy no lo uso»)", () => {
  const siempre = s("Siempre", { options: ["No", "Hoy", "Siempre"] });
  it("con uso Siempre se ofrece, apagado", () => {
    expect(skipTodayView(base({ "input_select.uso": siempre, "input_boolean.hoy_no": s("off") }), cfg)).toEqual({ entity: "input_boolean.hoy_no", on: false });
  });
  it("con uso No no tiene sentido: no se muestra", () => {
    expect(skipTodayView(base({ "input_select.uso": s("No", { options: ["No", "Hoy", "Siempre"] }), "input_boolean.hoy_no": s("off") }), cfg)).toBeNull();
  });
  it("encendido se muestra siempre, para poder apagarlo", () => {
    expect(skipTodayView(base({ "input_select.uso": s("No", { options: ["No", "Hoy", "Siempre"] }), "input_boolean.hoy_no": s("on") }), cfg)).toEqual({ entity: "input_boolean.hoy_no", on: true });
  });
  it("planificador apagado o sin la clave: nada", () => {
    expect(skipTodayView(base({ "input_boolean.plan": s("off"), "input_boolean.hoy_no": s("off") }), cfg)).toBeNull();
    const { skip_today: _, ...sinClave } = cfg;
    expect(skipTodayView(base({ "input_boolean.hoy_no": s("off") }), sinClave as LayZSpaCardConfig)).toBeNull();
  });
  it("encendido, el día cuenta como uso No: el dial edita el mantenimiento y se ocultan las horas de hoy", () => {
    const st = base({ "input_select.uso": siempre, "input_boolean.hoy_no": s("on") });
    expect(targetSource(st, cfg)).toMatchObject({ entity: "input_number.mant", caption: "mantenimiento" });
    expect(readyTimeView(st, cfg)).toBeNull();
    expect(maintenanceView(st, cfg)).toBeNull();
  });
  it("el resumen plegado lo dice", () => {
    expect(settingsSummary(null, null, null, true)).toBe("Hoy no se usa");
    expect(settingsSummary({ value: 30 }, { value: "20:00" }, null, false)).toBe("Mant. 30 °C · Baño 20:00");
  });
  it("skipTodayCall enciende o apaga el input_boolean", () => {
    expect(skipTodayCall("input_boolean.hoy_no", true)).toEqual({ domain: "input_boolean", service: "turn_on", data: { entity_id: "input_boolean.hoy_no" } });
    expect(skipTodayCall("input_boolean.hoy_no", false)).toEqual({ domain: "input_boolean", service: "turn_off", data: { entity_id: "input_boolean.hoy_no" } });
  });
});

describe("filterView (depuración mínima)", () => {
  const dep = { "input_number.dep_min": s("4.0", { min: 0, max: 12, step: 0.5 }), "sensor.dep_hoy": s("2.3") };
  it("con el planificador, sea cual sea el uso, con las horas de hoy", () => {
    expect(filterView(base({ ...dep, "input_select.uso": s("No", { options: ["No", "Hoy", "Siempre"] }) }), cfg)).toEqual({
      entity: "input_number.dep_min", value: 4, min: 0, max: 12, step: 0.5, today: 2.3,
    });
  });
  it("sin sensor de hoy, today null", () => {
    expect(filterView(base({ "input_number.dep_min": dep["input_number.dep_min"] }), cfg)?.today).toBeNull();
  });
  it("planificador apagado o sin clave: nada", () => {
    expect(filterView(base({ ...dep, "input_boolean.plan": s("off") }), cfg)).toBeNull();
    const { filter_min: _f, ...sinClave } = cfg;
    expect(filterView(base(dep), sinClave as LayZSpaCardConfig)).toBeNull();
  });
  it("formatHours", () => {
    expect(formatHours(4)).toBe("4 h");
    expect(formatHours(3.5)).toBe("3 h 30");
    expect(formatHours(0.25)).toBe("0 h 15");
    expect(formatHours(2.3)).toBe("2 h 18");
  });
  it("resumen plegado con la depuración", () => {
    expect(settingsSummary({ value: 30 }, { value: "20:00" }, null, false, { value: 4 })).toBe("Mant. 30 °C · Baño 20:00 · Dep. 4 h");
    expect(settingsSummary(null, null, null, false, { value: 0 })).toBe("");
  });
  it("planView marca la depuración", () => {
    const p = planView(base({ "sensor.plan": s('{"a":"depurar","t":37,"r":false,"n":13,"m":"Agua a 37 °C: depurando"}') }), cfg);
    expect(p?.filtering).toBe(true);
    expect(p?.heating).toBe(false);
  });
});

describe("finishedView («Hemos terminado»)", () => {
  const at = (h: number, m = 0) => new Date(2026, 9, 8, h, m);
  const st = (over: States = {}) => base({ "input_select.uso": s("Siempre", { options: ["No", "Hoy", "Siempre"] }), "input_boolean.hoy_no": s("off"), "input_datetime.hora": s("21:00:00", { has_date: false, has_time: true }), ...over });
  it("desde 30 min antes de la hora del baño", () => {
    expect(finishedView(st(), cfg, at(20, 29))).toBeNull();
    expect(finishedView(st(), cfg, at(20, 30))).toEqual({ entity: "input_boolean.hoy_no" });
    expect(finishedView(st(), cfg, at(22, 55))).toEqual({ entity: "input_boolean.hoy_no" });
  });
  it("no con «Hoy no lo uso» ya puesto, uso No o planificador apagado", () => {
    expect(finishedView(st({ "input_boolean.hoy_no": s("on") }), cfg, at(22))).toBeNull();
    expect(finishedView(st({ "input_select.uso": s("No", { options: ["No", "Hoy", "Siempre"] }) }), cfg, at(22))).toBeNull();
    expect(finishedView(st({ "input_boolean.plan": s("off") }), cfg, at(22))).toBeNull();
  });
});
