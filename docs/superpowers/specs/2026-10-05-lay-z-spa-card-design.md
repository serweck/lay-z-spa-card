# Lay-Z-Spa Card — diseño

- **Fecha:** 2026-10-05
- **Estado:** aprobado en conversación, pendiente de revisión escrita
- **Repositorio:** `D:\0-Proyectos\Domotica\Homeassistant\Componentes Visuales\lay-z-spa-card`
  (en GitHub: `serweck/lay-z-spa-card`, se crea solo con permiso explícito)

## 1. Objetivo

Una tarjeta Lovelace para la **gestión completa del jacuzzi** Lay-Z-Spa Paris desde un único
bloque, con el mismo estilo que `aerothermal-temperature-control`:

- Rueda de temperatura con el **objetivo** (arrastrable y con −/+) y la **temperatura actual**.
- Barra de **modos** (apagado / filtro / calor) y **burbujas** aparte.
- **Temperatura ambiente** y **tiempo hasta estar listo**.
- **Consumo real** del enchufe Shelly.
- Avisos que solo aparecen cuando hacen falta: listo, error de la bomba, sin corriente,
  diferencial saltado, placa WiFi caída.

**Criterio de éxito:** desde la tarjeta se puede poner calor a 37 °C, ver cómo sube el agua y
cuánto falta, cambiar de modo y encender las burbujas, sin abrir la pestaña completa; y si el
jacuzzi no responde, la tarjeta dice por qué.

**Fuera de alcance:** controlar el enchufe Shelly (la protección del cable obliga a rearmar a mano
al volver la corriente), programaciones, lógica en el servidor, mantenimiento del filtro/cloro
(sigue en la pestaña Jacuzzi de Serweck).

## 2. Enfoque

Repositorio nuevo con la **misma estructura** que `aerothermal-temperature-control`:
TypeScript + Lit 3 + Rollup → un único `dist/lay-z-spa-card.js`, instalable por HACS como
repositorio personalizado. Se reutiliza (copiando, no compartiendo) la mecánica del dial de esa
tarjeta: geometría del arco, arrastre de la bolita con hit-test geométrico, `touch-action` para el
móvil, envío al soltar.

Descartados: generalizar la tarjeta de aerotermia (está acoplada a su instalación y arriesga algo
que funciona) y montarla con button-card/card-mod (el dial arrastrable no sale bien).

## 3. Aspecto

```
┌───────────────────────────────────────────┐
│ 🛁 Jacuzzi                     ⚡ 1.942 W  ⋮│  cabecera: nombre + consumo real (Shelly)
│            ╭─────────────────╮            │
│          ╱       Calor         ╲          │  modo o "Calentando"
│         │      37 °C           │         │  objetivo (arrastrable)
│         ●      💧 27 °C        │         │  agua ahora
│          ╲    (−)     (+)     ╱          │
│            ╰─────────────────╯            │
│   🌡 Amb. 23 °C · ⏳ Listo en 9 h 50 min  │  o "✓ Listo"
│   ⚠ E02 · 📴 Placa WiFi sin conexión      │  avisos (solo si los hay)
│ [ ⏻ ] [ 🌀 ] [ 🔥 ]           [ 🫧 ]      │  3 modos + burbujas separadas
└───────────────────────────────────────────┘
```

- **Rango del dial:** 20–40 °C, paso 1 (lo que admite la bomba; se lee de `min_temp`,
  `max_temp` y `target_temp_step` del climate, con esos valores por defecto).
- **Colores por modo:** calor naranja (como la aerotermia), filtro azul, apagado gris.
- **Arco:** colorea el hueco entre la temperatura actual y el objetivo.
- **Resistencia encendida** (`heater` = on): el texto del modo pasa a "Calentando" y la bolita
  hace un pulso suave.
- **"Listo en":** solo en modo calor y si `ready` está off. Se formatea en horas y minutos
  (`9 h 50 min`, `45 min`). Si `ready` está on en modo calor → "✓ Listo" en verde.
  Fuera de calor, la fila muestra solo el ambiente.
- **Burbujas:** botón separado a la derecha de la barra; encendido = resaltado. No cambia el modo.
- **Consumo:** potencia del Shelly en la cabecera, siempre en W sin decimales y con separador de
  miles español (`1.942 W`, `3 W`). Al pulsarlo abre el *more-info* de la energía de hoy.
- **Textos:** solo en español.

## 4. Configuración

```yaml
type: custom:lay-z-spa-card
name: Jacuzzi                                   # opcional
climate: climate.layzspa_temperature_control    # obligatorio
bubbles: switch.layzspa_airbubbles
heater: binary_sensor.layzspa_heater
ready: binary_sensor.layzspa_ready
time_to_ready: sensor.layzspa_time_to_ready     # en horas (decimal)
ambient: number.layzspa_amb_temp_c
error: sensor.layzspa_error                     # "0" = sin error
connection: binary_sensor.layzspa_connection
power_switch: switch.jacuzzi                    # Shelly, solo lectura
power: sensor.jacuzzi_power                     # W
energy_today: sensor.jacuzzi_energia_energy_daily
```

- Solo `climate` es obligatoria; el resto, si falta, oculta su dato o su aviso.
- `getStubConfig` rellena todas las claves buscando en `hass.states` las entidades con esos ids
  (prefijo `layzspa_` y `jacuzzi`), así al añadir la tarjeta funciona sin escribir nada.
- Editor visual con un selector de entidad por clave, como el de la aerotermia.

## 5. Acciones

| Control | Servicio |
|---|---|
| ⏻ Apagado | `climate.set_hvac_mode` → `off` |
| 🌀 Filtro | `climate.set_hvac_mode` → `fan_only` |
| 🔥 Calor | `climate.set_hvac_mode` → `heat` |
| Rueda / − / + | `climate.set_temperature` → `temperature` |
| 🫧 Burbujas | `switch.toggle` sobre `bubbles` |

- Al arrastrar se muestra el valor en vivo y se envía **una sola vez al soltar**.
- −/+ envían en cada pulsación (un grado), con el valor recortado al rango.
- Los modos que no estén en `hvac_modes` del climate no se pintan.
- Pulsar el centro del dial abre el *more-info* del climate.

## 6. Estados de disponibilidad

Se evalúan en este orden; el primero que se cumple manda:

| # | Condición | Qué muestra | Controles |
|---|---|---|---|
| 1 | `power_switch` = off | Dial gris, centro "Sin corriente" · "Enchufe apagado" | Desactivados |
| 2 | `connection` ≠ on **y** `power` < 1 W | Dial gris, "Rearma el diferencial del cable del jacuzzi" | Desactivados |
| 3 | `connection` ≠ on **y** (`power` ≥ 1 W o `power` sin dato) | Dial gris, "Placa WiFi sin conexión" | Desactivados |
| 4 | `climate` `unavailable`/`unknown` | Igual que el 3 | Desactivados |
| 5 | Normal | Dial, datos y modos | Activos |

En el estado 5, si `error` es distinto de `0` (y no `unavailable`), aparece además el aviso rojo
`⚠ E<código>` en la fila de avisos.

Si `power_switch` o `power` no están configurados, se saltan las reglas que los usan (sin
Shelly, la placa caída siempre da el estado 3).

## 7. Estructura del código

```
lay-z-spa-card/
├── src/
│   ├── lay-z-spa-card.ts   # tarjeta: render, dial, acciones
│   ├── editor.ts           # editor visual
│   ├── status.ts           # funciones puras: estado de disponibilidad, formato de horas,
│   │                       #   visibilidad de "Listo", geometría del dial
│   ├── types.ts            # LayZSpaCardConfig
│   └── const.ts            # versión, tags, valores por defecto
├── preview.html            # página local con hass simulado y los estados de la §6
├── dist/lay-z-spa-card.js
├── package.json · rollup.config.js · tsconfig.json · hacs.json
├── README.md · CHANGELOG.md · LICENSE (MIT) · .gitignore
└── docs/superpowers/specs/2026-10-05-lay-z-spa-card-design.md
```

`status.ts` no depende de Lit ni del DOM: recibe el objeto `hass.states` y la config y devuelve
datos, para poder probarlo sin navegador.

## 8. Pruebas

1. **Unitarias** de `status.ts` (estado de disponibilidad para cada fila de la §6, formato de
   horas, cuándo se ve "Listo en" / "✓ Listo", recorte del objetivo al rango). Runner ligero
   (`node --test` con los `.ts` compilados, o vitest si compensa).
2. `npm run typecheck` y `npm run build` sin errores.
3. **`preview.html`** con hass simulado: normal en filtro, calentando, listo, sin corriente,
   diferencial, placa caída, error E02, y a ancho de móvil.
4. **Prueba real** en Home Assistant con Chrome: cambiar los tres modos, arrastrar a 37 °C,
   −/+, burbujas on/off, y comprobar en el historial que cada orden llegó a la placa.

## 9. Instalación y despliegue

1. Mientras no exista el repositorio en GitHub: copiar `dist/lay-z-spa-card.js` a
   `/config/www/` y registrarlo como recurso `module` con `?v=<versión>`.
2. Con permiso del usuario: crear `serweck/lay-z-spa-card`, publicar la versión 0.1.0 e
   instalarla por HACS como repositorio personalizado (categoría Dashboard), quitando el recurso
   manual.
3. Sustituir el bloque Jacuzzi del Home del Resumen por la tarjeta (manteniendo el título que
   navega a `/dashboard-serweck/jacuzzi`) y añadirla arriba de esa pestaña. Copia de los
   dashboards antes de guardar.

## 10. Riesgos

- **Botones del panel físico** sin probar con el modelo `MIAMI2021`: no afecta a la tarjeta
  (usa MQTT), pero queda pendiente.
- **Umbral de 1 W** para distinguir diferencial de placa caída: con la bomba en reposo y la placa
  encendida el Shelly mide 2,8 W, así que una placa caída con la bomba en reposo sigue por encima;
  con el diferencial saltado el consumo debería ser ~0. Ajustable si la realidad lo contradice
  (constante `RCD_POWER_THRESHOLD_W`).
- **`time_to_ready`** lo estima la placa a partir de su historial de calentado: al principio puede
  ser poco preciso.
