---
name: emprende-aprende
description: "Implementa, revisa o planifica el módulo Aprende de EMPRENDE+ en feature/aprende: catálogo, siete lecciones, detalle, progreso local y navegación. Úsala cuando la tarea mencione Aprende, lecciones, contenido educativo o progreso de lectura."
---

# Módulo Aprende

## Antes de actuar

1. Confirma que la rama sea `feature/aprende`; si no, detente y avisa.
2. Lee `AGENTS.md`, `spec/README.md`, `spec/00-project/02-tech-architecture.md`, `spec/00-project/03-data-contracts.md`, `spec/01-design/01-design-system.md`, `spec/02-modules/aprende/spec.md` y `spec/02-modules/aprende/content.md`.
3. Si la solicitud solo pide análisis o plan, no modifiques código.

## Alcance

Trabaja en `app/(tabs)/aprende.tsx`, `app/aprende/[lessonId].tsx` y `src/modules/aprende/**`. Consume componentes compartidos sin rediseñarlos.

No resumas ni inventes contenido, no califiques preguntas abiertas, no cambies IDs/orden de lecciones, contratos, layouts compartidos, dependencias o módulos ajenos.

## Procedimiento

1. Relaciona el trabajo con IDs `APR-*` y presenta un plan breve.
2. Modela contenido estático separado de las pantallas.
3. Implementa persistencia mediante el contrato compartido y evita duplicados.
4. Cubre catálogo, detalle, límites anterior/siguiente, estado vacío, error e ID inválido.
5. Usa tokens/componentes aprobados y texto completo.
6. Ejecuta `npx tsc --noEmit`, `npm run lint` y las pruebas manuales de la spec.
7. Reporta archivos, requisitos cubiertos, comprobaciones y pendientes. No hagas commit, push o PR salvo petición explícita.
