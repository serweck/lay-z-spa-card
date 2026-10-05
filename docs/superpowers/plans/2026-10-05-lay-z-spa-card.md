# Lay-Z-Spa Card — plan de implementación

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Tarjeta Lovelace `custom:lay-z-spa-card` para gestionar el jacuzzi (dial de temperatura, modos, burbujas, ambiente, tiempo hasta listo, consumo y avisos de disponibilidad).

**Architecture:** Repositorio nuevo con la estructura de `aerothermal-temperature-control` (TypeScript + Lit 3 + Rollup → un único `dist/lay-z-spa-card.js`). Toda la lógica de decisión (disponibilidad, formatos, geometría del dial, detección de entidades) vive en módulos puros sin Lit ni DOM, probados con vitest; la tarjeta solo pinta y llama a servicios de HA.

**Tech Stack:** TypeScript 5, Lit 3, custom-card-helpers 1.9, Rollup 4, vitest 2, Node 22.

**Spec:** `docs/superpowers/specs/2026-10-05-lay-z-spa-card-design.md`

## Global Constraints

- Repositorio: `D:\0-Proyectos\Domotica\Homeassistant\Componentes Visuales\lay-z-spa-card`; autor de los commits `serweck <serweck@gmail.com>` (ya configurado en local).
- Commits terminan con `Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>`.
- Tag del elemento: `lay-z-spa-card`; editor: `lay-z-spa-card-editor`; versión `0.1.0`.
- Textos de la interfaz solo en español.
- Dial 20–40 °C, paso 1 (leídos de `min_temp`/`max_temp`/`target_temp_step`, con esos valores por defecto).
- Modos `off` / `fan_only` / `heat`; burbujas con `switch.toggle`, nunca como modo.
- El objetivo se envía **una vez al soltar** el arrastre; −/+ envían un paso por pulsación.
- Umbral del diferencial: `RCD_POWER_THRESHOLD_W = 1` (W).
- Consumo: W sin decimales con separador de miles `.` (`1.942 W`).
- El enchufe Shelly es solo lectura: la tarjeta nunca llama a `switch.jacuzzi`.
- Nada se publica en GitHub ni se instala por HACS sin permiso explícito del usuario (Task 7).
- Antes de guardar cualquier dashboard, copia en `localStorage` del navegador.

## Review Focus

1. **Shelly sin dato** (`switch.jacuzzi` `unavailable` porque el Shelly perdió el WiFi) con la placa conectada → la tarjeta debe seguir funcionando con normalidad, no decir "Sin corriente". Test en Task 1.
2. **`time_to_ready` absurdo** (`unavailable`, 0, negativo o cientos de horas, que la placa da al principio) → no mostrar "NaN" ni "412 h"; se oculta el "Listo en". Test en Task 1.
3. **`current_temperature` nulo** en el climate → `Number(null)` es `0` y pintaría "0 °C"; debe tratarse como "sin dato". Test en Task 1 (`toNumber`).
4. **Arrastre por la zona muerta inferior** del dial o más allá de los extremos → el objetivo queda en 20 o 40, nunca fuera de rango. Test en Task 2.
5. **Climate con atributos raros** (sin `min_temp`, o `min_temp ≥ max_temp`) → rango por defecto 20–40 en vez de dividir por cero. Test en Task 1.

---

## File Structure

```
lay-z-spa-card/
├── package.json · tsconfig.json · rollup.config.js · vitest.config.ts · hacs.json · LICENSE · .gitignore
├── src/
│   ├── const.ts          # versión, tags, entidades por defecto, umbral
│   ├── types.ts          # LayZSpaCardConfig, EntityKey
│   ├── status.ts         # puro: toNumber, availability, AVAILABILITY_TEXT, errorCode,
│   │                     #   formatHours, formatPower, readyView, dialRange
│   ├── dial.ts           # puro: geometría del arco, clampTarget, ángulo↔valor, hit-test
│   ├── detect.ts         # puro: detectEntities (para getStubConfig)
│   ├── editor.ts         # editor visual (ha-form)
│   └── lay-z-spa-card.ts # la tarjeta (Lit)
├── test/status.test.ts · test/dial.test.ts · test/detect.test.ts
├── preview.html          # hass simulado con los 7 escenarios
├── dist/lay-z-spa-card.js
└── README.md · CHANGELOG.md
```

---

### Task 1: Proyecto base y `status.ts`

**Files:**
- Create: `package.json`, `tsconfig.json`, `rollup.config.js`, `vitest.config.ts`, `hacs.json`, `LICENSE`
- Create: `src/const.ts`, `src/types.ts`, `src/status.ts`
- Test: `test/status.test.ts`

**Interfaces:**
- Produces:
  - `types.ts`: `interface LayZSpaCardConfig { type: string; name?: string; climate: string; bubbles?: string; heater?: string; ready?: string; time_to_ready?: string; ambient?: string; error?: string; connection?: string; power_switch?: string; power?: string; energy_today?: string }`, `type EntityKey = Exclude<keyof LayZSpaCardConfig, "type" | "name">`
  - `const.ts`: `CARD_VERSION`, `CARD_TAG`, `EDITOR_TAG`, `RCD_POWER_THRESHOLD_W`, `DEFAULT_ENTITIES: Record<EntityKey, string>`
  - `status.ts`: `EntityState`, `States`, `toNumber(v: unknown): number | null`, `isValid(e?): e is EntityState`, `numberOf(e?): number | null`, `type Availability = "ok" | "no_power" | "rcd_tripped" | "board_offline"`, `availability(states, cfg): Availability`, `AVAILABILITY_TEXT: Record<Exclude<Availability,"ok">, {icon,title,detail}>`, `errorCode(states, cfg): string | null`, `formatHours(h: number): string`, `formatPower(w: number): string`, `type ReadyView`, `readyView(states, cfg): ReadyView`, `dialRange(attrs): {min,max,step}`

- [ ] **Step 1: Ficheros de proyecto**

`package.json`:
```json
{
  "name": "lay-z-spa-card",
  "version": "0.1.0",
  "description": "Tarjeta Lovelace para gestionar un jacuzzi Lay-Z-Spa (firmware visualapproach) en Home Assistant",
  "type": "module",
  "main": "dist/lay-z-spa-card.js",
  "scripts": {
    "build": "rollup -c",
    "watch": "rollup -c --watch",
    "typecheck": "tsc --noEmit",
    "test": "vitest run",
    "preview": "http-server . -p 8765 -c-1 --cors"
  },
  "keywords": ["home-assistant", "lovelace", "custom-card", "lay-z-spa", "jacuzzi", "hot-tub"],
  "author": "Serweck",
  "license": "MIT",
  "dependencies": {
    "custom-card-helpers": "^1.9.0",
    "lit": "^3.1.2"
  },
  "devDependencies": {
    "@rollup/plugin-json": "^6.1.0",
    "@rollup/plugin-node-resolve": "^15.2.3",
    "@rollup/plugin-terser": "^0.4.4",
    "@rollup/plugin-typescript": "^11.1.6",
    "http-server": "^14.1.1",
    "rollup": "^4.13.0",
    "tslib": "^2.6.2",
    "typescript": "^5.4.5",
    "vitest": "^2.1.0"
  }
}
```

`tsconfig.json`:
```json
{
  "compilerOptions": {
    "target": "ES2020",
    "module": "ESNext",
    "moduleResolution": "node",
    "experimentalDecorators": true,
    "useDefineForClassFields": false,
    "strict": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "lib": ["ES2020", "DOM", "DOM.Iterable"]
  },
  "include": ["src/**/*.ts"]
}
```

`rollup.config.js`:
```js
import resolve from "@rollup/plugin-node-resolve";
import typescript from "@rollup/plugin-typescript";
import json from "@rollup/plugin-json";
import terser from "@rollup/plugin-terser";

export default {
  input: "src/lay-z-spa-card.ts",
  output: {
    file: "dist/lay-z-spa-card.js",
    format: "es",
    inlineDynamicImports: true,
    sourcemap: false,
  },
  plugins: [
    resolve(),
    json(),
    typescript({ tsconfig: "./tsconfig.json" }),
    terser({ format: { comments: false } }),
  ],
};
```

`vitest.config.ts`:
```ts
import { defineConfig } from "vitest/config";

export default defineConfig({
  test: { include: ["test/**/*.test.ts"], environment: "node" },
});
```

`hacs.json`:
```json
{
  "name": "Lay-Z-Spa Card",
  "render_readme": true,
  "filename": "lay-z-spa-card.js"
}
```

`LICENSE`: texto MIT estándar con `Copyright (c) 2026 serweck` (mismo texto que `../aerothermal-temperature-control/LICENSE`; cópialo con `cp`).

- [ ] **Step 2: `src/types.ts` y `src/const.ts`**

`src/types.ts`:
```ts
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
```

`src/const.ts`:
```ts
import type { EntityKey } from "./types";

export const CARD_VERSION = "0.1.0";
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
};
```

- [ ] **Step 3: Instalar dependencias**

Run: `npm install`
Expected: termina sin errores (avisos de `npm audit` aceptables).

- [ ] **Step 4: Escribir los tests de `status.ts` (fallan)**

`test/status.test.ts`:
```ts
import { describe, it, expect } from "vitest";
import {
  toNumber,
  availability,
  AVAILABILITY_TEXT,
  errorCode,
  formatHours,
  formatPower,
  readyView,
  dialRange,
  type States,
} from "../src/status";
import type { LayZSpaCardConfig } from "../src/types";

const cfg: LayZSpaCardConfig = {
  type: "custom:lay-z-spa-card",
  climate: "climate.spa",
  connection: "binary_sensor.conn",
  power_switch: "switch.plug",
  power: "sensor.w",
  error: "sensor.err",
  ready: "binary_sensor.ready",
  time_to_ready: "sensor.ttr",
};
const s = (state: string, attributes: Record<string, unknown> = {}) => ({ state, attributes });
function base(over: States = {}): States {
  return {
    "climate.spa": s("heat", {
      temperature: 37,
      current_temperature: 27,
      min_temp: 20,
      max_temp: 40,
      target_temp_step: 1,
      hvac_modes: ["fan_only", "off", "heat"],
    }),
    "binary_sensor.conn": s("on"),
    "switch.plug": s("on"),
    "sensor.w": s("1942"),
    "sensor.err": s("0"),
    "binary_sensor.ready": s("off"),
    "sensor.ttr": s("9.8333"),
    ...over,
  };
}

describe("toNumber", () => {
  it("convierte numeros y textos numericos", () => {
    expect(toNumber("23.4")).toBe(23.4);
    expect(toNumber(0)).toBe(0);
  });
  it("devuelve null para nulo, vacio y texto", () => {
    expect(toNumber(null)).toBeNull();
    expect(toNumber(undefined)).toBeNull();
    expect(toNumber("")).toBeNull();
    expect(toNumber("abc")).toBeNull();
  });
});

describe("availability", () => {
  it("ok con todo conectado", () => {
    expect(availability(base(), cfg)).toBe("ok");
  });
  it("no_power si el enchufe esta apagado", () => {
    expect(
      availability(base({ "switch.plug": s("off"), "binary_sensor.conn": s("off") }), cfg)
    ).toBe("no_power");
  });
  it("rcd_tripped si la placa cae y no hay consumo", () => {
    expect(
      availability(base({ "binary_sensor.conn": s("off"), "sensor.w": s("0") }), cfg)
    ).toBe("rcd_tripped");
    expect(
      availability(base({ "binary_sensor.conn": s("off"), "sensor.w": s("0.4") }), cfg)
    ).toBe("rcd_tripped");
  });
  it("board_offline si la placa cae con la bomba en reposo (2,8 W)", () => {
    expect(
      availability(base({ "binary_sensor.conn": s("off"), "sensor.w": s("2.8") }), cfg)
    ).toBe("board_offline");
  });
  it("board_offline si la placa cae y la potencia no tiene dato", () => {
    expect(
      availability(base({ "binary_sensor.conn": s("off"), "sensor.w": s("unavailable") }), cfg)
    ).toBe("board_offline");
  });
  it("Shelly sin dato no es 'sin corriente' si la placa esta conectada", () => {
    expect(availability(base({ "switch.plug": s("unavailable") }), cfg)).toBe("ok");
  });
  it("board_offline si el climate no esta disponible aunque connection diga on", () => {
    expect(availability(base({ "climate.spa": s("unavailable") }), cfg)).toBe("board_offline");
  });
  it("sin Shelly configurado, placa caida es board_offline", () => {
    const min: LayZSpaCardConfig = { type: "x", climate: "climate.spa", connection: "binary_sensor.conn" };
    expect(availability(base({ "binary_sensor.conn": s("off") }), min)).toBe("board_offline");
  });
  it("solo con climate, climate caido es board_offline", () => {
    const min: LayZSpaCardConfig = { type: "x", climate: "climate.spa" };
    expect(availability(base({ "climate.spa": s("unavailable") }), min)).toBe("board_offline");
    expect(availability(base(), min)).toBe("ok");
  });
  it("hay texto para cada estado no ok", () => {
    expect(AVAILABILITY_TEXT.no_power.title).toBe("Sin corriente");
    expect(AVAILABILITY_TEXT.rcd_tripped.detail).toBe("Rearma el diferencial del cable del jacuzzi");
    expect(AVAILABILITY_TEXT.board_offline.title).toBe("Placa WiFi sin conexión");
  });
});

describe("errorCode", () => {
  it("null sin error", () => {
    expect(errorCode(base(), cfg)).toBeNull();
  });
  it("formatea el codigo con dos cifras", () => {
    expect(errorCode(base({ "sensor.err": s("2") }), cfg)).toBe("E02");
    expect(errorCode(base({ "sensor.err": s("12") }), cfg)).toBe("E12");
  });
  it("null si no hay dato o no es un numero", () => {
    expect(errorCode(base({ "sensor.err": s("unavailable") }), cfg)).toBeNull();
    expect(errorCode(base({ "sensor.err": s("abc") }), cfg)).toBeNull();
    expect(errorCode(base(), { type: "x", climate: "climate.spa" })).toBeNull();
  });
});

describe("formatHours", () => {
  it("horas y minutos", () => {
    expect(formatHours(9.8333)).toBe("9 h 50 min");
  });
  it("solo minutos", () => {
    expect(formatHours(0.75)).toBe("45 min");
  });
  it("horas exactas, tambien redondeando", () => {
    expect(formatHours(2)).toBe("2 h");
    expect(formatHours(1.999)).toBe("2 h");
  });
  it("menos de un minuto", () => {
    expect(formatHours(0.004)).toBe("<1 min");
  });
});

describe("formatPower", () => {
  it("sin decimales y con punto de miles", () => {
    expect(formatPower(1942)).toBe("1.942");
    expect(formatPower(2.8)).toBe("3");
    expect(formatPower(0)).toBe("0");
    expect(formatPower(12345.6)).toBe("12.346");
  });
});

describe("readyView", () => {
  it("eta en calor sin llegar", () => {
    expect(readyView(base(), cfg)).toEqual({ kind: "eta", text: "9 h 50 min" });
  });
  it("listo cuando ready esta on", () => {
    expect(readyView(base({ "binary_sensor.ready": s("on") }), cfg)).toEqual({ kind: "ready" });
  });
  it("nada fuera de calor", () => {
    expect(readyView(base({ "climate.spa": s("fan_only", { temperature: 37 }) }), cfg)).toEqual({
      kind: "none",
    });
  });
  it("nada si el tiempo no tiene sentido", () => {
    for (const v of ["unavailable", "0", "-1", "500"]) {
      expect(readyView(base({ "sensor.ttr": s(v) }), cfg)).toEqual({ kind: "none" });
    }
  });
  it("sin entidad ready, listo si el agua llega al objetivo", () => {
    const noReady: LayZSpaCardConfig = { ...cfg, ready: undefined };
    const st = base({ "climate.spa": s("heat", { temperature: 37, current_temperature: 37 }) });
    expect(readyView(st, noReady)).toEqual({ kind: "ready" });
  });
  it("sin entidad ready y current_temperature nulo no es 'listo'", () => {
    const noReady: LayZSpaCardConfig = { ...cfg, ready: undefined };
    const st = base({ "climate.spa": s("heat", { temperature: 37, current_temperature: null }) });
    expect(readyView(st, noReady)).toEqual({ kind: "eta", text: "9 h 50 min" });
  });
});

describe("dialRange", () => {
  it("lee los atributos del climate", () => {
    expect(dialRange({ min_temp: 20, max_temp: 40, target_temp_step: 1 })).toEqual({
      min: 20,
      max: 40,
      step: 1,
    });
  });
  it("valores por defecto si faltan o no tienen sentido", () => {
    expect(dialRange({})).toEqual({ min: 20, max: 40, step: 1 });
    expect(dialRange({ min_temp: 40, max_temp: 20 })).toEqual({ min: 20, max: 40, step: 1 });
    expect(dialRange({ min_temp: 20, max_temp: 40, target_temp_step: 0 })).toEqual({
      min: 20,
      max: 40,
      step: 1,
    });
  });
});
```

- [ ] **Step 5: Ejecutar y ver que fallan**

Run: `npx vitest run test/status.test.ts`
Expected: FAIL — `Failed to resolve import "../src/status"`.

- [ ] **Step 6: Implementar `src/status.ts`**

```ts
import type { LayZSpaCardConfig } from "./types";
import { RCD_POWER_THRESHOLD_W } from "./const";

export interface EntityState {
  state: string;
  attributes: Record<string, unknown>;
}
export type States = Record<string, EntityState | undefined>;

const NO_DATA = new Set(["unavailable", "unknown"]);
/** Un tiempo mayor no es real: la placa lo da al principio, sin historial de calentado. */
const MAX_TIME_TO_READY_H = 96;

export function toNumber(v: unknown): number | null {
  if (v === null || v === undefined || v === "") return null;
  const n = Number(v);
  return Number.isFinite(n) ? n : null;
}

export function isValid(e?: EntityState): e is EntityState {
  return !!e && !NO_DATA.has(e.state);
}

export function numberOf(e?: EntityState): number | null {
  return isValid(e) ? toNumber(e.state) : null;
}

function get(states: States, id?: string): EntityState | undefined {
  return id ? states[id] : undefined;
}

export type Availability = "ok" | "no_power" | "rcd_tripped" | "board_offline";

export function availability(states: States, cfg: LayZSpaCardConfig): Availability {
  if (get(states, cfg.power_switch)?.state === "off") return "no_power";
  const conn = get(states, cfg.connection);
  const connDown = !!cfg.connection && conn?.state !== "on";
  if (connDown) {
    const w = numberOf(get(states, cfg.power));
    return w !== null && w < RCD_POWER_THRESHOLD_W ? "rcd_tripped" : "board_offline";
  }
  return isValid(states[cfg.climate]) ? "ok" : "board_offline";
}

export const AVAILABILITY_TEXT: Record<
  Exclude<Availability, "ok">,
  { icon: string; title: string; detail: string }
> = {
  no_power: {
    icon: "mdi:power-plug-off",
    title: "Sin corriente",
    detail: "Enchufe del jacuzzi apagado",
  },
  rcd_tripped: {
    icon: "mdi:flash-alert",
    title: "Sin corriente en la bomba",
    detail: "Rearma el diferencial del cable del jacuzzi",
  },
  board_offline: {
    icon: "mdi:wifi-off",
    title: "Placa WiFi sin conexión",
    detail: "La bomba tiene corriente pero la placa no responde",
  },
};

export function errorCode(states: States, cfg: LayZSpaCardConfig): string | null {
  const n = numberOf(get(states, cfg.error));
  if (n === null || n === 0) return null;
  return `E${String(Math.trunc(n)).padStart(2, "0")}`;
}

export function formatHours(h: number): string {
  const total = Math.round(h * 60);
  if (total < 1) return "<1 min";
  const hh = Math.floor(total / 60);
  const mm = total % 60;
  if (hh === 0) return `${mm} min`;
  if (mm === 0) return `${hh} h`;
  return `${hh} h ${mm} min`;
}

export function formatPower(w: number): string {
  return String(Math.round(w)).replace(/\B(?=(\d{3})+(?!\d))/g, ".");
}

export type ReadyView = { kind: "ready" } | { kind: "eta"; text: string } | { kind: "none" };

export function readyView(states: States, cfg: LayZSpaCardConfig): ReadyView {
  const climate = states[cfg.climate];
  if (!climate || climate.state !== "heat") return { kind: "none" };
  const ready = get(states, cfg.ready);
  if (isValid(ready)) {
    if (ready.state === "on") return { kind: "ready" };
  } else {
    const cur = toNumber(climate.attributes.current_temperature);
    const tgt = toNumber(climate.attributes.temperature);
    if (cur !== null && tgt !== null && cur >= tgt) return { kind: "ready" };
  }
  const h = numberOf(get(states, cfg.time_to_ready));
  if (h === null || h <= 0 || h > MAX_TIME_TO_READY_H) return { kind: "none" };
  return { kind: "eta", text: formatHours(h) };
}

export function dialRange(attrs: Record<string, unknown>): { min: number; max: number; step: number } {
  let min = toNumber(attrs.min_temp) ?? 20;
  let max = toNumber(attrs.max_temp) ?? 40;
  if (min >= max) {
    min = 20;
    max = 40;
  }
  const rawStep = toNumber(attrs.target_temp_step);
  const step = rawStep !== null && rawStep > 0 ? rawStep : 1;
  return { min, max, step };
}
```

- [ ] **Step 7: Ejecutar los tests**

Run: `npx vitest run test/status.test.ts`
Expected: PASS (todas las pruebas).

- [ ] **Step 8: Typecheck**

Run: `npx tsc --noEmit`
Expected: sin errores.

- [ ] **Step 9: Commit**

```bash
git add package.json package-lock.json tsconfig.json rollup.config.js vitest.config.ts hacs.json LICENSE src test
git commit -m "feat: proyecto base y logica de estado de la tarjeta

Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
```

---

### Task 2: Geometría del dial (`dial.ts`)

**Files:**
- Create: `src/dial.ts`
- Test: `test/dial.test.ts`

**Interfaces:**
- Produces: `ARC_START = 210`, `ARC_END = 510`, `ARC_SWEEP = 300`, `ARC_R = 80`, `ARC_W = 18`, `polarToCartesian(cx,cy,r,angleDeg): {x,y}`, `arcPath(cx,cy,r,start,end): string`, `clampTarget(v,min,max,step): number`, `angleOfValue(v,min,max): number` (en 210..510), `fracFromAngle(angle0to360): number` (0..1), `valueFromAngle(angle,min,max,step): number`, `pointerAngle(dx,dy): number` (0 = arriba, horario, 0..360), `isNearHandle(dx,dy,scale,handleAngle0to360): boolean`

- [ ] **Step 1: Tests que fallan**

`test/dial.test.ts`:
```ts
import { describe, it, expect } from "vitest";
import {
  ARC_R,
  angleOfValue,
  clampTarget,
  fracFromAngle,
  isNearHandle,
  pointerAngle,
  polarToCartesian,
  valueFromAngle,
} from "../src/dial";

describe("clampTarget", () => {
  it("redondea al paso y recorta al rango", () => {
    expect(clampTarget(36.6, 20, 40, 1)).toBe(37);
    expect(clampTarget(50, 20, 40, 1)).toBe(40);
    expect(clampTarget(10, 20, 40, 1)).toBe(20);
    expect(clampTarget(22.26, 20, 40, 0.5)).toBe(22.5);
  });
});

describe("angleOfValue", () => {
  it("extremos y centro del arco", () => {
    expect(angleOfValue(20, 20, 40)).toBe(210);
    expect(angleOfValue(40, 20, 40)).toBe(510);
    expect(angleOfValue(30, 20, 40)).toBe(360);
  });
  it("recorta fuera de rango", () => {
    expect(angleOfValue(5, 20, 40)).toBe(210);
    expect(angleOfValue(99, 20, 40)).toBe(510);
  });
});

describe("fracFromAngle", () => {
  it("dentro del arco", () => {
    expect(fracFromAngle(210)).toBe(0);
    expect(fracFromAngle(0)).toBe(0.5);
    expect(fracFromAngle(150)).toBe(1);
  });
  it("zona muerta inferior: al extremo mas cercano", () => {
    expect(fracFromAngle(170)).toBe(1);
    expect(fracFromAngle(200)).toBe(0);
    expect(fracFromAngle(180)).toBe(0);
  });
});

describe("valueFromAngle", () => {
  it("convierte angulo en temperatura con paso", () => {
    expect(valueFromAngle(0, 20, 40, 1)).toBe(30);
    expect(valueFromAngle(210, 20, 40, 1)).toBe(20);
    expect(valueFromAngle(175, 20, 40, 1)).toBe(40);
  });
});

describe("pointerAngle", () => {
  it("0 arriba y sentido horario", () => {
    expect(pointerAngle(0, -1)).toBe(0);
    expect(pointerAngle(1, 0)).toBe(90);
    expect(pointerAngle(0, 1)).toBe(180);
    expect(pointerAngle(-1, 0)).toBe(270);
  });
});

describe("isNearHandle", () => {
  const handleAngle = 0; // bolita arriba
  const p = polarToCartesian(0, 0, ARC_R, handleAngle); // escala 1, centro en 0,0
  it("true sobre la bolita", () => {
    expect(isNearHandle(p.x, p.y, 1, handleAngle)).toBe(true);
  });
  it("false en el centro del dial", () => {
    expect(isNearHandle(0, 0, 1, handleAngle)).toBe(false);
  });
  it("false en el aro pero lejos de la bolita", () => {
    const q = polarToCartesian(0, 0, ARC_R, 90);
    expect(isNearHandle(q.x, q.y, 1, handleAngle)).toBe(false);
  });
});
```

- [ ] **Step 2: Ver que fallan**

Run: `npx vitest run test/dial.test.ts`
Expected: FAIL — `Failed to resolve import "../src/dial"`.

- [ ] **Step 3: Implementar `src/dial.ts`**

Copia de la mecánica de `aerothermal-temperature-control/src/aerothermal-card.ts` (helpers SVG, hit-test y conversión de ángulo), extraída a funciones puras. La zona muerta va de 150° a 210° (en la de aerotermia ponía 140, que dejaba 10° sin asignar).

```ts
export const ARC_START = 210;
export const ARC_END = 510; // hueco de 60° centrado abajo
export const ARC_SWEEP = ARC_END - ARC_START;
export const ARC_R = 80;
export const ARC_W = 18;
/** Final del arco en 0..360 (510 - 360). */
const ARC_END_WRAPPED = ARC_END - 360;
/** Margen angular para agarrar la bolita. */
const GRAB_DEG = 22;

export function polarToCartesian(cx: number, cy: number, r: number, angleDeg: number) {
  const a = ((angleDeg - 90) * Math.PI) / 180;
  return { x: cx + r * Math.cos(a), y: cy + r * Math.sin(a) };
}

export function arcPath(cx: number, cy: number, r: number, startAngle: number, endAngle: number): string {
  const start = polarToCartesian(cx, cy, r, endAngle);
  const end = polarToCartesian(cx, cy, r, startAngle);
  const largeArc = endAngle - startAngle <= 180 ? "0" : "1";
  return `M ${start.x} ${start.y} A ${r} ${r} 0 ${largeArc} 0 ${end.x} ${end.y}`;
}

export function clampTarget(v: number, min: number, max: number, step: number): number {
  const rounded = Math.round(v / step) * step;
  return Number(Math.min(max, Math.max(min, rounded)).toFixed(2));
}

export function angleOfValue(v: number, min: number, max: number): number {
  const frac = Math.min(1, Math.max(0, (v - min) / (max - min)));
  return ARC_START + frac * ARC_SWEEP;
}

export function fracFromAngle(angle: number): number {
  let frac: number;
  if (angle >= ARC_START) {
    frac = (angle - ARC_START) / ARC_SWEEP;
  } else if (angle <= ARC_END_WRAPPED) {
    frac = (angle + 360 - ARC_START) / ARC_SWEEP;
  } else {
    // zona muerta inferior: al extremo mas cercano
    frac = angle - ARC_END_WRAPPED < ARC_START - angle ? 1 : 0;
  }
  return Math.min(1, Math.max(0, frac));
}

export function valueFromAngle(angle: number, min: number, max: number, step: number): number {
  return clampTarget(min + fracFromAngle(angle) * (max - min), min, max, step);
}

/** Angulo del puntero respecto al centro: 0 = arriba, sentido horario, 0..360. */
export function pointerAngle(dx: number, dy: number): number {
  let ang = (Math.atan2(dy, dx) * 180) / Math.PI + 90;
  if (ang < 0) ang += 360;
  return ang;
}

/** Hit-test geometrico (no getBoundingClientRect de la bolita: en WebViews de movil el
 *  drop-shadow infla su caja). dx/dy en px desde el centro; scale = px por unidad del viewBox. */
export function isNearHandle(dx: number, dy: number, scale: number, handleAngle: number): boolean {
  const dist = Math.hypot(dx, dy);
  if (Math.abs(dist - ARC_R * scale) > (ARC_W / 2 + 12) * scale) return false;
  let diff = Math.abs(pointerAngle(dx, dy) - handleAngle);
  if (diff > 180) diff = 360 - diff;
  return diff <= GRAB_DEG;
}
```

- [ ] **Step 4: Ejecutar los tests**

Run: `npx vitest run test/dial.test.ts`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add src/dial.ts test/dial.test.ts
git commit -m "feat: geometria del dial como funciones puras

Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
```

---

### Task 3: Detección de entidades (`detect.ts`)

**Files:**
- Create: `src/detect.ts`
- Test: `test/detect.test.ts`

**Interfaces:**
- Consumes: `DEFAULT_ENTITIES` (Task 1)
- Produces: `detectEntities(entityIds: string[]): Partial<Record<EntityKey, string>> & { climate: string }`

- [ ] **Step 1: Tests que fallan**

`test/detect.test.ts`:
```ts
import { describe, it, expect } from "vitest";
import { detectEntities } from "../src/detect";
import { DEFAULT_ENTITIES } from "../src/const";

describe("detectEntities", () => {
  it("pone todas las entidades por defecto que existen", () => {
    expect(detectEntities(Object.values(DEFAULT_ENTITIES))).toEqual(DEFAULT_ENTITIES);
  });
  it("omite las que no existen", () => {
    const r = detectEntities([DEFAULT_ENTITIES.climate, DEFAULT_ENTITIES.bubbles]);
    expect(r).toEqual({ climate: DEFAULT_ENTITIES.climate, bubbles: DEFAULT_ENTITIES.bubbles });
  });
  it("busca otro climate layzspa si el de por defecto no existe", () => {
    expect(detectEntities(["climate.salon", "climate.layzspa_otro"]).climate).toBe(
      "climate.layzspa_otro"
    );
  });
  it("sin nada, deja el climate por defecto para que el usuario lo vea y lo cambie", () => {
    expect(detectEntities([])).toEqual({ climate: DEFAULT_ENTITIES.climate });
  });
});
```

- [ ] **Step 2: Ver que fallan**

Run: `npx vitest run test/detect.test.ts`
Expected: FAIL — `Failed to resolve import "../src/detect"`.

- [ ] **Step 3: Implementar `src/detect.ts`**

```ts
import { DEFAULT_ENTITIES } from "./const";
import type { EntityKey } from "./types";

export function detectEntities(
  entityIds: string[]
): Partial<Record<EntityKey, string>> & { climate: string } {
  const present = new Set(entityIds);
  const out: Partial<Record<EntityKey, string>> = {};
  for (const [key, id] of Object.entries(DEFAULT_ENTITIES) as [EntityKey, string][]) {
    if (present.has(id)) out[key] = id;
  }
  const climate =
    out.climate ??
    entityIds.find((id) => id.startsWith("climate.") && id.includes("layzspa")) ??
    DEFAULT_ENTITIES.climate;
  return { ...out, climate };
}
```

- [ ] **Step 4: Ejecutar todos los tests**

Run: `npm test`
Expected: PASS (status, dial, detect).

- [ ] **Step 5: Commit**

```bash
git add src/detect.ts test/detect.test.ts
git commit -m "feat: deteccion de entidades para la configuracion inicial

Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
```

---

### Task 4: Tarjeta, editor y `preview.html`

**Files:**
- Create: `src/editor.ts`, `src/lay-z-spa-card.ts`, `preview.html`
- Build output: `dist/lay-z-spa-card.js`

**Interfaces:**
- Consumes: todo lo de Tasks 1–3.
- Produces: elemento `<lay-z-spa-card>` (con `setConfig`, `hass`, `getCardSize`, `getConfigElement`, `getStubConfig(hass)`) y `<lay-z-spa-card-editor>`.

Decisión de implementación (no está en la spec y no la contradice): en modo **apagado** el dial sigue activo (en gris) para poder dejar preparado el objetivo antes de encender la calefacción; solo se desactiva en los estados de no disponibilidad.

- [ ] **Step 1: `src/editor.ts`**

```ts
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
      <p class="hint">Solo el termostato es obligatorio; lo que falte se oculta en la tarjeta.</p>
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
```

- [ ] **Step 2: `src/lay-z-spa-card.ts`**

```ts
import { LitElement, html, svg, css, TemplateResult, nothing, PropertyValues } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import { HomeAssistant, LovelaceCard, LovelaceCardEditor, fireEvent } from "custom-card-helpers";
import type { LayZSpaCardConfig } from "./types";
import { CARD_TAG, CARD_VERSION, EDITOR_TAG } from "./const";
import {
  AVAILABILITY_TEXT,
  availability,
  dialRange,
  errorCode,
  formatPower,
  numberOf,
  readyView,
  toNumber,
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

  private _valueAngle = 0;
  private _dragPointerId: number | null = null;
  private _boundMove = (e: PointerEvent) => this._onPointerMove(e);
  private _boundUp = () => this._onPointerUp();

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

  protected shouldUpdate(changed: PropertyValues): boolean {
    return (
      changed.has("config") || changed.has("hass") || changed.has("_dragging") || changed.has("_dragTemp")
    );
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
    const { min, max } = dialRange(climate.attributes);
    const target = toNumber(climate.attributes.temperature);
    const liveTarget = this._dragTemp ?? target ?? min;
    const current = ok ? toNumber(climate.attributes.current_temperature) : null;
    const heaterOn = ok && !!this.config.heater && states[this.config.heater]?.state === "on";

    const valueAngle = angleOfValue(liveTarget, min, max);
    this._valueAngle = valueAngle % 360;
    const handle = polarToCartesian(100, 100, ARC_R, valueAngle);
    const curAngle = current !== null ? angleOfValue(current, min, max) : null;
    const curDot = curAngle !== null ? polarToCartesian(100, 100, ARC_R, curAngle) : null;
    const fillStart = curAngle !== null ? Math.min(valueAngle, curAngle) : ARC_START;
    const fillEnd = curAngle !== null ? Math.max(valueAngle, curAngle) : valueAngle;
    const gradId = `grad-${mode}`;

    const label = !meta ? mode : mode === "heat" && heaterOn ? "Calentando" : meta.label;
    const power = numberOf(this.config.power ? states[this.config.power] : undefined);

    return html`
      <ha-card style="--accent:${accent}">
        <div class="header">
          <span class="title"><ha-icon icon="mdi:hot-tub"></ha-icon>${this.config.name ?? "Jacuzzi"}</span>
          ${power !== null
            ? html`<button
                class="power"
                title="Consumo real"
                @click=${() => this._openMoreInfo(this.config.energy_today || this.config.power)}
              >
                <ha-icon icon="mdi:flash"></ha-icon>${formatPower(power)} W
              </button>`
            : nothing}
        </div>

        <div class="dial-wrap">
          <svg viewBox="0 0 200 200" class="dial ${ok ? "" : "off"}" @pointerdown=${this._onPointerDown}>
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
            ${ok
              ? svg`
                <path class="glow" style="stroke:${accent}" d=${arcPath(100, 100, ARC_R, fillStart, fillEnd)} />
                <path class="value" style="stroke:url(#${gradId})" d=${arcPath(100, 100, ARC_R, fillStart, fillEnd)} />
                ${curDot ? svg`<circle class="curdot" style="fill:${dotColor}" cx=${curDot.x} cy=${curDot.y} r="4" />` : nothing}
                <circle class="handle ${heaterOn ? "pulse" : ""}" style="stroke:${accent}" cx=${handle.x} cy=${handle.y} r="8" />`
              : nothing}
          </svg>
          <div class="dial-center">${ok ? this._renderCenter(label, liveTarget, current) : this._renderUnavailable(avail)}</div>
        </div>

        ${ok ? this._renderInfo() : nothing} ${this._renderModes(ok, mode, climate.attributes.hvac_modes)}
      </ha-card>
    `;
  }

  private _renderCenter(label: string, target: number, current: number | null): TemplateResult {
    return html`
      <div class="mode-name">${label}</div>
      <div class="target">
        <span class="int">${Math.round(target)}</span><span class="unit">°C</span>
      </div>
      ${current !== null
        ? html`<div class="current clickable" title="Ver histórico" @click=${() => this._openMoreInfo(this.config.climate)}>
            <ha-icon icon="mdi:water-thermometer"></ha-icon>${String(current).replace(".", ",")} °C
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
    const ready = readyView(states, this.config);
    const err = errorCode(states, this.config);
    return html`
      <div class="info">
        ${ambient !== null
          ? html`<span class="item clickable" @click=${() => this._openMoreInfo(this.config.ambient)}>
              <ha-icon icon="mdi:home-thermometer-outline"></ha-icon>Amb. ${String(ambient).replace(".", ",")} °C
            </span>`
          : nothing}
        ${ready.kind === "ready"
          ? html`<span class="chip ready"><ha-icon icon="mdi:check-circle"></ha-icon>Listo</span>`
          : ready.kind === "eta"
          ? html`<span class="item clickable" @click=${() => this._openMoreInfo(this.config.time_to_ready)}>
              <ha-icon icon="mdi:timer-sand"></ha-icon>Listo en ${ready.text}
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
    const bubblesId = this.config.bubbles;
    const bubblesOn = !!bubblesId && this._states[bubblesId]?.state === "on";
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
        ${bubblesId
          ? html`<button
              class="bubbles ${ok && bubblesOn ? "active" : ""}"
              title="Burbujas"
              ?disabled=${!ok}
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

  private _step(dir: number): void {
    const climate = this._states[this.config.climate];
    if (!climate) return;
    const { min, max, step } = dialRange(climate.attributes);
    const cur = toNumber(climate.attributes.temperature) ?? min;
    const next = clampTarget(cur + dir * step, min, max, step);
    if (next === cur) return;
    this.hass.callService("climate", "set_temperature", { entity_id: this.config.climate, temperature: next });
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
    if (!this._dragging) return;
    if (e.cancelable) e.preventDefault();
    const svgEl = this._svg();
    const climate = this._states[this.config.climate];
    if (!svgEl || !climate) return;
    const rect = svgEl.getBoundingClientRect();
    const angle = pointerAngle(e.clientX - (rect.left + rect.width / 2), e.clientY - (rect.top + rect.height / 2));
    const { min, max, step } = dialRange(climate.attributes);
    this._dragTemp = valueFromAngle(angle, min, max, step);
  }

  private _onPointerUp(): void {
    if (!this._dragging) return;
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
    const climate = this._states[this.config.climate];
    const current = climate ? toNumber(climate.attributes.temperature) : null;
    if (this._dragTemp !== null && this._dragTemp !== current) {
      this.hass.callService("climate", "set_temperature", {
        entity_id: this.config.climate,
        temperature: this._dragTemp,
      });
    }
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
  `;
}

declare global {
  interface HTMLElementTagNameMap {
    "lay-z-spa-card": LayZSpaCard;
  }
}
```

- [ ] **Step 3: Typecheck y build**

Run: `npx tsc --noEmit && npm run build`
Expected: sin errores; se crea `dist/lay-z-spa-card.js`.

- [ ] **Step 4: `preview.html`**

```html
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>Lay-Z-Spa Card · Preview</title>
  <style>
    body {
      margin: 0;
      padding: 24px 16px;
      font-family: "Segoe UI", sans-serif;
      background: #111;
      color: #e1e1e1;
      --ha-card-background: #1c1c1e;
      --card-background-color: #1c1c1e;
      --primary-text-color: #e1e1e1;
      --secondary-text-color: #9b9b9b;
      --secondary-background-color: #2a2a2c;
      --divider-color: #ffffff1f;
      --error-color: #db4437;
    }
    .grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(320px, 1fr)); gap: 20px; }
    h3 { font-size: 12px; letter-spacing: 1px; text-transform: uppercase; opacity: 0.6; margin: 0 0 8px; }
    #log { margin-top: 24px; font: 12px monospace; white-space: pre; opacity: 0.8; }
  </style>
  <script>
    const ICONS = {
      "mdi:power": "⏻", "mdi:fan": "🌀", "mdi:fire": "🔥", "mdi:chart-bubble": "🫧",
      "mdi:minus": "−", "mdi:plus": "+", "mdi:hot-tub": "🛁", "mdi:flash": "⚡",
      "mdi:water-thermometer": "💧", "mdi:home-thermometer-outline": "🌡", "mdi:timer-sand": "⏳",
      "mdi:check-circle": "✓", "mdi:alert": "⚠", "mdi:power-plug-off": "🔌",
      "mdi:flash-alert": "⚡", "mdi:wifi-off": "📴",
    };
    customElements.define("ha-card", class extends HTMLElement {
      connectedCallback() {
        Object.assign(this.style, { display: "block", background: "var(--ha-card-background)",
          borderRadius: "12px", border: "1px solid var(--divider-color)" });
      }
    });
    customElements.define("ha-icon", class extends HTMLElement {
      static get observedAttributes() { return ["icon"]; }
      attributeChangedCallback() { this.textContent = ICONS[this.getAttribute("icon")] ?? "•"; }
      connectedCallback() { this.attributeChangedCallback(); }
    });
  </script>
  <script type="module" src="./dist/lay-z-spa-card.js"></script>
</head>
<body>
  <div class="grid" id="grid"></div>
  <div id="log"></div>
  <script type="module">
    const CONFIG = {
      type: "custom:lay-z-spa-card", name: "Jacuzzi",
      climate: "climate.layzspa_temperature_control", bubbles: "switch.layzspa_airbubbles",
      heater: "binary_sensor.layzspa_heater", ready: "binary_sensor.layzspa_ready",
      time_to_ready: "sensor.layzspa_time_to_ready", ambient: "number.layzspa_amb_temp_c",
      error: "sensor.layzspa_error", connection: "binary_sensor.layzspa_connection",
      power_switch: "switch.jacuzzi", power: "sensor.jacuzzi_power",
      energy_today: "sensor.jacuzzi_energia_energy_daily",
    };
    const st = (state, attributes = {}) => ({ state, attributes });
    function base({ mode = "fan_only", target = 37, current = 27, heater = "off", ready = "off",
                    ttr = "9.8333", err = "0", conn = "on", plug = "on", watts = "2.8", bubbles = "off" } = {}) {
      return {
        [CONFIG.climate]: conn === "on"
          ? st(mode, { temperature: target, current_temperature: current, min_temp: 20, max_temp: 40,
                       target_temp_step: 1, hvac_modes: ["fan_only", "off", "heat"] })
          : st("unavailable"),
        [CONFIG.bubbles]: st(bubbles), [CONFIG.heater]: st(heater), [CONFIG.ready]: st(ready),
        [CONFIG.time_to_ready]: st(ttr), [CONFIG.ambient]: st("23"), [CONFIG.error]: st(err),
        [CONFIG.connection]: st(conn), [CONFIG.power_switch]: st(plug), [CONFIG.power]: st(watts),
        [CONFIG.energy_today]: st("0.38"),
      };
    }
    const SCENARIOS = {
      "Filtro": base(),
      "Calentando": base({ mode: "heat", heater: "on", watts: "1942" }),
      "Listo": base({ mode: "heat", current: 37, ready: "on", watts: "40" }),
      "Sin corriente": base({ plug: "off", conn: "off", watts: "0" }),
      "Diferencial saltado": base({ conn: "off", watts: "0" }),
      "Placa caída": base({ conn: "off", watts: "2.8" }),
      "Error E02": base({ mode: "heat", heater: "on", err: "2", watts: "1942", bubbles: "on" }),
    };
    const log = document.getElementById("log");
    await customElements.whenDefined("lay-z-spa-card");
    for (const [title, states] of Object.entries(SCENARIOS)) {
      const wrap = document.createElement("div");
      wrap.innerHTML = `<h3>${title}</h3>`;
      const card = document.createElement("lay-z-spa-card");
      card.setConfig(CONFIG);
      const hass = {
        states, language: "es",
        callService(domain, service, data) {
          log.textContent += `[${title}] ${domain}.${service} ${JSON.stringify(data)}\n`;
          const s = { ...hass.states };
          const id = data.entity_id;
          if (domain === "climate" && service === "set_hvac_mode") s[id] = { ...s[id], state: data.hvac_mode };
          if (domain === "climate" && service === "set_temperature")
            s[id] = { ...s[id], attributes: { ...s[id].attributes, temperature: data.temperature } };
          if (domain === "switch" && service === "toggle")
            s[id] = { ...s[id], state: s[id].state === "on" ? "off" : "on" };
          hass.states = s;
          card.hass = { ...hass };
        },
      };
      card.hass = hass;
      wrap.appendChild(card);
      document.getElementById("grid").appendChild(wrap);
    }
  </script>
</body>
</html>
```

- [ ] **Step 5: Revisar la preview en Chrome**

Run (en segundo plano): `npm run preview`
Abrir `http://localhost:8765/preview.html` con las herramientas de Chrome y comprobar:
- **Filtro:** azul; objetivo 37; agua 27; sin "Listo en"; ambiente 23; cabecera `⚡ 3 W`.
- **Calentando:** naranja; "Calentando"; bolita con pulso; `Listo en 9 h 50 min`; `⚡ 1.942 W`.
- **Listo:** chip verde "Listo".
- **Sin corriente**, **Diferencial saltado** y **Placa caída:** dial gris con su texto (§6 de la spec) y botones desactivados.
- **Error E02:** chip rojo "Error E02" y burbujas resaltadas.
- Pulsar un modo, −/+, burbujas y arrastrar la bolita: el log de abajo muestra la llamada y la tarjeta cambia. El arrastre envía **una sola** `set_temperature` al soltar.
- Redimensionar la ventana a 390 px de ancho: nada se sale ni se solapa.
Corregir lo que falle y repetir `npm run build`.

- [ ] **Step 6: Commit**

```bash
git add src/editor.ts src/lay-z-spa-card.ts preview.html dist/lay-z-spa-card.js
git commit -m "feat: tarjeta Lay-Z-Spa con dial, modos, burbujas, avisos y preview

Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
```

---

### Task 5: README y CHANGELOG

**Files:**
- Create: `README.md`, `CHANGELOG.md`

- [ ] **Step 1: `README.md`**

Contenido (en español, como el de la aerotermia):
- Qué es (una línea) y captura (añadir más tarde `docs/captura.png`; dejar la línea comentada con `<!-- ![Captura](docs/captura.png) -->`).
- Requisitos: placa con el firmware de visualapproach integrada por MQTT; Shelly opcional.
- Instalación: Opción A HACS (repositorio personalizado `https://github.com/serweck/lay-z-spa-card`, categoría Dashboard); Opción B manual (`dist/lay-z-spa-card.js` a `config/www/`, recurso `/local/lay-z-spa-card.js?v=0.1.0` tipo `module`).
- Configuración: el bloque YAML de la §4 de la spec, con una tabla de claves (obligatoria/opcional y para qué sirve).
- Estados de disponibilidad: la tabla de la §6 de la spec.
- Desarrollo: `npm install`, `npm test`, `npm run build`, `npm run preview` y abrir `http://localhost:8765/preview.html`.

- [ ] **Step 2: `CHANGELOG.md`**

```markdown
# Changelog

Todas las versiones notables de este proyecto se documentan aquí.
El formato sigue [Keep a Changelog](https://keepachangelog.com/) y
[SemVer](https://semver.org/lang/es/).

## [0.1.0] - 2026-10-05

### Añadido
- Dial de temperatura (20–40 °C) con objetivo arrastrable, −/+ y temperatura actual del agua.
- Modos apagado / filtro / calor y botón de burbujas independiente.
- Temperatura ambiente, "Listo en" en horas y minutos y aviso "Listo".
- Consumo real del enchufe en la cabecera.
- Avisos de error de la bomba, sin corriente, diferencial saltado y placa WiFi sin conexión.
- Editor visual y detección automática de las entidades al añadir la tarjeta.
```

- [ ] **Step 3: Commit**

```bash
git add README.md CHANGELOG.md
git commit -m "docs: README y CHANGELOG de la 0.1.0

Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
```

---

### Task 6: Prueba real en Home Assistant (servidor local)

Sin tocar `/config/www` (el Samba de HA pide credenciales): HA carga la tarjeta desde el PC mientras dura la prueba.

**Files:** ninguno del repositorio (cambios en HA: un recurso Lovelace temporal y una tarjeta en la pestaña Jacuzzi de Serweck).

- [ ] **Step 1: IP del PC y servidor**

Run: `ipconfig | grep -A4 -i "wi-fi\|ethernet" | grep IPv4` → apuntar la IP de la red `192.168.14.x`.
Run (en segundo plano, desde el repo): `npm run preview`
Comprobar desde el PC: `curl -s -o /dev/null -w "%{http_code}" http://<IP>:8765/dist/lay-z-spa-card.js` → `200`.
Si el cortafuegos de Windows bloquea el puerto desde HA (el recurso no carga en el paso 2), parar y pedir al usuario que permita Node.js en redes privadas.

- [ ] **Step 2: Registrar el recurso temporal**

En la pestaña de Chrome con HA (`http://homeassistant.local:8123`), con `javascript_tool`:
```js
const hass = document.querySelector("home-assistant").hass;
await hass.callWS({ type: "lovelace/resources/create", res_type: "module",
  url: "http://<IP>:8765/dist/lay-z-spa-card.js?v=0.1.0-dev1" });
(await hass.callWS({ type: "lovelace/resources" })).filter(r => r.url.includes("lay-z-spa"))
```
Recargar la página y comprobar en la consola el banner `LAY-Z-SPA-CARD v0.1.0`.

- [ ] **Step 3: Añadir la tarjeta arriba de la pestaña Jacuzzi de Serweck**

```js
const H = () => document.querySelector("home-assistant").hass;
const cfg = await H().callWS({ type: "lovelace/config", url_path: "dashboard-serweck" });
localStorage.setItem("backup_serweck_antes_tarjeta_jacuzzi", JSON.stringify(cfg));
const v = cfg.views.find(x => x.path === "jacuzzi");
v.sections.unshift({ type: "grid", cards: [
  { type: "custom:lay-z-spa-card", name: "Jacuzzi", ...{
    climate: "climate.layzspa_temperature_control", bubbles: "switch.layzspa_airbubbles",
    heater: "binary_sensor.layzspa_heater", ready: "binary_sensor.layzspa_ready",
    time_to_ready: "sensor.layzspa_time_to_ready", ambient: "number.layzspa_amb_temp_c",
    error: "sensor.layzspa_error", connection: "binary_sensor.layzspa_connection",
    power_switch: "switch.jacuzzi", power: "sensor.jacuzzi_power",
    energy_today: "sensor.jacuzzi_energia_energy_daily" } },
] });
await H().callWS({ type: "lovelace/config/save", url_path: "dashboard-serweck", config: cfg });
```
Abrir `http://homeassistant.local:8123/dashboard-serweck/jacuzzi` y hacer captura.

- [ ] **Step 4: Probar con el jacuzzi real**

Pedir confirmación al usuario antes de cambiar el estado del jacuzzi (puede estar calentando a propósito). Con su visto bueno:
1. Pulsar 🌀 Filtro y luego 🔥 Calor: el historial de `climate.layzspa_temperature_control` cambia a `fan_only` y a `heat`.
2. Pulsar + y −: `temperature` sube y baja un grado.
3. Arrastrar la bolita a 37: un único cambio de `temperature` en el historial.
4. 🫧 dos veces: `switch.layzspa_airbubbles` on y off.
5. Dejarlo en el estado que pida el usuario.
6. Captura a 390 px de ancho (`resize_window`).

- [ ] **Step 5: Corregir y apuntar**

Si algo falla: arreglar, `npm test`, `npm run build`, recargar HA (el `-c-1` del servidor evita la caché; si no, subir `?v=0.1.0-devN` en el recurso) y repetir. Commit de cada arreglo con su motivo.

---

### Task 7: Publicación y sustitución del bloque del Home (necesita permiso)

- [ ] **Step 1: Pedir permiso**

Preguntar al usuario: "¿Creo el repositorio público `serweck/lay-z-spa-card` en GitHub, publico la versión 0.1.0 y la instalo por HACS?". Sin un sí explícito, parar aquí: la tarjeta sigue cargándose desde el PC solo mientras el servidor esté encendido, y se le explica.

- [ ] **Step 2: Repositorio y versión (con permiso)**

Run: `gh auth status` → debe estar autenticado como `serweck`; si no, pedir al usuario `! gh auth login`.
```bash
gh repo create serweck/lay-z-spa-card --public --source . --remote origin --push
git tag v0.1.0
git push origin v0.1.0
gh release create v0.1.0 dist/lay-z-spa-card.js --title "v0.1.0" --notes-file CHANGELOG.md
```

- [ ] **Step 3: Instalar por HACS y quitar el recurso temporal**

En Chrome: HACS → ⋮ → Repositorios personalizados → `https://github.com/serweck/lay-z-spa-card`, categoría Dashboard → instalar. Después:
```js
const H = () => document.querySelector("home-assistant").hass;
const dev = (await H().callWS({ type: "lovelace/resources" })).find(r => r.url.includes(":8765/"));
if (dev) await H().callWS({ type: "lovelace/resources/delete", resource_id: dev.id });
(await H().callWS({ type: "lovelace/resources" })).filter(r => r.url.includes("lay-z-spa"))
```
Expected: solo queda `/hacsfiles/lay-z-spa-card/lay-z-spa-card.js?hacstag=...`. Recargar y comprobar que la tarjeta de Serweck sigue funcionando.

- [ ] **Step 4: Sustituir el bloque del Home del Resumen**

```js
const H = () => document.querySelector("home-assistant").hass;
const res = await H().callWS({ type: "lovelace/config", url_path: null });
localStorage.setItem("backup_resumen_antes_tarjeta_jacuzzi", JSON.stringify(res));
const home = res.views.find(v => v.path === "home");
const sec = home.sections.find(s => (s.cards || []).some(c => c.type === "heading" && c.heading === "Jacuzzi"));
sec.cards = [
  { type: "heading", heading: "Jacuzzi", icon: "mdi:hot-tub",
    tap_action: { action: "navigate", navigation_path: "/dashboard-serweck/jacuzzi" } },
  { type: "custom:lay-z-spa-card", name: "Jacuzzi", climate: "climate.layzspa_temperature_control",
    bubbles: "switch.layzspa_airbubbles", heater: "binary_sensor.layzspa_heater",
    ready: "binary_sensor.layzspa_ready", time_to_ready: "sensor.layzspa_time_to_ready",
    ambient: "number.layzspa_amb_temp_c", error: "sensor.layzspa_error",
    connection: "binary_sensor.layzspa_connection", power_switch: "switch.jacuzzi",
    power: "sensor.jacuzzi_power", energy_today: "sensor.jacuzzi_energia_energy_daily" },
];
await H().callWS({ type: "lovelace/config/save", url_path: null, config: res });
```
Captura del Home y de la pestaña de Serweck.

- [ ] **Step 5: Documentación**

- Actualizar `D:/0-Proyectos/0-Obsidian/Obsidian-ClaudeCode/02-Projects/2026-10-05-lay-z-spa-card.md` (ES) con estado `desplegado`, `release: v0.1.0`, `environment: home-assistant` en el frontmatter, y regenerar la versión EN.
- Añadir el enlace al repositorio en "Links del dia" de la nota diaria.
