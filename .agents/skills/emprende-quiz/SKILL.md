---
name: emprende-quiz
description: "Implementa, revisa o planifica el Quiz de EMPRENDE+ en feature/quiz: diez preguntas, opciones barajadas con IDs, borrador, puntaje, aprobación, resultado y retroalimentación. Úsala para cuestionario, preguntas, calificación o QA del quiz."
---

# Módulo Quiz

## Antes de actuar

1. Confirma `feature/quiz`; si no coincide, detente.
2. Lee `AGENTS.md`, arquitectura, contratos, sistema visual, `spec/02-modules/quiz/spec.md` y `question-bank.md` completos.
3. No programes si la solicitud solo pide revisar o planificar.

## Alcance

Trabaja en `app/quiz/**` y `src/modules/quiz/**`. Consume componentes y almacenamiento compartidos.

No cambies preguntas, respuesta correcta, umbral 7/10 ni retroalimentaciones. No califiques por índice/letra, no muestres siempre la correcta primero, no modifiques navegación o módulos ajenos.

## Procedimiento

1. Mapea la tarea a `QUIZ-*` y planifica.
2. Modela el banco con IDs estables; separa barajado y calificación en funciones puras.
3. Mantén el orden barajado durante el intento y persiste por IDs.
4. Bloquea finalización incompleta y confirma antes de calificar/repetir.
5. Implementa revisión accesible con elección, correcta y retroalimentación.
6. Ejecuta casos 10/10, 7/10, 6/10, 0/10, incompleto, reinicio y repetición.
7. Ejecuta TypeScript/lint; reporta resultados. No hagas commit, push o PR sin petición explícita.
