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
