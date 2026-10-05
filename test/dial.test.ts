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
