---
name: emprende-retos
description: "Implementa, revisa o planifica los tres Retos de EMPRENDE+ en feature/retos: desbloqueo secuencial, formularios, avance parcial, validación, progreso e integración de lectura con Calculadora. Úsala para actividades prácticas, desafíos o progreso de retos."
---

# Retos de emprendimiento

## Antes de actuar

1. Confirma `feature/retos`; si no coincide, detente.
2. Lee `AGENTS.md`, arquitectura, contratos, sistema visual y `spec/02-modules/retos/spec.md`.
3. Si se pidió documento, análisis o plan, no edites código.

## Alcance

Trabaja en `app/(tabs)/retos.tsx`, `app/retos/[challengeId].tsx` y `src/modules/retos/**`.

No cambies cantidad/orden/contenido de retos, no uses IA para evaluar respuestas, no escribas en la clave de Calculadora, no implementes audio, y no modifiques otros módulos o layouts.

## Procedimiento

1. Relaciona la tarea con `RET-*` y presenta plan.
2. Modela los tres retos e IDs/campos exactamente como la spec.
3. Implementa estados, desbloqueo y guardado parcial antes del detalle visual.
4. Permite copiar precio de Calculadora solo tras acción y confirmación.
5. Si se edita un reto completo y queda inválido, vuelve a `started` al guardar.
6. Prueba 0/3 a 3/3, bloqueos, límites, persistencia, ID inválido y fallo de escritura.
7. Ejecuta TypeScript/lint y reporta evidencia; no hagas Git remoto sin autorización.
