# Changelog

Todas las versiones notables de este proyecto se documentan aquí.
El formato sigue [Keep a Changelog](https://keepachangelog.com/) y
[SemVer](https://semver.org/lang/es/).

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
