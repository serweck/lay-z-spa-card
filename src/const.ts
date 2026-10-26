import type { EntityKey } from "./types";

export const CARD_VERSION = "0.3.0";
export const CARD_TAG = "lay-z-spa-card";
export const EDITOR_TAG = "lay-z-spa-card-editor";

/** Por debajo de esta potencia, con la placa caida, se asume el diferencial saltado
 *  (la bomba en reposo con la placa encendida mide ~2,8 W). */
export const RCD_POWER_THRESHOLD_W = 1;

/** Ids que usa la instalacion de casa; getStubConfig solo pone los que existen. */
export const DEFAULT_ENTITIES: Record<EntityKey, string> = {
  climate: "climate.layzspa_temperature_control",
  bubbles: "switch.layzspa_airbubbles",
  heater: "binary_sensor.layzspa_heater",
  ready: "binary_sensor.layzspa_ready",
  time_to_ready: "sensor.layzspa_time_to_ready",
  ambient: "number.layzspa_amb_temp_c",
  error: "sensor.layzspa_error",
  connection: "binary_sensor.layzspa_connection",
  power_switch: "switch.jacuzzi",
  power: "sensor.jacuzzi_power",
  energy_today: "sensor.jacuzzi_energia_energy_daily",
  usage: "input_select.jacuzzi_uso",
  desired: "input_number.jacuzzi_temp_deseada",
  maintenance: "input_number.jacuzzi_temp_mantenimiento",
  plan: "sensor.jacuzzi_plan",
  planner: "input_boolean.jacuzzi_planificador",
  observe: "input_boolean.jacuzzi_planificador_observar",
  grid_extra: "sensor.jacuzzi_extra_red",
  ready_time: "input_datetime.jacuzzi_hora_listo",
  answer_script: "script.jacuzzi_respuesta_no_llega",
  ready_until: "input_datetime.jacuzzi_hora_fin",
  heat_today: "input_boolean.jacuzzi_hoy_si",
  skip_today: "input_boolean.jacuzzi_hoy_no",
  filter_min: "input_number.jacuzzi_depuracion_minima",
  filter_today: "sensor.jacuzzi_depuracion_hoy",
};

/** Horario semanal de casa (L, M, X, J, V, S, D, Festivo); getStubConfig los pone si existen los 8. */
const SCHEDULE_DAYS = ["lun", "mar", "mie", "jue", "vie", "sab", "dom", "fes"];
export const DEFAULT_SCHEDULE_DAYS = SCHEDULE_DAYS.map((d) => `input_boolean.jacuzzi_dia_${d}`);
export const DEFAULT_SCHEDULE_TIMES = SCHEDULE_DAYS.map((d) => `input_datetime.jacuzzi_hora_${d}`);
