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

/** ¿Hoy hay baño? Lo dice el plan (b: uso, horario semanal, guardia, «Calentar hoy», «Hoy no lo uso»).
 *  Con un plan sin b (versión anterior), uso Hoy/Siempre y sin «Hoy no lo uso». */
function usesNight(states: States, cfg: LayZSpaCardConfig): boolean {
  const bath = planJson(states, cfg)?.b;
  if (typeof bath === "boolean") return bath;
  return nightUsage(states, cfg) && !skippingToday(states, cfg);
}

function planJson(states: States, cfg: LayZSpaCardConfig): Record<string, unknown> | null {
  const raw = cfg.plan ? states[cfg.plan]?.state ?? "" : "";
  if (!raw.startsWith("{")) return null;
  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
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

/** Por qué hoy no hay baño con uso Siempre: guardia en el calendario o día apagado en el horario. */
export type NoBathReason = "guardia" | "apagado" | "";

export type PlanView = {
  text: string;
  heating: boolean;
  filtering: boolean;
  grid: boolean;
  observing: boolean;
  rule: number;
  ask: boolean;
  kept: boolean;
  forced: boolean;
  bath: boolean | null;
  reason: NoBathReason;
};

export function planView(states: States, cfg: LayZSpaCardConfig): PlanView | null {
  if (!cfg.plan || !plannerActive(states, cfg)) return null;
  const p = planJson(states, cfg);
  if (!p) return null;
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
    bath: typeof p.b === "boolean" ? p.b : null,
    reason: p.g === "guardia" || p.g === "apagado" ? p.g : "",
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

export type TempSettingKey = "desired" | "maintenance";
export type TempSettingView = { entity: string; value: number | null; min: number; max: number; step: number };

/** Deseada y mantenimiento en los ajustes: con el planificador, sea cual sea el uso. Así se puede poner la deseada
 *  aunque el dial esté editando el mantenimiento (uso No o «Hoy no lo uso») y decidir bañarse después. */
export function tempSettingView(states: States, cfg: LayZSpaCardConfig, key: TempSettingKey): TempSettingView | null {
  if (!plannerActive(states, cfg)) return null;
  const entity = cfg[key] as string;
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

export type TimeSettingKey = "ready_until";

/** Horas de los ajustes (fin del baño): editables con el planificador, sea cual sea el uso. */
export function timeSettingView(states: States, cfg: LayZSpaCardConfig, key: TimeSettingKey): { entity: string; value: string } | null {
  return timeOf(states, cfg, cfg[key]);
}

function timeOf(states: States, cfg: LayZSpaCardConfig, entity: string | undefined): { entity: string; value: string } | null {
  if (!entity || !plannerActive(states, cfg)) return null;
  const e = states[entity];
  if (!isValid(e) || !/^\d{2}:\d{2}/.test(e.state)) return null;
  return { entity, value: e.state.slice(0, 5) };
}

const SCHEDULE_LABELS = ["L", "M", "X", "J", "V", "S", "D", "Festivo"];

export type ScheduleRow = { label: string; day: string; on: boolean; time: { entity: string; value: string } | null };

/** Horario semanal en los ajustes: una fila por día (L…D y Festivo) con «hay baño» y la hora. Las filas cuyo
 *  interruptor no existe se omiten. */
export function scheduleView(states: States, cfg: LayZSpaCardConfig): ScheduleRow[] | null {
  const days = cfg.schedule_days;
  if (!days?.length || !plannerActive(states, cfg)) return null;
  const rows: ScheduleRow[] = [];
  days.slice(0, SCHEDULE_LABELS.length).forEach((day, i) => {
    if (!isValid(states[day])) return;
    rows.push({ label: SCHEDULE_LABELS[i], day, on: states[day].state === "on", time: timeOf(states, cfg, cfg.schedule_times?.[i]) });
  });
  return rows.length ? rows : null;
}

/** «Calentar hoy»: con uso Siempre y hoy sin baño por guardia o día apagado, o ya activado (para deshacerlo).
 *  time = hora de hoy, para poder ajustarla junto al botón antes de activarlo. */
export function heatTodayView(
  states: States,
  cfg: LayZSpaCardConfig
): { entity: string; on: boolean; reason: NoBathReason; time: { entity: string; value: string } | null } | null {
  const entity = cfg.heat_today;
  if (!entity || !plannerActive(states, cfg) || !isValid(states[entity])) return null;
  const on = states[entity].state === "on";
  const reason = planView(states, cfg)?.reason ?? "";
  return on || reason ? { entity, on, reason, time: timeOf(states, cfg, cfg.ready_time) } : null;
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

/** «Hemos terminado»: día de baño, aún no se ha dicho «Hoy no lo uso» y faltan menos de 30 min para la hora del
 *  baño (o ya pasó). Enciende el mismo interruptor que «Hoy no lo uso»: solo mantenimiento hasta medianoche. */
export function finishedView(states: States, cfg: LayZSpaCardConfig, now: Date): { entity: string } | null {
  const entity = cfg.skip_today;
  if (!entity || !plannerActive(states, cfg) || !isValid(states[entity]) || !usesNight(states, cfg)) return null;
  const ready = readyTimeView(states, cfg);
  if (!ready) return null;
  const [hh, mm] = ready.value.split(":").map(Number);
  const minutes = now.getHours() * 60 + now.getMinutes();
  return minutes >= hh * 60 + mm - 30 ? { entity } : null;
}

export function skipTodayCall(entity: string, on: boolean) {
  return { domain: "input_boolean", service: on ? "turn_on" : "turn_off", data: { entity_id: entity } };
}

/** Texto del bloque de ajustes plegado: "Mant. 30 °C · Baño 20:00–23:30" (fin 00:00 = sin fin). */
type SummaryTemp = { value: number | null } | null | undefined;

export function settingsSummary(
  temps: { desired?: SummaryTemp; maint?: SummaryTemp } | null,
  readyAt: { value: string } | null,
  until: { value: string } | null = null,
  skipToday = false,
  filter: { value: number | null } | null = null,
  noBath = false
): string {
  const parts: string[] = [];
  if (skipToday) parts.push("Hoy no se usa");
  else if (noBath) parts.push("Hoy no toca");
  const t = (v: { value: number | null }) => (v.value !== null ? formatTemp(v.value) : "--");
  const desired = temps?.desired;
  const maint = temps?.maint;
  if (desired && maint) parts.push(`${t(desired)}/${t(maint)} °C`);
  else if (desired) parts.push(`Deseada ${t(desired)} °C`);
  else if (maint) parts.push(`Mant. ${t(maint)} °C`);
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
