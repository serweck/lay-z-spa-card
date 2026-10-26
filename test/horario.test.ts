import { describe, it, expect } from "vitest";
import { planView, targetSource, readyTimeView, finishedView, scheduleView, heatTodayView, settingsSummary } from "../src/planner";
import type { States } from "../src/status";
import type { LayZSpaCardConfig } from "../src/types";

const DAYS = ["lun", "mar", "mie", "jue", "vie", "sab", "dom", "fes"];
const cfg: LayZSpaCardConfig = {
  type: "custom:lay-z-spa-card",
  climate: "climate.spa",
  usage: "input_select.uso",
  desired: "input_number.deseada",
  maintenance: "input_number.mant",
  plan: "sensor.plan",
  planner: "input_boolean.plan",
  ready_time: "input_datetime.hora",
  skip_today: "input_boolean.hoy_no",
  heat_today: "input_boolean.hoy_si",
  schedule_days: DAYS.map((d) => `input_boolean.dia_${d}`),
  schedule_times: DAYS.map((d) => `input_datetime.hora_${d}`),
};
const s = (state: string, attributes: Record<string, unknown> = {}) => ({ state, attributes });
const num = (v: string) => s(v, { min: 20, max: 40, step: 1 });
const uso = (v: string) => s(v, { options: ["No", "Hoy", "Siempre"] });
const plan = (p: Record<string, unknown>) => s(JSON.stringify({ a: "no_calentar", t: 30, n: 8, m: "x", ...p }));
const ON = ["mar", "jue", "vie", "sab", "dom", "fes"];
const TIMES: Record<string, string> = { lun: "20:00", mar: "20:00", mie: "20:00", jue: "20:00", vie: "22:00", sab: "21:00", dom: "21:00", fes: "21:00" };
function base(over: States = {}): States {
  const st: States = {
    "climate.spa": s("heat", { temperature: 38, current_temperature: 30, min_temp: 20, max_temp: 40, target_temp_step: 1 }),
    "input_select.uso": uso("Siempre"),
    "input_number.deseada": num("37.0"),
    "input_number.mant": num("30.0"),
    "input_boolean.plan": s("on"),
    "input_boolean.hoy_no": s("off"),
    "input_boolean.hoy_si": s("off"),
    "sensor.plan": plan({ b: true, g: "" }),
    "input_datetime.hora": s("20:00:00", { has_date: false, has_time: true }),
  };
  for (const d of DAYS) {
    st[`input_boolean.dia_${d}`] = s(ON.includes(d) ? "on" : "off");
    st[`input_datetime.hora_${d}`] = s(`${TIMES[d]}:00`, { has_date: false, has_time: true });
  }
  return { ...st, ...over };
}

describe("planView: baño de hoy (b) y motivo (g)", () => {
  it("lee b y g del plan", () => {
    expect(planView(base({ "sensor.plan": plan({ b: false, g: "guardia" }) }), cfg)).toMatchObject({ bath: false, reason: "guardia" });
  });
  it("sin b (plan antiguo): bath null y sin motivo", () => {
    expect(planView(base({ "sensor.plan": plan({}) }), cfg)).toMatchObject({ bath: null, reason: "" });
  });
});

describe("targetSource sigue al plan", () => {
  it("uso Siempre pero hoy no hay baño: mantenimiento", () => {
    expect(targetSource(base({ "sensor.plan": plan({ b: false, g: "apagado" }) }), cfg).caption).toBe("mantenimiento");
  });
  it("uso No con «Calentar hoy» (b true): deseada", () => {
    expect(targetSource(base({ "input_select.uso": uso("No"), "sensor.plan": plan({ b: true, g: "" }) }), cfg).caption).toBe("deseada");
  });
  it("sin b: como antes (uso Siempre → deseada; «Hoy no» → mantenimiento)", () => {
    expect(targetSource(base({ "sensor.plan": plan({}) }), cfg).caption).toBe("deseada");
    expect(targetSource(base({ "sensor.plan": plan({}), "input_boolean.hoy_no": s("on") }), cfg).caption).toBe("mantenimiento");
  });
});

describe("hora de hoy y «Hemos terminado» siguen al plan", () => {
  it("día sin baño: ni hora ni «Hemos terminado»", () => {
    const st = base({ "sensor.plan": plan({ b: false, g: "guardia" }) });
    expect(readyTimeView(st, cfg)).toBeNull();
    expect(finishedView(st, cfg, new Date(2026, 9, 26, 21, 0))).toBeNull();
  });
  it("uso No con baño hoy: se ven", () => {
    const st = base({ "input_select.uso": uso("No"), "sensor.plan": plan({ b: true, g: "" }) });
    expect(readyTimeView(st, cfg)?.value).toBe("20:00");
    expect(finishedView(st, cfg, new Date(2026, 9, 26, 21, 0))).not.toBeNull();
  });
});

describe("scheduleView", () => {
  it("8 filas L…D + Festivo con interruptor y hora", () => {
    const rows = scheduleView(base(), cfg)!;
    expect(rows).toHaveLength(8);
    expect(rows.map((r) => r.label)).toEqual(["L", "M", "X", "J", "V", "S", "D", "Festivo"]);
    expect(rows[1]).toEqual({ label: "M", day: "input_boolean.dia_mar", on: true, time: { entity: "input_datetime.hora_mar", value: "20:00" } });
    expect(rows[0].on).toBe(false);
    expect(rows[4].time?.value).toBe("22:00");
  });
  it("planificador apagado o sin configurar: nada", () => {
    expect(scheduleView(base({ "input_boolean.plan": s("off") }), cfg)).toBeNull();
    expect(scheduleView(base(), { ...cfg, schedule_days: undefined })).toBeNull();
  });
  it("omite las filas cuyo interruptor no existe", () => {
    const st = base();
    delete st["input_boolean.dia_fes"];
    expect(scheduleView(st, cfg)).toHaveLength(7);
  });
});

describe("heatTodayView («Calentar hoy»)", () => {
  it("guardia y sin activar: botón para calentar", () => {
    expect(heatTodayView(base({ "sensor.plan": plan({ b: false, g: "guardia" }) }), cfg)).toEqual({
      entity: "input_boolean.hoy_si",
      on: false,
      reason: "guardia",
      time: { entity: "input_datetime.hora", value: "20:00" },
    });
  });
  it("activado: botón para deshacer", () => {
    expect(heatTodayView(base({ "input_boolean.hoy_si": s("on") }), cfg)).toMatchObject({ entity: "input_boolean.hoy_si", on: true, reason: "" });
  });
  it("día normal: nada", () => {
    expect(heatTodayView(base(), cfg)).toBeNull();
  });
});

describe("settingsSummary sin baño hoy", () => {
  it("dice «Hoy no toca» y no la hora", () => {
    const txt = settingsSummary({ desired: { value: 38 }, maint: { value: 30 } }, null, null, false, null, true);
    expect(txt).toContain("Hoy no toca");
    expect(txt).not.toContain("Baño");
  });
});
