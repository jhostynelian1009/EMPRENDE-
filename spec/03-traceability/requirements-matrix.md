# Matriz de trazabilidad

Esta matriz permite revisar un Pull Request sin depender de interpretaciones personales. `Prueba` indica la evidencia mínima; no sustituye los casos detallados de cada módulo.

## Requisitos generales

| ID | Requisito | Responsable técnico | Evidencia |
|---|---|---|---|
| GEN-01 | APK Android basada en Expo SDK 54/TypeScript | integración | `expo-doctor`, instalación y apertura |
| GEN-02 | Uso offline sin cuenta, backend ni servicios remotos | todas | modo avión y revisión de dependencias |
| GEN-03 | AsyncStorage respeta claves, versiones y fechas ISO | módulos con datos | cierre/reapertura e inspección de snapshots |
| GEN-04 | Errores de lectura/escritura son recuperables | todas | simulación de fallo sin cierre ni borrado |
| GEN-05 | Todo cambio entra por feature → develop → main | líder | Pull Requests e historial |
| GEN-06 | TypeScript y lint pasan | todas | salida de comandos en PR |

## Identidad y navegación

| ID | Resultado verificable | Rama | Prueba |
|---|---|---|---|
| IDV-01 | tokens exactos y centralizados | `feature/identidad-visual` | inspección de `src/theme` |
| IDV-02 | contraste correcto del naranja | misma | revisión de botones/textos |
| IDV-03 | Inicio adapta la referencia sin funciones excluidas | misma | captura y lista de alcance |
| IDV-04 | cinco pestañas exactas | misma | recorrido manual |
| IDV-05 | estados de componentes | misma | catálogo visual/manual |
| IDV-06 | Safe Area, scroll, teclado y fuente mayor | misma | dispositivos/tamaños |
| IDV-07 | español, sin usuario/avatar ficticio | misma | inspección de copy |
| IDV-08 | UI compartida desacoplada | misma | imports y uso en dos módulos |
| NAV-01…08 | comportamiento completo de Inicio/navegación | misma | casos de `02-navigation-home.md` |

## Módulos funcionales

| Rango | Módulo | Rama / skill | Fuente | Evidencia de cierre |
|---|---|---|---|---|
| APR-01…08 | Aprende | `feature/aprende` / `emprende-aprende` | `aprende/spec.md`, `content.md` | siete lecciones, navegación y reinicio |
| CAL-01…09 | Calculadora | `feature/calculadora` / `emprende-calculadora` | `calculadora/spec.md` | casos A, B, inválido y persistencia |
| IDEA-01…08 | Mi Idea | `feature/mi-idea` / `emprende-mi-idea` | `mi-idea/spec.md` | límites, edición, reinicio y fallos |
| QUIZ-01…09 | Quiz | `feature/quiz` / `emprende-quiz` | `quiz/spec.md`, `question-bank.md` | 10/7/6/0, incompleto, reinicio y repetir |
| RET-01…09 | Retos | `feature/retos` / `emprende-retos` | `retos/spec.md` | 0/3…3/3, bloqueo, edición y persistencia |
| PROJ-01…09 | Mi Proyecto | `feature/mi-proyecto` / `emprende-mi-proyecto` | `mi-proyecto/spec.md` | vacío, parcial, 100 %, refresh y corrupción |

## Dependencias entre módulos

| Consumidor | Proveedor | Contrato | Regla de integración |
|---|---|---|---|
| Inicio | todos | estados derivados de las cinco claves | no crea almacenamiento propio |
| Retos, Reto 2 | Calculadora | `precioSugerido` y resultados | lectura/copia confirmada; nunca escritura |
| Mi Proyecto | Mi Idea | snapshot de idea | resumen y navegación al origen |
| Mi Proyecto | Calculadora | snapshot completo | muestra valores, no recalcula |
| Mi Proyecto | Quiz | estado/puntaje/aprobación | completado aporta progreso aunque no apruebe |
| Mi Proyecto | Retos | tres estados | cada reto aporta un tercio del 25 % |

## Registro de decisión

| Fecha | Decisión | Motivo | Impacto |
|---|---|---|---|
| 29/08/2026 | Naranja como color principal, marino y verde azulado como combinación | decisión visual del líder y contraste | tokens/componentes/Inicio |
| 29/08/2026 | Adaptar la referencia, no copiar funciones | el prototipo es offline y sin cuenta | Inicio/navegación |
| 29/08/2026 | Cinco pestañas; Calculadora y Quiz por acciones | evitar saturación y respetar jerarquía móvil | rutas/Inicio |
| 29/08/2026 | Barajar opciones del quiz por ID | todas las correctas estaban inicialmente en posición A | Quiz/QA |
| 29/08/2026 | Mi Proyecto deriva progreso sin clave propia | fuente única y ausencia de datos duplicados | contratos/integración |
| 29/08/2026 | No usar `npm audit fix --force` | propone actualización incompatible de Expo | estabilidad del SDK 54 |

## Plantilla de verificación de PR

```markdown
### Alcance
- Rama:
- Skill usada:
- IDs cubiertos:

### Evidencia
- TypeScript:
- Lint:
- Pruebas manuales:
- Capturas/grabación:

### Integración
- Contratos leídos/escritos:
- Archivos compartidos modificados:
- Riesgos o pendientes:
```

