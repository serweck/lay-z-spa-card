import { LitElement, html, css, TemplateResult, nothing } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import { HomeAssistant, fireEvent, LovelaceCardEditor } from "custom-card-helpers";
import type { LayZSpaCardConfig } from "./types";
import { EDITOR_TAG } from "./const";

const SCHEMA = [
  { name: "name", selector: { text: {} } },
  { name: "climate", required: true, selector: { entity: { domain: "climate" } } },
  { name: "bubbles", selector: { entity: { domain: "switch" } } },
  { name: "heater", selector: { entity: { domain: "binary_sensor" } } },
  { name: "ready", selector: { entity: { domain: "binary_sensor" } } },
  { name: "time_to_ready", selector: { entity: { domain: "sensor" } } },
  { name: "ambient", selector: { entity: { domain: ["number", "sensor"] } } },
  { name: "error", selector: { entity: { domain: "sensor" } } },
  { name: "connection", selector: { entity: { domain: "binary_sensor" } } },
  { name: "power_switch", selector: { entity: { domain: "switch" } } },
  { name: "power", selector: { entity: { domain: "sensor" } } },
  { name: "energy_today", selector: { entity: { domain: "sensor" } } },
  { name: "usage", selector: { entity: { domain: "input_select" } } },
  { name: "desired", selector: { entity: { domain: "input_number" } } },
  { name: "maintenance", selector: { entity: { domain: "input_number" } } },
  { name: "plan", selector: { entity: { domain: "sensor" } } },
  { name: "planner", selector: { entity: { domain: "input_boolean" } } },
  { name: "observe", selector: { entity: { domain: "input_boolean" } } },
  { name: "grid_extra", selector: { entity: { domain: "sensor" } } },
  { name: "ready_time", selector: { entity: { domain: "input_datetime" } } },
  { name: "answer_script", selector: { entity: { domain: "script" } } },
  { name: "ready_until", selector: { entity: { domain: "input_datetime" } } },
  { name: "ready_time_workday", selector: { entity: { domain: "input_datetime" } } },
  { name: "ready_time_holiday", selector: { entity: { domain: "input_datetime" } } },
  { name: "skip_today", selector: { entity: { domain: "input_boolean" } } },
  { name: "filter_min", selector: { entity: { domain: "input_number" } } },
  { name: "filter_today", selector: { entity: { domain: "sensor" } } },
];

const LABELS: Record<string, string> = {
  name: "Nombre",
  climate: "Termostato del jacuzzi (climate)",
  bubbles: "Burbujas (switch)",
  heater: "Resistencia calentando (binary_sensor)",
  ready: "Agua lista (binary_sensor)",
  time_to_ready: "Tiempo hasta listo, en horas (sensor)",
  ambient: "Temperatura ambiente",
  error: "Código de error de la bomba (sensor)",
  connection: "Placa WiFi conectada (binary_sensor)",
  power_switch: "Enchufe del jacuzzi, solo lectura (switch)",
  power: "Potencia real en W (sensor)",
  energy_today: "Energía de hoy (sensor)",
  usage: "Planificador: uso No/Hoy/Siempre (input_select)",
  desired: "Planificador: temperatura deseada (input_number)",
  maintenance: "Planificador: temperatura de mantenimiento (input_number)",
  plan: "Planificador: plan en JSON (sensor)",
  planner: "Planificador: encendido (input_boolean)",
  observe: "Planificador: modo observar (input_boolean)",
  grid_extra: "Importación extra de red en W (sensor)",
  ready_time: "Planificador: hora de listo de hoy (input_datetime)",
  answer_script: "Planificador: respuesta al aviso de «no llega» (script)",
  ready_until: "Planificador: baño hasta (input_datetime)",
  ready_time_workday: "Planificador: hora del baño por defecto, laborables (input_datetime)",
  ready_time_holiday: "Planificador: hora del baño por defecto, fines de semana y festivos (input_datetime)",
  skip_today: "Planificador: hoy no lo uso, solo mantenimiento hasta medianoche (input_boolean)",
  filter_min: "Planificador: depuración mínima diaria, en horas (input_number)",
  filter_today: "Planificador: horas de bomba de hoy (sensor)",
};

@customElement(EDITOR_TAG)
export class LayZSpaCardEditor extends LitElement implements LovelaceCardEditor {
  @property({ attribute: false }) public hass!: HomeAssistant;
  @state() private _config!: LayZSpaCardConfig;

  public setConfig(config: LayZSpaCardConfig): void {
    this._config = config;
  }

  private _computeLabel = (schema: { name: string }): string => LABELS[schema.name] ?? schema.name;

  protected render(): TemplateResult | typeof nothing {
    if (!this.hass || !this._config) return nothing;
    return html`
      <ha-form
        .hass=${this.hass}
        .data=${this._config}
        .schema=${SCHEMA}
        .computeLabel=${this._computeLabel}
        @value-changed=${this._valueChanged}
      ></ha-form>
      <p class="hint">Solo el termostato es obligatorio; lo que falte se oculta en la tarjeta. Con el planificador encendido, el dial edita la temperatura deseada o la de mantenimiento.</p>
    `;
  }

  private _valueChanged(ev: CustomEvent): void {
    fireEvent(this, "config-changed", { config: ev.detail.value as LayZSpaCardConfig });
  }

  static styles = css`
    .hint {
      color: var(--secondary-text-color);
      font-size: 0.85em;
      margin-top: 8px;
    }
  `;
}
