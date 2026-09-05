---
name: emprende-mi-proyecto
description: "Implementa, revisa o planifica Mi Proyecto de EMPRENDE+ en feature/mi-proyecto: lectura agregada, resumen, porcentaje, fechas, estados parciales, acciones y tolerancia a claves ilegibles. Úsala para integración o resumen del proyecto del estudiante."
---

# Módulo Mi Proyecto

## Antes de actuar

1. Confirma `feature/mi-proyecto`; si no coincide, detente.
2. Lee `AGENTS.md`, arquitectura, contratos, sistema visual y `spec/02-modules/mi-proyecto/spec.md`. Lee la spec de otro módulo solo para aclarar uno de sus campos.
3. Si la petición es revisión/plan, permanece en modo lectura.

## Alcance

Trabaja en `app/(tabs)/proyecto.tsx` y `src/modules/miProyecto/**`. Puede importar validadores/tipos públicos de módulos sin modificarlos.

No crea clave propia, no copia ni edita datos, no duplica fórmulas, no agrega compartir/exportar, no cambia repositorios o pantallas de módulos fuente.

## Procedimiento

1. Mapea el trabajo a `PROJ-*` y presenta plan.
2. Lee las cuatro claves en paralelo y valida cada resultado independientemente.
3. Construye un modelo de vista derivado con porcentaje y fecha más reciente.
4. Implementa estados 0 %, parcial, 100 %, error de bloque y fallo total.
5. Relee al recuperar foco y navega siempre al módulo propietario.
6. Prueba los siete escenarios de la spec, especialmente 92 % y JSON ilegible.
7. Ejecuta TypeScript/lint y reporta archivos/pruebas. No hagas commit, push o PR sin solicitud explícita.
