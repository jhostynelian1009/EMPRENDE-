# Sistema visual de EMPRENDE+

## Dirección aprobada

Interfaz educativa, limpia y actual, inspirada en la referencia `assets/dashboard-reference.jpg`: jerarquía tipográfica clara, tarjetas redondeadas, recorrido horizontal de módulos, bloques apilados, progreso visible y barra inferior. La referencia no define funcionalidades ni debe copiarse literalmente.

La marca se construye alrededor del naranja, combinado con azul marino para confianza y verde azulado para progreso. El resultado debe sentirse enérgico, ordenado y fácil de usar, no infantil ni corporativo pesado.

## Paleta

| Token | Valor | Uso |
|---|---:|---|
| `color.primary` | `#F97316` | identidad, iconos activos, bordes destacados, tarjetas con texto oscuro |
| `color.primaryDark` | `#C2410C` | botones primarios con texto blanco |
| `color.primaryLight` | `#FFEDD5` | fondos suaves y etiquetas |
| `color.secondary` | `#17365D` | títulos, navegación y contraste institucional |
| `color.accent` | `#0F766E` | progreso, enlaces secundarios y estados informativos |
| `color.background` | `#FFF7ED` | fondo general cálido |
| `color.surface` | `#FFFFFF` | tarjetas y formularios |
| `color.text` | `#1F2937` | texto principal |
| `color.textMuted` | `#6B7280` | texto auxiliar |
| `color.border` | `#E5E7EB` | separadores y campos |
| `color.success` | `#15803D` | logro/aprobado |
| `color.warning` | `#B45309` | pendiente o atención |
| `color.error` | `#B91C1C` | errores y datos inválidos |

### Regla de contraste

- No usar texto blanco pequeño sobre `#F97316`; el naranja brillante no ofrece contraste suficiente para texto normal.
- Para botones con texto blanco usar `#C2410C`.
- Sobre `#F97316`, usar `#1F2937` o un tono igualmente oscuro.
- Todo estado también incluye icono o texto; nunca depende solo del color.

## Tipografía

Usar la fuente del sistema para evitar dependencias: San Francisco en iOS y Roboto en Android.

| Estilo | Tamaño / línea | Peso | Uso |
|---|---|---|---|
| `display` | 32 / 38 | 700 | bienvenida en Inicio |
| `h1` | 28 / 34 | 700 | título de pantalla |
| `h2` | 22 / 28 | 700 | secciones |
| `h3` | 18 / 24 | 600 | tarjetas |
| `body` | 16 / 24 | 400 | contenido y formularios |
| `bodySmall` | 14 / 20 | 400 | metadatos |
| `label` | 14 / 18 | 600 | botones y campos |
| `caption` | 12 / 16 | 500 | progreso y ayuda breve |

No usar menos de 12 px. Respetar el escalado de texto del dispositivo y evitar alturas fijas para párrafos.

## Espaciado y geometría

- Base: 4 px.
- Escala: 4, 8, 12, 16, 24, 32 y 40.
- Margen horizontal de pantalla: 20 px; mínimo 16 px en pantallas estrechas.
- Separación entre secciones: 24 px.
- Relleno de tarjeta: 16 px.
- Radio de tarjeta: 16 px.
- Radio de botón y campo: 12 px.
- Altura mínima táctil: 48 px.
- Iconos comunes: 20–24 px; icono de tarjeta: 28–32 px.

## Sombras

Sombra tenue solo para separar tarjetas blancas del fondo:

```ts
{
  shadowColor: '#000000',
  shadowOpacity: 0.08,
  shadowRadius: 8,
  shadowOffset: { width: 0, height: 3 },
  elevation: 2,
}
```

No combinar sombras fuertes con bordes gruesos.

## Componentes compartidos

### `Screen`

Aplica Safe Area, fondo, margen horizontal y desplazamiento cuando haga falta.

### `AppHeader`

Título, subtítulo opcional y acción de regreso. No muestra avatar, campana ni configuración en v1.

### `PrimaryButton`

Fondo `primaryDark`, texto blanco, altura mínima 48, estados normal/presionado/deshabilitado/cargando.

### `SecondaryButton`

Fondo blanco, borde `primaryDark`, texto `primaryDark`.

### `ModuleCard`

Icono, título, explicación breve, progreso/estado y acción. En Inicio puede usar color de acento; el texto debe conservar contraste.

### `ContentCard`

Superficie blanca para lecciones, resumen, resultados y mensajes.

### `ProgressBar`

Pista `#E5E7EB`, progreso `accent`, altura 8, radio completo y porcentaje en texto.

### `TextField`

Etiqueta visible, ayuda opcional, borde, texto de error debajo y contador solo donde exista máximo. El placeholder no sustituye la etiqueta.

### `StatusBadge`

Estados pendiente, iniciado, completado, aprobado y no aprobado con texto e icono.

### `EmptyState` / `ErrorState`

Título directo, explicación corta y una acción recuperable.

## Iconografía e imágenes

- Usar el conjunto de iconos ya incluido por la plantilla de Expo cuando sea posible.
- Mantener un único estilo de trazo.
- No usar emojis como iconos principales.
- Las ilustraciones futuras deben ser simples, inclusivas y tener texto alternativo cuando aporten información.

## Logo

Mientras se entrega el activo definitivo, usar el nombre `EMPRENDE+` en peso 700, con `EMPRENDE` en azul marino y `+` en naranja. No inventar un isotipo adicional. Al recibir el logo, conservar versiones SVG/PNG y no deformarlo.

## Accesibilidad y adaptación

- Contraste mínimo de 4.5:1 para texto normal y 3:1 para texto grande/controles.
- Soportar pantallas Android estrechas sin desplazamiento horizontal, excepto el carrusel intencional de módulos.
- Mantener visible el botón del formulario con teclado mediante scroll y manejo de teclado.
- Etiquetas de controles comprensibles para lector de pantalla.
- El foco vuelve al título al cambiar de pantalla y va al primer error al validar.

## Prohibiciones

- No introducir degradados, colores neon, vidrio, fondos oscuros o estilos diferentes por módulo.
- No asignar a cada pantalla una paleta independiente.
- No imitar avatar, notificaciones, comunidad, mentores o cursos en línea de la referencia.
- No usar textos de ejemplo en inglés.

