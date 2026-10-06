# Lay-Z-Spa Card v0.2.0 (planificador) — plan de implementación

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Que la tarjeta muestre y controle el planificador del jacuzzi: selector de uso, dial que edita la temperatura deseada o la de mantenimiento, motivo del plan (con red y modo observar), mantenimiento editable y extra de red en la cabecera.

**Architecture:** La lógica nueva va en un módulo puro `src/planner.ts` (sin Lit), probado con vitest: de qué entidad sale el objetivo del dial y con qué servicio se escribe, qué muestra la línea del plan, el selector y el mantenimiento. La tarjeta solo pinta esos resultados. Todas las claves nuevas son opcionales: sin ellas, la tarjeta se comporta como la 0.1.1.

**Tech Stack:** TypeScript 5, Lit 3, Rollup, vitest (como la 0.1.x).

**Spec:** `D:/0-Proyectos/Domotica/Homeassistant/Jacuzzi/docs/superpowers/specs/2026-10-06-jacuzzi-solar-design.md` §6, más dos añadidos aprobados por el usuario el 2026-10-06: indicativo de "modo observar" en la línea del plan y extra de red en la cabecera.

## Global Constraints

- Repo `D:\0-Proyectos\Domotica\Homeassistant\Componentes Visuales\lay-z-spa-card`, autor `serweck <serweck@gmail.com>`, rama `feat/v020`. Commits terminan con `Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>`.
- Claves nuevas (opcionales): `usage` (input_select No/Hoy/Siempre), `desired` (input_number), `maintenance` (input_number), `plan` (sensor con JSON `{a,t,r,n,m,h,l,v}`), `planner` (input_boolean), `observe` (input_boolean), `grid_extra` (sensor W).
- Por defecto: `input_select.jacuzzi_uso`, `input_number.jacuzzi_temp_deseada`, `input_number.jacuzzi_temp_mantenimiento`, `sensor.jacuzzi_plan`, `input_boolean.jacuzzi_planificador`, `input_boolean.jacuzzi_planificador_observar`, `sensor.jacuzzi_extra_red`.
- **Planificador activo** = `planner`, `usage`, `desired` y `maintenance` configurados y `planner` = `on`. Entonces el dial y −/+ escriben en `desired` (uso Hoy/Siempre) o `maintenance` (uso No) con `input_number.set_value`; si no, en el climate como en 0.1.1.
- Textos solo en español. Versión `0.2.0`.
- Publicar en GitHub (`serweck/lay-z-spa-card`, ya existe) con el token de `serweck` sin cambiar la cuenta activa de `gh`; instalar por HACS.

## Review Focus

1. **Cambiar el uso con un objetivo pendiente** (pulsas + y en seguida cambias de Hoy a No): el valor pendiente de la deseada no debe mostrarse como mantenimiento ni enviarse a la otra entidad. Test en Task 1 (la clave del pendiente incluye la entidad) y comprobación en Task 2.
2. **`sensor.jacuzzi_plan` sin JSON** (`unknown` al arrancar HA): no hay línea de plan, sin errores. Test en Task 1.
3. **Helper de temperatura sin dato o con límites raros** (`min ≥ max`): rango por defecto y "--", nunca NaN. Test en Task 1.
4. **Planificador apagado**: la tarjeta vuelve exactamente al comportamiento 0.1.1 (dial al climate). Test en Task 1.
5. **Uso con valores que no son No/Hoy/Siempre** (opciones cambiadas en el helper): el selector pinta las opciones reales del `input_select`. Test en Task 1.

---

### Task 1: `src/planner.ts` (lógica pura)

**Files:**
- Modify: `src/types.ts`, `src/const.ts`
- Create: `src/planner.ts`
- Test: `test/planner.test.ts`

**Interfaces:**
- Produces:
  - `type TargetSource = { kind: "climate" | "helper"; entity: string; value: number | null; min: number; max: number; step: number; caption: string | null }`
  - `plannerActive(states, cfg): boolean`
  - `targetSource(states, cfg): TargetSource`
  - `targetCall(src: TargetSource, value: number): { domain: string; service: string; data: Record<string, unknown> }`
  - `type PlanView = { text: string; heating: boolean; grid: boolean; observing: boolean; rule: number }`; `planView(states, cfg): PlanView | null`
  - `usageView(states, cfg): { current: string; options: string[] } | null`
  - `maintenanceView(states, cfg): { entity: string; value: number | null; min: number; max: number; step: number } | null`
  - `gridExtraW(states, cfg): number | null` (solo > 0)

- [ ] **Step 1: Tipos y entidades por defecto**

`src/types.ts`: añadir a `LayZSpaCardConfig` (antes del cierre de la interfaz):
```ts
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
```

`src/const.ts`: `CARD_VERSION = "0.2.0"` y añadir a `DEFAULT_ENTITIES`:
```ts
  usage: "input_select.jacuzzi_uso",
  desired: "input_number.jacuzzi_temp_deseada",
  maintenance: "input_number.jacuzzi_temp_mantenimiento",
  plan: "sensor.jacuzzi_plan",
  planner: "input_boolean.jacuzzi_planificador",
  observe: "input_boolean.jacuzzi_planificador_observar",
  grid_extra: "sensor.jacuzzi_extra_red",
```

- [ ] **Step 2: Tests (fallan)**

`test/planner.test.ts`:
```ts
import { describe, it, expect } from "vitest";
import { plannerActive, targetSource, targetCall, planView, usageView, maintenanceView, gridExtraW } from "../src/planner";
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
    expect(planView(base(), cfg)).toEqual({ text: "Precalentando en valle hasta 34 °C", heating: true, grid: true, observing: false, rule: 4 });
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

describe("gridExtraW", () => {
  it("solo si es mayor que 0", () => {
    expect(gridExtraW(base(), cfg)).toBe(1950);
    expect(gridExtraW(base({ "sensor.extra": s("0") }), cfg)).toBeNull();
    expect(gridExtraW(base({ "sensor.extra": s("unavailable") }), cfg)).toBeNull();
  });
});
```

Run: `npx vitest run test/planner.test.ts` → Expected: FAIL (`Failed to load url ../src/planner`).

- [ ] **Step 3: `src/planner.ts`**

```ts
import type { LayZSpaCardConfig } from "./types";
import { dialRange, isValid, numberOf, toNumber, type States } from "./status";

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

function usesNight(states: States, cfg: LayZSpaCardConfig): boolean {
  return !!cfg.usage && NIGHT_USES.includes(states[cfg.usage]?.state ?? "");
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

export type PlanView = { text: string; heating: boolean; grid: boolean; observing: boolean; rule: number };

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
    grid: p.r === true,
    observing: !!cfg.observe && states[cfg.observe]?.state === "on",
    rule: Number(p.n ?? -1),
  };
}

export function usageView(states: States, cfg: LayZSpaCardConfig): { current: string; options: string[] } | null {
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

export function gridExtraW(states: States, cfg: LayZSpaCardConfig): number | null {
  const w = numberOf(cfg.grid_extra ? states[cfg.grid_extra] : undefined);
  return w !== null && w > 0 ? w : null;
}
```

- [ ] **Step 4: Ejecutar**

Run: `npm test` → Expected: PASS (las 56 anteriores y las nuevas). `npx tsc --noEmit` sin errores.

- [ ] **Step 5: Commit** — `feat: logica pura del planificador para la tarjeta`

---

### Task 2: Tarjeta, editor, preview y documentación

**Files:**
- Modify: `src/lay-z-spa-card.ts`, `src/editor.ts`, `preview.html`, `README.md`, `CHANGELOG.md`, `package.json` (versión `0.2.0`), `dist/lay-z-spa-card.js`

**Interfaces:**
- Consumes: todo `src/planner.ts` (Task 1).

- [ ] **Step 1: La tarjeta usa `targetSource`**

En `src/lay-z-spa-card.ts`:
- Importar `targetSource, targetCall, planView, usageView, maintenanceView, gridExtraW` de `./planner`.
- Nuevo estado `@state() private _pendingEntity: string | null = null;`. El pendiente solo vale para su entidad: en todos los sitios donde se llama a `pendingTarget(this._pending, …)`, pasar `this._pendingEntity === src.entity ? this._pending : null`.
- `render()`: sustituir `dialRange(climate.attributes)`/`toNumber(climate.attributes.temperature)` por `const src = targetSource(states, this.config)` y usar `src.min/max/value`.
- `_sendTarget(value)`: `const src = targetSource(…)`; `this._pending = { value, at: Date.now() }; this._pendingEntity = src.entity;` y `const c = targetCall(src, value); this.hass.callService(c.domain, c.service, c.data);`.
- `_step`, `_onPointerMove`, `_onPointerUp`: usar `src` en vez del climate para rango, valor actual y pendiente.
- `_renderCenter`: si `src.caption`, una línea pequeña bajo el número con el texto `src.caption` (clase `caption`).

- [ ] **Step 2: Línea del plan, selector de uso, mantenimiento y extra de red**

- Cabecera: si `gridExtraW(...)` no es null, junto al consumo un chip `🔌 +1.950 W` (`mdi:transmission-tower-import`, clase `grid-extra`, clic → more-info de `grid_extra`).
- Tras `_renderInfo()` y solo si la tarjeta está disponible:
  - `planView`: línea con icono `mdi:robot` (o `mdi:eye` si `observing`) y el texto; si `grid`, sufijo `· red`; si `observing`, prefijo `Observando:` y estilo atenuado (clase `plan observing`). Clic → more-info de `plan`.
  - `usageView`: botones segmentados con `options`; activo = `current`; clic → `input_select.select_option` (`option`). Clase `usage`.
  - `maintenanceView`: fila pequeña `Mantenimiento 30 °C [−][+]`; −/+ → `input_number.set_value` con `clampTarget(value ± step, min, max, step)`.
- CSS para `caption`, `grid-extra`, `plan`, `plan.observing`, `usage`, `usage button.active`, `maint` (mismo lenguaje visual que `.modes`/`.chip`).

- [ ] **Step 3: Editor**

Añadir al `SCHEMA` y `LABELS` de `src/editor.ts`: `usage` (input_select), `desired`/`maintenance` (input_number), `plan` (sensor), `planner`/`observe` (input_boolean), `grid_extra` (sensor) con etiquetas en español.

- [ ] **Step 4: Build y preview**

`npx tsc --noEmit && npm run build` sin errores. En `preview.html`, añadir al `CONFIG` las claves nuevas y a los estados simulados los helpers, el plan y el extra; nuevos escenarios: "Planificador (Hoy, valle con red)", "Planificador observando", "Planificador apagado (como 0.1.1)". El `callService` simulado debe tratar `input_number.set_value` e `input_select.select_option`. Revisar en Chrome:
- con planificador, el dial muestra la deseada con la leyenda "deseada"; −/+ envía `input_number.set_value`;
- el selector cambia el uso y el dial pasa a "mantenimiento" (sin arrastrar el pendiente de la deseada);
- la línea del plan con `· red` y el chip `🔌 +1.950 W`;
- en "observando", el texto atenuado con "Observando:";
- planificador apagado = 0.1.1.

- [ ] **Step 5: Documentación y commit**

README: tabla de claves nuevas y explicación del modo planificador. CHANGELOG `[0.2.0]`. `package.json` → `0.2.0`. Commit `feat: tarjeta v0.2.0 con el planificador`.

---

### Task 3: Publicación y despliegue

- [ ] **Step 1:** Fusionar `feat/v020` en `master`; `git push`, tag `v0.2.0`, release con `dist/lay-z-spa-card.js` (token de `serweck`, sin cambiar la cuenta activa).
- [ ] **Step 2:** HACS: `hacs/repository/refresh` + `hacs/repository/download` `v0.2.0`; recargar y comprobar que se carga el código nuevo.
- [ ] **Step 3:** Añadir las 7 claves nuevas a la tarjeta del Home del Resumen y a la de la pestaña Jacuzzi de Serweck (copia de los dashboards en `localStorage` antes de guardar).
- [ ] **Step 4:** Prueba real en HA, **sin tocar el jacuzzi** (el planificador sigue en observar): el dial muestra la deseada; −/+ cambia `input_number.jacuzzi_temp_deseada` (y se devuelve a 37); el selector cambia el uso (y se devuelve a `No`); la línea dice "Observando: …".
- [ ] **Step 5:** Notas de Obsidian (ES/EN) de la tarjeta: release v0.2.0.
