---
name: emprende-identidad-visual
description: "Implementa, revisa o planifica la identidad visual, tokens, componentes compartidos, navegación e Inicio de EMPRENDE+ en feature/identidad-visual. Úsala para paleta naranja, estilos, UI compartida, dashboard, tabs, accesibilidad visual o logo."
---

# Identidad visual, Inicio y navegación

## Antes de actuar

1. Confirma `feature/identidad-visual`; si no coincide, detente y avisa.
2. Lee `AGENTS.md`, `spec/00-project/01-vision-scope.md`, `spec/00-project/02-tech-architecture.md`, ambos archivos de `spec/01-design/` y `spec/02-modules/identidad-visual/spec.md`.
3. Inspecciona `assets/dashboard-reference.jpg` solo como referencia de composición.
4. Si la solicitud es documental o de revisión, no programes.

## Alcance

Trabaja en `src/theme/**`, `src/components/ui/**`, `app/_layout.tsx`, `app/(tabs)/_layout.tsx`, `app/(tabs)/index.tsx` y activos aprobados.

No implementes lógica, contenido, validadores o almacenamiento de módulos. No agregues perfil, cuenta, campana, comunidad, mentores, red, degradados, fuentes o dependencias no aprobadas. No inventes el logo.

## Procedimiento

1. Mapea la tarea a `IDV-*` o `NAV-*` y presenta plan.
2. Crea primero tokens; elimina colores/espacios duplicados de tu alcance.
3. Construye componentes accesibles y después Inicio/navegación.
4. Usa datos derivados o interfaces de integración, nunca una clave nueva de Inicio.
5. Revisa contraste: blanco solo sobre `primaryDark`, no sobre naranja brillante para texto pequeño.
6. Prueba Safe Area, pantalla estrecha, texto aumentado y estados sin datos/parcial/completo/error.
7. Ejecuta TypeScript y lint; informa cambios y evidencia. No hagas operaciones Git remotas sin solicitud explícita.
