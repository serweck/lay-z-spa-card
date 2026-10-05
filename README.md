# Lay-Z-Spa Card

Tarjeta Lovelace para Home Assistant que gestiona un jacuzzi **Lay-Z-Spa** controlado por la placa
WiFi del proyecto [visualapproach/WiFi-remote-for-Bestway-Lay-Z-SPA](https://github.com/visualapproach/WiFi-remote-for-Bestway-Lay-Z-SPA)
(integrada por MQTT), con el mismo estilo que
[aerothermal-temperature-control](https://github.com/serweck/aerothermal-temperature-control).

<!-- ![Captura](docs/captura.png) -->

- Dial de temperatura con el **objetivo** (arrastrable y con −/+) y la **temperatura del agua**.
- Modos **apagado / filtro / calor** y botón de **burbujas** independiente.
- **Temperatura ambiente**, **tiempo hasta estar listo** y aviso **"Listo"**.
- **Consumo real** del enchufe (por ejemplo un Shelly).
- Avisos: **error de la bomba**, **sin corriente**, **diferencial saltado** y **placa WiFi sin conexión**.

La tarjeta solo pinta estados y llama a servicios de Home Assistant: no necesita configuración en
el servidor.

## Requisitos

- La placa con el firmware de visualapproach conectada a Home Assistant por MQTT (crea las entidades
  `layzspa_*` por descubrimiento).
- Opcional: un enchufe con medida de consumo para saber si hay corriente y cuánto gasta.

## Instalación

**Opción A — HACS (repositorio personalizado):**

1. HACS → ⋮ → *Repositorios personalizados*.
2. URL `https://github.com/serweck/lay-z-spa-card` · Categoría **Dashboard**.
3. Instálalo desde HACS y recarga el navegador (Ctrl+F5).

**Opción B — Manual:**

1. Copia `dist/lay-z-spa-card.js` a `config/www/`.
2. Añádelo como recurso (Ajustes → Paneles → ⋮ → Recursos): URL `/local/lay-z-spa-card.js?v=0.1.1`,
   tipo **Módulo JavaScript**.
3. Recarga el navegador (Ctrl+F5).

## Configuración

Al añadirla desde el selector de tarjetas detecta sola las entidades. En YAML:

```yaml
type: custom:lay-z-spa-card
name: Jacuzzi
climate: climate.layzspa_temperature_control
bubbles: switch.layzspa_airbubbles
heater: binary_sensor.layzspa_heater
ready: binary_sensor.layzspa_ready
time_to_ready: sensor.layzspa_time_to_ready
ambient: number.layzspa_amb_temp_c
error: sensor.layzspa_error
connection: binary_sensor.layzspa_connection
power_switch: switch.jacuzzi
power: sensor.jacuzzi_power
energy_today: sensor.jacuzzi_energia_energy_daily
```

| Clave | Obligatoria | Para qué |
|---|---|---|
| `climate` | Sí | Modos (`off`/`fan_only`/`heat`), objetivo y temperatura del agua |
| `name` | No | Título (por defecto "Jacuzzi") |
| `bubbles` | No | Botón de burbujas |
| `heater` | No | "Calentando" y pulso de la bolita |
| `ready` | No | Aviso "Listo" (sin ella: agua ≥ objetivo) |
| `time_to_ready` | No | "Listo en …" (horas decimales) |
| `ambient` | No | Temperatura ambiente |
| `error` | No | Aviso con el código de error (`0` = sin error) |
| `connection` | No | Detectar la placa desconectada |
| `power_switch` | No | Detectar el enchufe apagado (solo lectura) |
| `power` | No | Consumo en la cabecera y detectar el diferencial saltado |
| `energy_today` | No | Detalle que se abre al pulsar el consumo |

## Estados de disponibilidad

| Condición | Qué muestra |
|---|---|
| Enchufe apagado | "Sin corriente" · "Enchufe del jacuzzi apagado" |
| Placa desconectada y consumo < 1 W | "Sin corriente en la bomba" · "Rearma el diferencial del cable del jacuzzi" |
| Placa desconectada con consumo (o sin dato) | "Placa WiFi sin conexión" |
| Climate no disponible | "Placa WiFi sin conexión" |

En esos estados el dial se ve gris y los botones están desactivados.

## Desarrollo

```bash
npm install
npm test          # pruebas de la lógica (vitest)
npm run build     # genera dist/lay-z-spa-card.js
npm run preview   # sirve el repo en http://localhost:8765/preview.html
```

`preview.html` simula Home Assistant con siete escenarios (filtro, calentando, listo, sin corriente,
diferencial, placa caída y error) para revisar la tarjeta sin tocar el jacuzzi.
