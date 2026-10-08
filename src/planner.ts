import type { LayZSpaCardConfig } from "./types";
import { dialRange, formatTemp, isValid, numberOf, toNumber, type ReadyView, type States } from "./status";

export type TargetSource = {
  kind: "climate" | "helper";
  entity: string;
  value: number | null;
  min: number;
  max: number;
  step: number;
  caption: string | null;
};

const NIGHT_USES = ["Hoy", "Siempre"];

export function plannerActive(states: States, cfg: LayZSpaCardConfig): boolean {
  if (!cfg.planner || !cfg.usage || !cfg.desired || !cfg.maintenance) return false;
  return states[cfg.planner]?.state === "on";
}

function nightUsage(states: States, cfg: LayZSpaCardConfig): boolean {
  return !!cfg.usage && NIGHT_USES.includes(states[cfg.usage]?.state ?? "");
}

function skippingToday(states: States, cfg: LayZSpaCardConfig): boolean {
  return !!cfg.skip_today && states[cfg.skip_today]?.state === "on";
}

/** Uso Hoy/Siempre y no se ha dicho «Hoy no lo uso» (con él, el día cuenta como uso No). */
function usesNight(states: States, cfg: LayZSpaCardConfig): boolean {
  return nightUsage(states, cfg) && !skippingToday(states, cfg);
}

function helperRange(attrs: Record<string, unknown>) {
  return dialRange({ min_temp: attrs.min, max_temp: attrs.max, target_temp_step: attrs.step });
}

export function targetSource(states: States, cfg: LayZSpaCardConfig): TargetSource {
  if (plannerActive(states, cfg)) {
    const night = usesNight(states, cfg);
    const entity = (night ? cfg.desired : cfg.maintenance) as string;
    const e = states[entity];
    const { min, max, step } = helperRange(e?.attributes ?? {});
    return { kind: "helper", entity, value: numberOf(e), min, max, step, caption: night ? "deseada" : "mantenimiento" };
  }
  const climate = states[cfg.climate];
  const { min, max, step } = dialRange(climate?.attributes ?? {});
  return { kind: "climate", entity: cfg.climate, value: toNumber(climate?.attributes.temperature), min, max, step, caption: null };
}

export function targetCall(src: TargetSource, value: number) {
  return src.kind === "helper"
    ? { domain: "input_number", service: "set_value", data: { entity_id: src.entity, value } }
    : { domain: "climate", service: "set_temperature", data: { entity_id: src.entity, temperature: value } };
}

export type PlanView = { text: string; heating: boolean; filtering: boolean; grid: boolean; observing: boolean; rule: number; ask: boolean; kept: boolean; forced: boolean };

export function planView(states: States, cfg: LayZSpaCardConfig): PlanView | null {
  if (!cfg.plan || !plannerActive(states, cfg)) return null;
  const raw = states[cfg.plan]?.state ?? "";
  if (!raw.startsWith("{")) return null;
  let p: Record<string, unknown>;
  try {
    p = JSON.parse(raw);
  } catch {
    return null;
  }
  return {
    text: String(p.m ?? ""),
    heating: p.a === "calentar",
    filtering: p.a === "depurar",
    grid: p.r === true,
    observing: !!cfg.observe && states[cfg.observe]?.state === "on",
    rule: Number(p.n ?? -1),
    ask: p.i === true,
    kept: p.k === true,
    forced: p.c === true,
  };
}

/** Botones «Calentar igualmente / Mantener» cuando el plan dice que no llega a la hora (i=true). */
/** ask: nadie ha respondido (dos botones); kept: respondieron «mantener» (solo «Calentar igualmente»);
 *  forced: respondieron «calentar» (solo «Mantener», para volver atrás). */
export type AnswerMode = "ask" | "kept" | "forced";

export function answerView(states: States, cfg: LayZSpaCardConfig): { script: string; mode: AnswerMode } | null {
  const plan = planView(states, cfg);
  if (!plan || plan.observing || !cfg.answer_script || !isValid(states[cfg.answer_script])) return null;
  const mode: AnswerMode | null = plan.ask ? "ask" : plan.kept ? "kept" : plan.forced ? "forced" : null;
  return mode ? { script: cfg.answer_script, mode } : null;
}

export type Answer = "jacuzzi_calentar" | "jacuzzi_mantener";

/** La misma respuesta que los botones de Telegram y del móvil: el script confirma a todos. */
export function answerCall(script: string, respuesta: Answer, quien: string | undefined) {
  return { domain: "script", service: "turn_on", data: { entity_id: script, variables: { respuesta, quien: quien || "Alguien" } } };
}

export function usageView(states: States, cfg: LayZSpaCardConfig): { current: string; options: string[] } | null {
  // Con el planificador apagado la tarjeta es exactamente la 0.1.1: sin selector
  if (!plannerActive(states, cfg)) return null;
  const e = cfg.usage ? states[cfg.usage] : undefined;
  if (!isValid(e)) return null;
  const options = Array.isArray(e.attributes.options) ? (e.attributes.options as unknown[]).map(String) : [];
  return { current: e.state, options };
}

export function maintenanceView(states: States, cfg: LayZSpaCardConfig) {
  if (!plannerActive(states, cfg) || !usesNight(states, cfg)) return null;
  const entity = cfg.maintenance as string;
  const e = states[entity];
  const { min, max, step } = helperRange(e?.attributes ?? {});
  return { entity, value: numberOf(e), min, max, step };
}

/** Hora de listo de hoy (input_datetime de solo hora), editable con el planificador y uso Hoy/Siempre. */
export function readyTimeView(states: States, cfg: LayZSpaCardConfig): { entity: string; value: string } | null {
  if (!cfg.ready_time || !plannerActive(states, cfg) || !usesNight(states, cfg)) return null;
  const e = states[cfg.ready_time];
  if (!isValid(e) || !/^\d{2}:\d{2}/.test(e.state)) return null;
  return { entity: cfg.ready_time, value: e.state.slice(0, 5) };
}

export type TimeSettingKey = "ready_until" | "ready_time_workday" | "ready_time_holiday";

/** Horas de los ajustes (fin del baño y horas por defecto): editables con el planificador, sea cual sea el uso. */
export function timeSettingView(states: States, cfg: LayZSpaCardConfig, key: TimeSettingKey): { entity: string; value: string } | null {
  const entity = cfg[key];
  if (!entity || !plannerActive(states, cfg)) return null;
  const e = states[entity];
  if (!isValid(e) || !/^\d{2}:\d{2}/.test(e.state)) return null;
  return { entity, value: e.state.slice(0, 5) };
}

/** «Hoy no lo uso» en los ajustes: con uso Hoy/Siempre, o encendido (para poder apagarlo). */
export function skipTodayView(states: States, cfg: LayZSpaCardConfig): { entity: string; on: boolean } | null {
  const entity = cfg.skip_today;
  if (!entity || !plannerActive(states, cfg) || !isValid(states[entity])) return null;
  const on = skippingToday(states, cfg);
  return on || nightUsage(states, cfg) ? { entity, on } : null;
}

/** Depuración mínima diaria en los ajustes: con el planificador, sea cual sea el uso. today = horas de bomba de hoy. */
export function filterView(
  states: States,
  cfg: LayZSpaCardConfig
): { entity: string; value: number | null; min: number; max: number; step: number; today: number | null } | null {
  const entity = cfg.filter_min;
  if (!entity || !plannerActive(states, cfg) || !isValid(states[entity])) return null;
  const a = states[entity].attributes;
  return {
    entity,
    value: numberOf(states[entity]),
    min: toNumber(a.min) ?? 0,
    max: toNumber(a.max) ?? 12,
    step: toNumber(a.step) ?? 0.5,
    today: numberOf(cfg.filter_today ? states[cfg.filter_today] : undefined),
  };
}

/** Horas como en un reloj: 4 → "4 h", 3.5 → "3 h 30", 0.25 → "0 h 15". */
export function formatHours(h: number): string {
  const min = Math.round(h * 60);
  const hh = Math.floor(min / 60);
  const mm = min % 60;
  return mm ? `${hh} h ${String(mm).padStart(2, "0")}` : `${hh} h`;
}

export function skipTodayCall(entity: string, on: boolean) {
  return { domain: "input_boolean", service: on ? "turn_on" : "turn_off", data: { entity_id: entity } };
}

/** Texto del bloque de ajustes plegado: "Mant. 30 °C · Baño 20:00–23:30" (fin 00:00 = sin fin). */
export function settingsSummary(
  maint: { value: number | null } | null,
  readyAt: { value: string } | null,
  until: { value: string } | null = null,
  skipToday = false,
  filter: { value: number | null } | null = null
): string {
  const parts: string[] = [];
  if (skipToday) parts.push("Hoy no se usa");
  if (maint) parts.push(`Mant. ${maint.value !== null ? formatTemp(maint.value) : "--"} °C`);
  if (readyAt) parts.push(`Baño ${readyAt.value}${until && until.value !== "00:00" ? `–${until.value}` : ""}`);
  if (filter && filter.value) parts.push(`Dep. ${formatHours(filter.value)}`);
  return parts.join(" · ");
}

export function gridExtraW(states: States, cfg: LayZSpaCardConfig): number | null {
  const w = numberOf(cfg.grid_extra ? states[cfg.grid_extra] : undefined);
  return w !== null && w > 0 ? w : null;
}

/** Con el planificador, "Listo" se refiere a la temperatura del dial (deseada), no al objetivo de la placa
 *  (que de noche puede ser el de valle, más bajo). El "Listo en" se deja tal cual: es el avance real. */
export function readyForTarget(ready: ReadyView, src: TargetSource, current: number | null): ReadyView {
  if (src.kind !== "helper" || ready.kind !== "ready") return ready;
  if (current === null || src.value === null || current < src.value) return { kind: "none" };
  return ready;
}

/** Botón del planificador en la cabecera: se muestra también apagado, para poder volver a encenderlo. */
export function plannerToggle(states: States, cfg: LayZSpaCardConfig): { entity: string; on: boolean } | null {
  const e = cfg.planner ? states[cfg.planner] : undefined;
  if (!cfg.planner || !isValid(e)) return null;
  return { entity: cfg.planner, on: e.state === "on" };
}
