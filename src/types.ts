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
}

export type EntityKey = Exclude<keyof LayZSpaCardConfig, "type" | "name">;
