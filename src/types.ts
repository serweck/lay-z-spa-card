import type { LovelaceCardConfig } from "custom-card-helpers";

export interface LayZSpaCardConfig extends LovelaceCardConfig {
  type: string;
  name?: string;
  /** climate de la placa (modos off/fan_only/heat y objetivo). Obligatorio. */
  climate: string;
  /** switch de las burbujas. */
  bubbles?: string;
  /** binary_sensor: resistencia calentando. */
  heater?: string;
  /** binary_sensor: agua en el objetivo. */
  ready?: string;
  /** sensor: horas (decimal) hasta llegar al objetivo. */
  time_to_ready?: string;
  /** number/sensor: temperatura ambiente en °C. */
  ambient?: string;
  /** sensor: codigo de error de la bomba ("0" = sin error). */
  error?: string;
  /** binary_sensor: placa conectada a MQTT. */
  connection?: string;
  /** switch del enchufe (Shelly). Solo lectura. */
  power_switch?: string;
  /** sensor: potencia real en W. */
  power?: string;
  /** sensor: energia consumida hoy (kWh). */
  energy_today?: string;
  /** input_select del uso (No/Hoy/Siempre). */
  usage?: string;
  /** input_number de la temperatura deseada (uso Hoy/Siempre). */
  desired?: string;
  /** input_number de la temperatura de mantenimiento (uso No). */
  maintenance?: string;
  /** sensor con el plan en JSON {a,t,r,n,m,h,l,v}. */
  plan?: string;
  /** input_boolean del planificador. */
  planner?: string;
  /** input_boolean del modo observar. */
  observe?: string;
  /** sensor: W que Node-RED importa de la red para el jacuzzi. */
  grid_extra?: string;
  ready_time?: string;
  /** script que recibe la respuesta al aviso de «no llega» (respuesta, quien). */
  answer_script?: string;
  /** input_datetime (solo hora): hasta qué hora se mantiene la deseada; después, solo mantenimiento. */
  ready_until?: string;
  /** input_datetime (solo hora): hora de listo por defecto los laborables. */
  ready_time_workday?: string;
  /** input_datetime (solo hora): hora de listo por defecto fines de semana y festivos. */
  ready_time_holiday?: string;
  /** input_boolean: «Hoy no lo uso» (el día cuenta como uso No; se apaga a medianoche). */
  skip_today?: string;
  /** input_number (h): horas mínimas de depuración al día (calentando también cuenta). */
  filter_min?: string;
  /** sensor (h): horas de bomba de hoy (history_stats). */
  filter_today?: string;
}

export type EntityKey = Exclude<keyof LayZSpaCardConfig, "type" | "name">;
