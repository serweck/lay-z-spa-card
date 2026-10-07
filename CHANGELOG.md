# Changelog

Todas las versiones notables de este proyecto se documentan aquí.
El formato sigue [Keep a Changelog](https://keepachangelog.com/) y
[SemVer](https://semver.org/lang/es/).

## [0.2.9] - 2026-10-07

### Añadido
- **«Hoy no lo uso»** en los ajustes (clave nueva `skip_today`, `input_boolean.jacuzzi_hoy_no`): un interruptor
  para dejar el jacuzzi solo en mantenimiento el resto del día sin cambiar el uso. Se ofrece con uso Hoy/Siempre
  (y siempre que esté encendido, para poder apagarlo). Encendido, la tarjeta trata el día como uso No: el dial
  edita el mantenimiento, se oculta «Baño hoy a las» y el resumen plegado dice «Hoy no se usa». Lo apaga
  Home Assistant a medianoche.

## [0.2.8] - 2026-10-06

### Añadido
- Con «Calentar igualmente» ya respondido (`c: true` en el plan) queda solo el botón «Mantener», para volver
  atrás. Así se puede cambiar de idea en los dos sentidos.

## [0.2.7] - 2026-10-06

### Corregido
- El botón «Calentar igualmente» va en naranja de calor; con el jacuzzi apagado salía gris y parecía desactivado.

## [0.2.6] - 2026-10-06

### Añadido
- **Horas del baño en los ajustes**: «Baño hoy a las», «Baño hasta» (clave `ready_until`: después solo
  mantenimiento hasta el día siguiente; 00:00 = hasta medianoche), «Laborables» (`ready_time_workday`) y
  «Festivos y finde» (`ready_time_holiday`), las horas por defecto de cada tipo de día. Las tres nuevas se
  pueden cambiar con cualquier uso. El resumen plegado muestra la franja: «Baño 20:00–23:30».

### Cambiado
- Con «Mantener» ya respondido (`k: true` en el plan) solo queda el botón «Calentar igualmente», por si
  se cambia de idea.

## [0.2.5] - 2026-10-06

### Añadido
- **Botones «Calentar igualmente» y «Mantener»** bajo la línea del plan cuando el planificador dice que no
  llega a la hora (`i: true` en el plan). Llaman al script de la clave nueva `answer_script`
  (`script.jacuzzi_respuesta_no_llega`) con la respuesta y el nombre del usuario, igual que los botones de
  Telegram y del móvil. No se muestran en modo observar.

## [0.2.1] - 2026-10-06

### Añadido
- **Botón del planificador** centrado en la cabecera (entre el nombre y la potencia): enciende o apaga
  `planner` con un toque. Se muestra también apagado, para poder volver a encenderlo.

### Cambiado
- La cabecera pasa a tres columnas y el chip `+W red` baja a la fila de información, para que no se
  corte el nombre ni la potencia.

## [0.2.0] - 2026-10-06

### Añadido
- **Planificador del jacuzzi** (claves opcionales `usage`, `desired`, `maintenance`, `plan`, `planner`,
  `observe`, `grid_extra`). Con el planificador encendido:
  - el dial y −/+ editan la **temperatura deseada** (uso Hoy/Siempre) o la de **mantenimiento** (uso No),
    con la leyenda correspondiente bajo el número;
  - selector **No · Hoy · Siempre**;
  - línea con el **motivo del plan** (`· red` si autoriza la red; atenuada y con "Observando:" en modo
    observar);
  - **mantenimiento** editable con −/+ cuando el uso es Hoy/Siempre.
- Chip **+W de red** en la cabecera mientras Node-RED importa de la red para el jacuzzi.

### Cambiado
- Sin las claves nuevas, o con el planificador apagado, la tarjeta se comporta exactamente como la 0.1.1.

## [0.1.1] - 2026-10-05

### Corregido
- Si el termostato no tiene objetivo, el dial muestra `--` en vez de 20 °C y no pinta la bolita.
- Al soltar un arrastre no se envía nada si la placa ha dejado de estar disponible a mitad.
- Un segundo dedo que se levanta ya no termina el arrastre del primero.
- Las temperaturas se redondean a un decimal (`23,5 °C`, `27 °C`).
- El botón de burbujas se desactiva si el interruptor no tiene datos.

### Cambiado
- Quitado código que no hacía nada (clase `off` del dial y un `shouldUpdate` igual al de Lit).

## [0.1.0] - 2026-10-05

### Añadido
- Dial de temperatura (20–40 °C) con objetivo arrastrable, −/+ y temperatura actual del agua.
- Modos apagado / filtro / calor y botón de burbujas independiente.
- Temperatura ambiente, "Listo en" en horas y minutos y aviso "Listo".
- Consumo real del enchufe en la cabecera.
- Avisos de error de la bomba, sin corriente, diferencial saltado y placa WiFi sin conexión.
- Editor visual y detección automática de las entidades al añadir la tarjeta.
