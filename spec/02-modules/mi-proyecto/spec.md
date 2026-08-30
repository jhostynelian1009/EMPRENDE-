# Especificación — Mi Proyecto

## Propósito

Reunir en una pantalla el avance de Mi Idea, Calculadora, Quiz y Retos. Es una vista derivada: no duplica formularios ni crea una clave propia.

## Ruta y archivos

- Ruta: `app/(tabs)/proyecto.tsx`.
- Modelo de vista, componentes y hook agregador: `src/modules/miProyecto/`.
- Lee las cuatro claves en paralelo al abrir y cada vez que la pantalla recupera el foco.

## Orden visual

| Orden | Bloque | Contenido | Acción |
|---:|---|---|---|
| 1 | Encabezado | nombre o `Mi Proyecto`, porcentaje y última actualización | `Continuar` según siguiente pendiente |
| 2 | Mi Idea | problema, solución y público; recursos bajo detalle | `Crear/Ver o editar idea` |
| 3 | Finanzas | costo total, precio sugerido, ganancia operativa y resultado inicial | `Calcular/Abrir calculadora` |
| 4 | Aprendizaje | pendiente, en curso o puntaje/aprobación del quiz | `Realizar/Continuar/Repetir quiz` |
| 5 | Retos | x de 3, estado de cada reto | `Comenzar/Continuar retos` |
| 6 | Siguiente paso | mensaje y una acción recomendada | depende del primer pendiente |

## Reglas de integración

- Validar cada snapshot independientemente con su contrato y versión.
- Un bloque ausente se muestra pendiente.
- Un bloque ilegible muestra error local; los demás continúan.
- Los botones navegan al módulo dueño del dato.
- Al volver, releer: no confiar en una copia antigua del estado.
- Fecha general = fecha ISO válida más reciente entre los snapshots disponibles.
- Progreso = fórmula de `03-data-contracts.md`.
- `quizCompleto` significa `status === completed`, independientemente de aprobación; el resultado visible conserva aprobado/no aprobado.
- Idea lista y cálculo listo requieren snapshots completos y válidos.

## Algoritmo de acción principal

1. Idea ausente/inválida → `Crear mi idea`.
2. Calculadora ausente/inválida → `Calcular finanzas`.
3. Quiz no completado → `Realizar quiz` o `Continuar quiz`.
4. Primer reto incompleto → `Continuar retos`.
5. Todo completo → `Revisar proyecto` y desplazarse por el resumen.

## Textos por estado general

| Estado | Título | Mensaje |
|---|---|---|
| 0 % | `Tu proyecto todavía no tiene información.` | `Empieza por describir tu idea de negocio.` |
| 1–99 % | `Vas avanzando.` | `Completa los módulos pendientes para construir tu proyecto.` |
| 100 % | `¡Tu proyecto está listo para presentar!` | `Revisa los datos antes de compartirlo.` |
| fallo total de lectura | `No pudimos cargar tu avance.` | `Intenta de nuevo; no eliminaremos tu información.` |

Bloque ilegible: `No pudimos leer esta sección. Puedes volver a completarla sin perder los demás avances.`

## Presentación financiera

Mostrar moneda con dos decimales. Resultado inicial incluye interpretación del módulo Calculadora. No recalcular con fórmulas duplicadas: usar valores del snapshot validado.

## Privacidad y acciones excluidas

No mostrar botón de compartir, exportar PDF, publicar ni enviar a mentor en v1. Los datos permanecen en el dispositivo.

## Criterios de aceptación

- `PROJ-01`: abre y orienta aunque las cuatro claves estén ausentes.
- `PROJ-02`: cada bloque proviene de la clave y campos documentados.
- `PROJ-03`: el porcentaje coincide con la fórmula para 0, parcial y 100 %.
- `PROJ-04`: la fecha general es la modificación válida más reciente.
- `PROJ-05`: cada acción abre el módulo correcto.
- `PROJ-06`: al regresar se muestran los cambios recientes.
- `PROJ-07`: una clave ilegible no oculta ni bloquea las demás.
- `PROJ-08`: no se escribe ninguna copia de datos de módulos.
- `PROJ-09`: orden, mensajes y diseño coinciden con esta especificación.

## Casos de prueba

1. Sin claves → 0 %, mensaje inicial, acción Mi Idea.
2. Idea válida → 25 %, bloque Idea completo, acción Calculadora.
3. Idea + cálculo + quiz + 2 retos → aproximadamente 91,67 %, mostrado 92 %.
4. Todo válido → 100 %, mensaje completo.
5. Quiz 6/10 completado → aporta 25 % y se muestra `No aprobado`.
6. Idea con JSON ilegible + otros válidos → error solo en Idea.
7. Editar Mi Idea y volver → resumen/fecha actualizados.

