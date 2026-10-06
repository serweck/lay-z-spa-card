import { LitElement, html, svg, css, TemplateResult, nothing } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import { HomeAssistant, LovelaceCard, LovelaceCardEditor, fireEvent } from "custom-card-helpers";
import type { LayZSpaCardConfig } from "./types";
import { CARD_TAG, CARD_VERSION, EDITOR_TAG } from "./const";
import {
  AVAILABILITY_TEXT,
  availability,
  bubblesState,
  displayTarget,
  dragResult,
  dialRange,
  errorCode,
  formatPower,
  formatTemp,
  numberOf,
  pendingTarget,
  readyView,
  toNumber,
  type PendingTarget,
  type States,
} from "./status";
import {
  ARC_END,
  ARC_R,
  ARC_START,
  angleOfValue,
  arcPath,
  clampTarget,
  isNearHandle,
  pointerAngle,
  polarToCartesian,
  valueFromAngle,
} from "./dial";
import { detectEntities } from "./detect";
import { answerCall, answerView, type Answer, gridExtraW, maintenanceView, planView, plannerToggle, readyForTarget, readyTimeView, settingsSummary, timeSettingView, targetCall, targetSource, usageView } from "./planner";
import "./editor";

/* eslint-disable no-console */
console.info(
  `%c LAY-Z-SPA-CARD %c v${CARD_VERSION} `,
  "color: white; background: #ff8100; font-weight: 700;",
  "color: #ff8100; background: #1c1c1c; font-weight: 700;"
);

(window as any).customCards = (window as any).customCards || [];
(window as any).customCards.push({
  type: CARD_TAG,
  name: "Lay-Z-Spa Card",
  description: "Gestión del jacuzzi: temperatura, modos, burbujas, tiempo hasta listo y consumo",
  preview: true,
});

const GREY = "#6f7176";
const MODE_META: Record<string, { icon: string; label: string; color: string; dot: string }> = {
  off: { icon: "mdi:power", label: "Apagado", color: GREY, dot: "#4a4b4f" },
  fan_only: { icon: "mdi:fan", label: "Filtro", color: "#2b9af9", dot: "#15578f" },
  heat: { icon: "mdi:fire", label: "Calor", color: "#ff8100", dot: "#9c4e00" },
};
const MODE_ORDER = ["off", "fan_only", "heat"];

@customElement(CARD_TAG)
export class LayZSpaCard extends LitElement implements LovelaceCard {
  @property({ attribute: false }) public hass!: HomeAssistant;
  @state() private config!: LayZSpaCardConfig;
  @state() private _dragging = false;
  @state() private _dragTemp: number | null = null;
  /** Objetivo enviado que HA aun no ha confirmado (base de −/+ y valor mostrado). */
  @state() private _pending: PendingTarget | null = null;
  /** Entidad a la que pertenece el pendiente: al cambiar el uso, el de la deseada no vale para el mantenimiento. */
  @state() private _pendingEntity: string | null = null;
  @state() private _settingsOpen = false;

  private _valueAngle = 0;
  private _dragPointerId: number | null = null;
  private _boundMove = (e: PointerEvent) => this._onPointerMove(e);
  private _boundUp = (e: PointerEvent) => this._onPointerUp(e);

  public static async getConfigElement(): Promise<LovelaceCardEditor> {
    return document.createElement(EDITOR_TAG) as unknown as LovelaceCardEditor;
  }

  public static getStubConfig(hass?: HomeAssistant): Record<string, unknown> {
    return { name: "Jacuzzi", ...detectEntities(hass ? Object.keys(hass.states) : []) };
  }

  public setConfig(config: LayZSpaCardConfig): void {
    if (!config.climate) throw new Error("Falta 'climate'");
    this.config = { ...config };
  }

  public getCardSize(): number {
    return 6;
  }

  public disconnectedCallback(): void {
    super.disconnectedCallback();
    this._removeWindowListeners();
  }

  private get _states(): States {
    return this.hass.states as unknown as States;
  }

  protected render(): TemplateResult | typeof nothing {
    if (!this.hass || !this.config) return nothing;
    const states = this._states;
    const climate = states[this.config.climate];
    if (!climate) {
      return html`<ha-card><div class="warn">Entidad no encontrada: ${this.config.climate}</div></ha-card>`;
    }

    const avail = availability(states, this.config);
    const ok = avail === "ok";
    const mode = climate.state;
    const meta = MODE_META[mode];
    const accent = ok && meta ? meta.color : GREY;
    const dotColor = ok && meta ? meta.dot : "#4a4b4f";
    // Con el planificador activo, el dial edita la deseada o el mantenimiento; si no, el objetivo de la placa
    const src = targetSource(states, this.config);
    const { min, max } = src;
    const pending = pendingTarget(this._pendingFor(src.entity), src.value, Date.now());
    const shownTarget = displayTarget(this._dragTemp, pending, src.value);
    const current = ok ? toNumber(climate.attributes.current_temperature) : null;
    const heaterOn = ok && !!this.config.heater && states[this.config.heater]?.state === "on";

    const hasTarget = shownTarget !== null;
    const valueAngle = angleOfValue(shownTarget ?? min, min, max);
    this._valueAngle = hasTarget ? valueAngle % 360 : -999; // sin objetivo no hay bolita que agarrar
    const handle = polarToCartesian(100, 100, ARC_R, valueAngle);
    const curAngle = current !== null ? angleOfValue(current, min, max) : null;
    const curDot = curAngle !== null ? polarToCartesian(100, 100, ARC_R, curAngle) : null;
    const fillStart = curAngle !== null ? Math.min(valueAngle, curAngle) : ARC_START;
    const fillEnd = curAngle !== null ? Math.max(valueAngle, curAngle) : valueAngle;
    const gradId = `grad-${mode}`;

    const label = !meta ? mode : mode === "heat" && heaterOn ? "Calentando" : meta.label;
    const power = numberOf(this.config.power ? states[this.config.power] : undefined);
    const toggle = plannerToggle(states, this.config);

    return html`
      <ha-card style="--accent:${accent}">
        <div class="header">
          <span class="title"><ha-icon icon="mdi:hot-tub"></ha-icon>${this.config.name ?? "Jacuzzi"}</span>
          <span class="header-center">
            ${toggle
              ? html`<button
                  class="planner-toggle ${toggle.on ? "on" : ""}"
                  title=${toggle.on ? "Planificador encendido: tócalo para apagarlo" : "Planificador apagado: tócalo para encenderlo"}
                  @click=${this._togglePlanner}
                >
                  <ha-icon icon=${toggle.on ? "mdi:robot" : "mdi:robot-off"}></ha-icon>Planificador
                </button>`
              : nothing}
          </span>
          <span class="header-right">
          ${power !== null
            ? html`<button
                class="power"
                title="Consumo real"
                @click=${() => this._openMoreInfo(this.config.energy_today || this.config.power)}
              >
                <ha-icon icon="mdi:flash"></ha-icon>${formatPower(power)} W
              </button>`
            : nothing}
          </span>
        </div>

        <div class="dial-wrap">
          <svg viewBox="0 0 200 200" class="dial" @pointerdown=${this._onPointerDown}>
            <defs>
              <linearGradient id=${gradId} x1="0" y1="0" x2="1" y2="1">
                ${mode === "fan_only"
                  ? svg`<stop offset="0%" stop-color="#5cc6ff" /><stop offset="100%" stop-color="#1f7fd6" />`
                  : mode === "heat"
                  ? svg`<stop offset="0%" stop-color="#ffb454" /><stop offset="100%" stop-color="#e8730a" />`
                  : svg`<stop offset="0%" stop-color="#8a8c91" /><stop offset="100%" stop-color="#5d5f63" />`}
              </linearGradient>
            </defs>
            <path class="track" d=${arcPath(100, 100, ARC_R, ARC_START, ARC_END)} />
            ${ok && hasTarget
              ? svg`
                <path class="glow" style="stroke:${accent}" d=${arcPath(100, 100, ARC_R, fillStart, fillEnd)} />
                <path class="value" style="stroke:url(#${gradId})" d=${arcPath(100, 100, ARC_R, fillStart, fillEnd)} />
                ${curDot ? svg`<circle class="curdot" style="fill:${dotColor}" cx=${curDot.x} cy=${curDot.y} r="4" />` : nothing}
                <circle class="handle ${heaterOn ? "pulse" : ""}" style="stroke:${accent}" cx=${handle.x} cy=${handle.y} r="8" />`
              : nothing}
          </svg>
          <div class="dial-center">${ok ? this._renderCenter(label, shownTarget, current, src.caption) : this._renderUnavailable(avail)}</div>
        </div>

        ${ok ? this._renderInfo() : nothing} ${ok ? this._renderPlanner() : nothing}
        ${this._renderModes(ok, mode, climate.attributes.hvac_modes)}
      </ha-card>
    `;
  }

  private _renderCenter(label: string, target: number | null, current: number | null, caption: string | null): TemplateResult {
    return html`
      <div class="center-tap clickable" title="Ver detalle" @click=${() => this._openMoreInfo(this.config.climate)}>
        <div class="mode-name">${label}</div>
        <div class="target">
          <span class="int">${target !== null ? Math.round(target) : "--"}</span><span class="unit">°C</span>
        </div>
        ${caption ? html`<div class="caption">${caption}</div>` : nothing}
      </div>
      ${current !== null
        ? html`<div class="current clickable" title="Ver histórico" @click=${() => this._openMoreInfo(this.config.climate)}>
            <ha-icon icon="mdi:water-thermometer"></ha-icon>${formatTemp(current)} °C
          </div>`
        : nothing}
      <div class="adjust">
        <button class="round" @click=${() => this._step(-1)}><ha-icon icon="mdi:minus"></ha-icon></button>
        <button class="round" @click=${() => this._step(1)}><ha-icon icon="mdi:plus"></ha-icon></button>
      </div>
    `;
  }

  private _renderUnavailable(avail: Exclude<ReturnType<typeof availability>, "ok">): TemplateResult {
    const t = AVAILABILITY_TEXT[avail];
    return html`
      <ha-icon class="unavail-icon" icon=${t.icon}></ha-icon>
      <div class="unavail-title">${t.title}</div>
      <div class="unavail-detail">${t.detail}</div>
    `;
  }

  private _renderInfo(): TemplateResult {
    const states = this._states;
    const ambient = numberOf(this.config.ambient ? states[this.config.ambient] : undefined);
    const climate = states[this.config.climate];
    const water = climate ? toNumber(climate.attributes.current_temperature) : null;
    const ready = readyForTarget(readyView(states, this.config), targetSource(states, this.config), water);
    const err = errorCode(states, this.config);
    const gridExtra = gridExtraW(states, this.config);
    return html`
      <div class="info">
        ${ambient !== null
          ? html`<span class="item clickable" @click=${() => this._openMoreInfo(this.config.ambient)}>
              <ha-icon icon="mdi:home-thermometer-outline"></ha-icon>Amb. ${formatTemp(ambient)} °C
            </span>`
          : nothing}
        ${gridExtra !== null
          ? html`<span class="item grid-extra clickable" title="Importando de la red para el jacuzzi (sin batería)" @click=${() => this._openMoreInfo(this.config.grid_extra)}>
              <ha-icon icon="mdi:transmission-tower-import"></ha-icon>+${formatPower(gridExtra)} W red
            </span>`
          : nothing}
        ${ready.kind === "ready"
          ? html`<span class="chip ready"><ha-icon icon="mdi:check-circle"></ha-icon>Listo</span>`
          : ready.kind === "eta"
          ? html`<span class="item clickable" @click=${() => this._openMoreInfo(this.config.time_to_ready)}>
              <ha-icon icon="mdi:timer-sand"></ha-icon>Listo ${ready.text}
            </span>`
          : nothing}
      </div>
      ${err
        ? html`<div class="warnings"><span class="chip error"><ha-icon icon="mdi:alert"></ha-icon>Error ${err}</span></div>`
        : nothing}
    `;
  }

  private _renderModes(ok: boolean, mode: string, hvacModes: unknown): TemplateResult {
    const supported = Array.isArray(hvacModes) ? (hvacModes as string[]) : MODE_ORDER;
    const bubbles = bubblesState(this._states, this.config);
    return html`
      <div class="bar">
        <div class="modes">
          ${MODE_ORDER.filter((m) => supported.includes(m)).map((m) => {
            const meta = MODE_META[m];
            return html`<button
              class="mode ${ok && mode === m ? "active" : ""}"
              style="--mode-color:${meta.color}"
              title=${meta.label}
              ?disabled=${!ok}
              @click=${() => this._setMode(m)}
            >
              <ha-icon icon=${meta.icon}></ha-icon>
            </button>`;
          })}
        </div>
        ${bubbles !== "none"
          ? html`<button
              class="bubbles ${ok && bubbles === "on" ? "active" : ""}"
              title=${bubbles === "unavailable" ? "Burbujas sin datos" : "Burbujas"}
              ?disabled=${!ok || bubbles === "unavailable"}
              @click=${this._toggleBubbles}
            >
              <ha-icon icon="mdi:chart-bubble"></ha-icon>
            </button>`
          : nothing}
      </div>
    `;
  }

  // --- acciones ---
  private _setMode(mode: string): void {
    this.hass.callService("climate", "set_hvac_mode", { entity_id: this.config.climate, hvac_mode: mode });
  }

  private _toggleBubbles = (): void => {
    if (!this.config.bubbles) return;
    this.hass.callService("switch", "toggle", { entity_id: this.config.bubbles });
  };

  private _pendingFor(entity: string): PendingTarget | null {
    return this._pendingEntity === entity ? this._pending : null;
  }

  private _step(dir: number): void {
    const src = targetSource(this._states, this.config);
    const { min, max, step } = src;
    const cur = pendingTarget(this._pendingFor(src.entity), src.value, Date.now()) ?? src.value ?? min;
    const next = clampTarget(cur + dir * step, min, max, step);
    if (next === cur) return;
    this._sendTarget(next);
  }

  private _sendTarget(value: number): void {
    const src = targetSource(this._states, this.config);
    this._pending = { value, at: Date.now() };
    this._pendingEntity = src.entity;
    const c = targetCall(src, value);
    this.hass.callService(c.domain, c.service, c.data);
  }

  // --- planificador ---
  private _renderPlanner(): TemplateResult | typeof nothing {
    const states = this._states;
    const plan = planView(states, this.config);
    const usage = usageView(states, this.config);
    const maint = maintenanceView(states, this.config);
    const readyAt = readyTimeView(states, this.config);
    const answer = answerView(states, this.config);
    const until = timeSettingView(states, this.config, "ready_until");
    const workday = timeSettingView(states, this.config, "ready_time_workday");
    const holiday = timeSettingView(states, this.config, "ready_time_holiday");
    const hasSettings = !!(maint || readyAt || until || workday || holiday);
    if (!plan && !usage && !hasSettings) return nothing;
    return html`
      ${plan
        ? html`<div class="plan ${plan.observing ? "observing" : ""} clickable" title="Plan del jacuzzi" @click=${() => this._openMoreInfo(this.config.plan)}>
            <ha-icon icon=${plan.observing ? "mdi:eye" : "mdi:robot"}></ha-icon>
            <span>${plan.observing ? "Observando: " : ""}${plan.text}${plan.grid ? " · red" : ""}</span>
          </div>`
        : nothing}
      ${answer
        ? html`<div class="answer">
            ${answer.mode === "forced"
              ? nothing
              : html`<button class="heat" @click=${() => this._answer(answer.script, "jacuzzi_calentar")}>
                  <ha-icon icon="mdi:fire"></ha-icon>Calentar igualmente
                </button>`}
            ${answer.mode === "kept"
              ? nothing
              : html`<button @click=${() => this._answer(answer.script, "jacuzzi_mantener")}>
                  <ha-icon icon="mdi:snowflake"></ha-icon>Mantener
                </button>`}
          </div>`
        : nothing}
      ${usage
        ? html`<div class="usage">
            ${usage.options.map(
              (o) => html`<button class="${o === usage.current ? "active" : ""}" @click=${() => this._setUsage(o)}>${o}</button>`
            )}
          </div>`
        : nothing}
      ${hasSettings
        ? html`<div class="settings ${this._settingsOpen ? "open" : ""}">
            <button class="settings-toggle" aria-expanded=${this._settingsOpen ? "true" : "false"} @click=${this._toggleSettings}>
              <ha-icon icon="mdi:tune-variant"></ha-icon>
              <span class="setting-label">${this._settingsOpen ? "Ajustes" : settingsSummary(maint, readyAt, until) || "Horas del baño"}</span>
              <ha-icon class="chevron" icon="mdi:chevron-down"></ha-icon>
            </button>
            ${this._settingsOpen && maint
              ? html`<div class="setting">
                  <ha-icon icon="mdi:wrench-outline"></ha-icon>
                  <span class="setting-label">Mantenimiento</span>
                  <div class="pill">
                    <button class="pill-btn" title="Bajar" @click=${() => this._stepMaintenance(-1)}><ha-icon icon="mdi:minus"></ha-icon></button>
                    <span class="pill-value">${maint.value !== null ? formatTemp(maint.value) : "--"} °C</span>
                    <button class="pill-btn" title="Subir" @click=${() => this._stepMaintenance(1)}><ha-icon icon="mdi:plus"></ha-icon></button>
                  </div>
                </div>`
              : nothing}
            ${this._settingsOpen ? this._timeRow("mdi:clock-outline", "Baño hoy a las", readyAt) : nothing}
            ${this._settingsOpen ? this._timeRow("mdi:clock-end", "Baño hasta", until) : nothing}
            ${this._settingsOpen ? this._timeRow("mdi:briefcase-outline", "Laborables", workday) : nothing}
            ${this._settingsOpen ? this._timeRow("mdi:party-popper", "Festivos y finde", holiday) : nothing}
          </div>`
        : nothing}
    `;
  }

  private _togglePlanner = (): void => {
    if (!this.config.planner) return;
    this.hass.callService("input_boolean", "toggle", { entity_id: this.config.planner });
  };

  private _answer(script: string, respuesta: Answer): void {
    const c = answerCall(script, respuesta, this.hass.user?.name);
    this.hass.callService(c.domain, c.service, c.data);
  }

  private _setUsage(option: string): void {
    if (!this.config.usage) return;
    this.hass.callService("input_select", "select_option", { entity_id: this.config.usage, option });
  }

  private _toggleSettings = (): void => {
    this._settingsOpen = !this._settingsOpen;
  };

  private _timeRow(icon: string, label: string, view: { entity: string; value: string } | null): TemplateResult | typeof nothing {
    if (!view) return nothing;
    return html`<div class="setting">
      <ha-icon icon=${icon}></ha-icon>
      <span class="setting-label">${label}</span>
      <div class="pill">
        <input class="ready-time" type="time" step="900" .value=${view.value} @change=${(e: Event) => this._setTime(view.entity, e)} />
      </div>
    </div>`;
  }

  private _setTime(entity: string, e: Event): void {
    const v = (e.target as HTMLInputElement).value;
    if (!/^\d{2}:\d{2}$/.test(v)) return;
    this.hass.callService("input_datetime", "set_datetime", { entity_id: entity, time: `${v}:00` });
  }

  private _stepMaintenance(dir: number): void {
    const m = maintenanceView(this._states, this.config);
    if (!m || m.value === null) return;
    const next = clampTarget(m.value + dir * m.step, m.min, m.max, m.step);
    if (next === m.value) return;
    this.hass.callService("input_number", "set_value", { entity_id: m.entity, value: next });
  }

  private _openMoreInfo(entityId?: string): void {
    if (!entityId || !this.hass?.states[entityId]) return;
    fireEvent(this, "hass-more-info", { entityId });
  }

  // --- arrastre del dial ---
  private _svg(): SVGElement | null {
    return this.renderRoot.querySelector("svg.dial") as SVGElement | null;
  }

  private _onPointerDown(e: PointerEvent): void {
    if (availability(this._states, this.config) !== "ok") return;
    const svgEl = this._svg();
    if (!svgEl) return;
    const rect = svgEl.getBoundingClientRect();
    if (!rect.width) return;
    const dx = e.clientX - (rect.left + rect.width / 2);
    const dy = e.clientY - (rect.top + rect.height / 2);
    if (!isNearHandle(dx, dy, rect.width / 200, this._valueAngle)) return;
    e.preventDefault();
    this._dragging = true;
    this._dragPointerId = e.pointerId;
    try {
      svgEl.setPointerCapture(e.pointerId);
    } catch (_) {
      /* noop */
    }
    window.addEventListener("pointermove", this._boundMove);
    window.addEventListener("pointerup", this._boundUp);
    window.addEventListener("pointercancel", this._boundUp);
  }

  private _onPointerMove(e: PointerEvent): void {
    if (!this._dragging || e.pointerId !== this._dragPointerId) return;
    if (e.cancelable) e.preventDefault();
    const svgEl = this._svg();
    if (!svgEl) return;
    const rect = svgEl.getBoundingClientRect();
    const angle = pointerAngle(e.clientX - (rect.left + rect.width / 2), e.clientY - (rect.top + rect.height / 2));
    const { min, max, step } = targetSource(this._states, this.config);
    this._dragTemp = valueFromAngle(angle, min, max, step);
  }

  private _onPointerUp(e: PointerEvent): void {
    // un segundo dedo que se levanta no termina el arrastre del primero
    if (!this._dragging || e.pointerId !== this._dragPointerId) return;
    this._dragging = false;
    this._removeWindowListeners();
    if (this._dragPointerId !== null) {
      try {
        this._svg()?.releasePointerCapture(this._dragPointerId);
      } catch (_) {
        /* noop */
      }
      this._dragPointerId = null;
    }
    const src = targetSource(this._states, this.config);
    const shown = pendingTarget(this._pendingFor(src.entity), src.value, Date.now()) ?? src.value;
    const send = dragResult(this._dragTemp, shown, availability(this._states, this.config) === "ok");
    if (send !== null) this._sendTarget(send);
    this._dragTemp = null;
  }

  private _removeWindowListeners(): void {
    window.removeEventListener("pointermove", this._boundMove);
    window.removeEventListener("pointerup", this._boundUp);
    window.removeEventListener("pointercancel", this._boundUp);
  }

  static styles = css`
    ha-card {
      padding: 12px 12px 16px;
      color: var(--primary-text-color);
    }
    .warn {
      padding: 16px;
      color: var(--error-color, #db4437);
    }
    .header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 2px 4px 0;
    }
    .title {
      display: flex;
      align-items: center;
      gap: 6px;
      font-size: 1.05rem;
      font-weight: 500;
      color: var(--secondary-text-color);
    }
    .title ha-icon {
      --mdc-icon-size: 20px;
    }
    button.power {
      display: flex;
      align-items: center;
      gap: 2px;
      border: none;
      background: transparent;
      color: var(--secondary-text-color);
      font-size: 0.9rem;
      cursor: pointer;
      font-variant-numeric: tabular-nums;
    }
    button.power ha-icon {
      --mdc-icon-size: 16px;
    }

    .dial-wrap {
      position: relative;
      width: 100%;
      max-width: 300px;
      margin: 4px auto 0;
      aspect-ratio: 1 / 1;
    }
    .dial {
      width: 100%;
      height: 100%;
      touch-action: none;
    }
    .track {
      fill: none;
      stroke: var(--divider-color, #38393d);
      stroke-width: 18;
      stroke-linecap: round;
    }
    .glow {
      fill: none;
      stroke-width: 18;
      stroke-linecap: round;
      opacity: 0.45;
      filter: blur(6px);
    }
    .value {
      fill: none;
      stroke-width: 18;
      stroke-linecap: round;
    }
    .handle {
      fill: #fff;
      stroke-width: 3;
      cursor: grab;
      filter: drop-shadow(0 1px 2px rgba(0, 0, 0, 0.5));
    }
    .handle.pulse {
      animation: pulse 1.6s ease-in-out infinite;
    }
    @keyframes pulse {
      0%,
      100% {
        stroke-width: 3;
      }
      50% {
        stroke-width: 6;
      }
    }
    .dial-center {
      position: absolute;
      inset: 0;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      gap: 2px;
      pointer-events: none;
      text-align: center;
      padding: 0 22%;
    }
    .center-tap {
      display: flex;
      flex-direction: column;
      align-items: center;
    }
    .mode-name {
      font-size: 1.05rem;
      color: var(--accent);
      font-weight: 600;
    }
    .target {
      display: flex;
      align-items: flex-start;
      line-height: 1;
    }
    .target .int {
      font-size: 3.6rem;
      font-weight: 300;
      letter-spacing: -1px;
    }
    .target .unit {
      font-size: 1.05rem;
      color: var(--secondary-text-color);
      margin-top: 8px;
      margin-left: 2px;
    }
    .current {
      font-size: 0.95rem;
      color: var(--accent);
      display: flex;
      align-items: center;
      gap: 3px;
    }
    .current ha-icon,
    .item ha-icon,
    .chip ha-icon {
      --mdc-icon-size: 16px;
    }
    .clickable {
      cursor: pointer;
      pointer-events: auto;
    }
    .adjust {
      display: flex;
      gap: 24px;
      margin-top: 8px;
      pointer-events: auto;
    }
    button.round {
      border: 2px solid var(--divider-color, #46494d);
      border-radius: 50%;
      width: 44px;
      height: 44px;
      cursor: pointer;
      background: transparent;
      color: var(--primary-text-color);
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .unavail-icon {
      --mdc-icon-size: 36px;
      color: var(--secondary-text-color);
    }
    .unavail-title {
      font-size: 1.1rem;
      font-weight: 600;
    }
    .unavail-detail {
      font-size: 0.85rem;
      color: var(--secondary-text-color);
    }

    .info {
      display: flex;
      justify-content: center;
      flex-wrap: wrap;
      gap: 14px;
      margin-top: 4px;
      font-size: 0.92rem;
      color: var(--secondary-text-color);
    }
    .item {
      display: inline-flex;
      align-items: center;
      gap: 4px;
    }
    .warnings {
      display: flex;
      justify-content: center;
      margin-top: 6px;
    }
    .chip {
      display: inline-flex;
      align-items: center;
      gap: 4px;
      font-size: 0.85rem;
      padding: 2px 10px;
      border-radius: 12px;
      color: #fff;
    }
    .chip.ready {
      background: #43a047;
    }
    .chip.error {
      background: var(--error-color, #db4437);
    }

    .bar {
      display: flex;
      gap: 8px;
      margin-top: 10px;
    }
    .modes {
      flex: 1;
      display: flex;
      gap: 6px;
      background: var(--secondary-background-color, #2a2a2a);
      border-radius: 14px;
      padding: 4px;
    }
    .mode,
    .bubbles {
      flex: 1;
      border: none;
      background: transparent;
      color: var(--secondary-text-color);
      padding: 8px;
      border-radius: 10px;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .bubbles {
      flex: 0 0 56px;
      background: var(--secondary-background-color, #2a2a2a);
      border-radius: 14px;
    }
    .mode.active {
      background: var(--mode-color);
      color: #fff;
    }
    .bubbles.active {
      background: #26a69a;
      color: #fff;
    }
    .mode:disabled,
    .bubbles:disabled {
      opacity: 0.35;
      cursor: default;
    }

    /* PLANIFICADOR (v0.2.0) */
    /* Cabecera en tres columnas: nombre | botón del planificador centrado | potencia (v0.2.1) */
    .header {
      display: grid;
      grid-template-columns: 1fr auto 1fr;
      gap: 6px;
    }
    .title {
      min-width: 0;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
    .header-center {
      display: flex;
      justify-content: center;
    }
    .header-right {
      display: flex;
      justify-content: flex-end;
      align-items: center;
      gap: 4px;
    }
    button.planner-toggle {
      display: flex;
      align-items: center;
      gap: 4px;
      border: 1px solid var(--divider-color, #46494d);
      border-radius: 14px;
      background: transparent;
      color: var(--secondary-text-color);
      padding: 2px 10px;
      font-size: 0.8rem;
      cursor: pointer;
    }
    button.planner-toggle ha-icon {
      --mdc-icon-size: 16px;
    }
    button.planner-toggle.on {
      border-color: transparent;
      background: var(--primary-color, #03a9f4);
      color: #fff;
    }
    .grid-extra {
      color: #26a69a;
    }
    button.power {
      white-space: nowrap;
    }
    .caption {
      font-size: 0.78rem;
      color: var(--secondary-text-color);
      margin-top: -2px;
    }
    .plan {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 6px;
      margin-top: 8px;
      font-size: 0.88rem;
      color: var(--primary-text-color);
      text-align: center;
    }
    .plan ha-icon {
      --mdc-icon-size: 16px;
      color: var(--accent);
      flex: 0 0 auto;
    }
    .plan.observing {
      color: var(--secondary-text-color);
      font-style: italic;
    }
    .plan.observing ha-icon {
      color: var(--secondary-text-color);
    }
    .answer {
      display: flex;
      gap: 6px;
      margin-top: 8px;
    }
    .answer button {
      flex: 1;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 4px;
      border: 1px solid var(--divider-color, #444);
      background: var(--secondary-background-color, #2a2a2a);
      color: var(--primary-text-color);
      padding: 6px 4px;
      border-radius: 9px;
      cursor: pointer;
      font-size: 0.85rem;
    }
    .answer button.heat {
      /* Naranja de calor fijo: el --accent es gris con el jacuzzi apagado y parecería desactivado */
      border-color: var(--state-climate-heat-color, #ff8100);
      color: var(--state-climate-heat-color, #ff8100);
    }
    .answer ha-icon {
      --mdc-icon-size: 16px;
    }
    .usage {
      display: flex;
      gap: 4px;
      margin-top: 8px;
      background: var(--secondary-background-color, #2a2a2a);
      border-radius: 12px;
      padding: 3px;
    }
    .usage button {
      flex: 1;
      border: none;
      background: transparent;
      color: var(--secondary-text-color);
      padding: 6px 4px;
      border-radius: 9px;
      cursor: pointer;
      font-size: 0.85rem;
    }
    .usage button.active {
      background: var(--primary-color, #03a9f4);
      color: #fff;
    }
    .settings {
      margin-top: 8px;
      background: var(--secondary-background-color, #2a2a2a);
      border-radius: 12px;
      padding: 2px 10px;
    }
    .setting {
      display: flex;
      align-items: center;
      gap: 10px;
      min-height: 40px;
      font-size: 0.85rem;
      color: var(--secondary-text-color);
    }
    .settings-toggle {
      display: flex;
      align-items: center;
      gap: 10px;
      width: 100%;
      min-height: 36px;
      padding: 0;
      border: none;
      background: transparent;
      font: inherit;
      font-size: 0.85rem;
      color: var(--secondary-text-color);
      cursor: pointer;
      text-align: left;
    }
    .settings-toggle > ha-icon {
      --mdc-icon-size: 18px;
    }
    .settings-toggle .chevron {
      transition: transform 0.2s ease;
    }
    .settings.open .settings-toggle .chevron {
      transform: rotate(180deg);
    }
    .settings-toggle + .setting,
    .setting + .setting {
      border-top: 1px solid var(--divider-color, rgba(255, 255, 255, 0.08));
    }
    .setting > ha-icon {
      --mdc-icon-size: 18px;
    }
    .setting-label {
      flex: 1;
      color: var(--primary-text-color);
    }
    .pill {
      display: flex;
      align-items: center;
      gap: 2px;
      background: var(--card-background-color, #1c1c1c);
      border-radius: 9px;
      padding: 3px;
    }
    .pill-btn {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 30px;
      height: 26px;
      border: none;
      border-radius: 7px;
      background: transparent;
      color: var(--secondary-text-color);
      cursor: pointer;
    }
    .pill-btn:hover {
      background: var(--secondary-background-color, #2a2a2a);
    }
    .pill-btn ha-icon {
      --mdc-icon-size: 16px;
    }
    .pill-value {
      min-width: 46px;
      text-align: center;
      color: var(--primary-text-color);
      font-variant-numeric: tabular-nums;
    }
    input.ready-time {
      font: inherit;
      color: var(--primary-text-color);
      background: transparent;
      border: none;
      padding: 3px 6px;
      color-scheme: light dark;
      font-variant-numeric: tabular-nums;
    }
  `;
}

declare global {
  interface HTMLElementTagNameMap {
    "lay-z-spa-card": LayZSpaCard;
  }
}
