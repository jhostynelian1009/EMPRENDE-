# Especificación — Aprende

## Propósito

Presentar siete lecciones cortas en orden, permitir su consulta offline, recordar la última lección y mostrar progreso. La pregunta de repaso es reflexiva: no se califica automáticamente.

## Alcance

Incluye catálogo, detalle, navegación anterior/siguiente, marcado de lección revisada y persistencia. No incluye creación de cursos, videos en línea, calificaciones, comentarios ni certificados.

## Fuentes y rutas

- Contenido obligatorio: `content.md`.
- Catálogo: `app/(tabs)/aprende.tsx`.
- Detalle: `app/aprende/[lessonId].tsx`.
- Dominio/repositorio: `src/modules/aprende/`.

## IDs y orden

1. `emprendimiento`
2. `idea-de-negocio`
3. `innovacion`
4. `mercado`
5. `modelo-de-negocio`
6. `marketing-digital`
7. `costos-y-precios`

No modificar IDs ni orden sin migrar el progreso local.

## Pantalla de catálogo

- Encabezado `Aprende` y explicación breve.
- Progreso `x de 7 lecciones revisadas` y barra.
- Siete tarjetas con número, título, objetivo corto y estado.
- Acción `Comenzar` en la primera pendiente, `Continuar` en la última y `Repasar` en completadas.
- No bloquear lecciones: el estudiante puede abrir cualquiera.

## Pantalla de lección

Orden obligatorio:

1. número y título;
2. objetivo;
3. explicación;
4. ejemplo;
5. tarjeta `Idea clave`;
6. pregunta de repaso;
7. respuesta esperada colapsada bajo `Ver orientación`;
8. botón `Marcar como revisada` o estado `Lección revisada`;
9. anterior/siguiente.

## Reglas

- Marcar una lección añade su ID sin duplicarlo y actualiza `lastLessonId`/`updatedAt`.
- Abrir una lección actualiza `lastLessonId`, pero no la completa.
- Desmarcar no es parte del flujo principal; `Repasar` no cambia el estado.
- Si el ID de ruta no existe, mostrar `Lección no encontrada` y volver al catálogo.
- El contenido está incorporado en la app y se muestra completo con scroll.

## Estados y mensajes

| Estado | Texto | Acción |
|---|---|---|
| sin avance | `Empieza con los conceptos básicos del emprendimiento.` | `Comenzar` |
| parcial | `Has revisado x de 7 lecciones.` | `Continuar` |
| completo | `¡Completaste las siete lecciones! Puedes repasarlas cuando quieras.` | `Repasar` |
| error de guardado | `No pudimos guardar tu progreso. Intenta de nuevo.` | `Reintentar` |

## Criterios de aceptación

- `APR-01`: aparecen exactamente siete lecciones en el orden definido.
- `APR-02`: cada detalle conserva todos los bloques de `content.md`.
- `APR-03`: marcar como revisada actualiza contador y barra sin duplicados.
- `APR-04`: el progreso persiste después de cerrar y abrir la APK.
- `APR-05`: anterior/siguiente respetan límites y rutas.
- `APR-06`: un ID inválido produce estado recuperable.
- `APR-07`: textos largos y fuente aumentada son desplazables y legibles.
- `APR-08`: no se califica la respuesta abierta.

## Pruebas mínimas

1. Abrir las siete tarjetas y comparar título/contenido.
2. Completar lecciones 1 y 3; confirmar `2 de 7` sin necesidad de orden secuencial.
3. Repasar una completada y confirmar que el conteo no cambia.
4. Cerrar/reabrir y comprobar progreso y última lección.
5. Abrir `/aprende/desconocida` y volver sin cierre.

