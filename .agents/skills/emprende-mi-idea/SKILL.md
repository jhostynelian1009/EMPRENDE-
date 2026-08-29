---
name: emprende-mi-idea
description: "Implementa, revisa o planifica Mi Idea de EMPRENDE+ en feature/mi-idea: formulario, cinco campos, validación, edición, cambios sin guardar y AsyncStorage. Úsala cuando la tarea mencione idea de negocio, problema, solución, público o recursos."
---

# Módulo Mi Idea

## Antes de actuar

1. Confirma `feature/mi-idea`; si no coincide, detente y avisa.
2. Lee `AGENTS.md`, arquitectura, contratos, sistema visual y `spec/02-modules/mi-idea/spec.md`.
3. Si la tarea es solo análisis/plan/revisión, no modifiques archivos.

## Alcance

Trabaja en `app/(tabs)/mi-idea.tsx` y `src/modules/miIdea/**`. Usa infraestructura compartida sin reescribirla.

No agregues campos, backend, múltiples ideas, exportación, login o una copia para Mi Proyecto. No modifiques navegación, contratos o módulos ajenos.

## Procedimiento

1. Relaciona el trabajo con `IDEA-*` y presenta plan.
2. Define tipos y validación pura; aplica `trim()` antes de validar/guardar.
3. Implementa formulario accesible, errores asociados y foco al primero.
4. Precarga, edita y guarda exactamente el contrato aprobado.
5. Protege cambios sin guardar y conserva valores si la escritura falla.
6. Prueba vacío, límites, 51 caracteres, persistencia y errores simulados.
7. Ejecuta TypeScript/lint e informa cambios, pruebas y pendientes. No hagas operaciones Git remotas sin petición explícita.
