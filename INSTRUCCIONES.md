# EMPRENDE+ — paquete de especificaciones y skills

Versión documental: 1.0  
Fecha: 29 de agosto de 2026  
Destino: repositorio Expo SDK 54 de EMPRENDE+

Este paquete convierte los entregables funcionales revisados y las decisiones visuales aprobadas en una fuente de verdad lista para el desarrollo. No contiene programación de los módulos.

## Contenido

- `AGENTS.md`: reglas obligatorias para cualquier agente o integrante que trabaje en el repositorio.
- `spec/`: alcance, arquitectura, contratos de datos, diseño, requisitos, pruebas y trazabilidad.
- `.agents/skills/`: una skill de Antigravity por cada rama modular.
- `assets/dashboard-reference.jpg`: imagen proporcionada por el líder; se usa como referencia de composición, no para copiar funciones ni contenido.

## Incorporación segura al repositorio

Ejecutar en PowerShell desde la carpeta local de EMPRENDE+:

```powershell
git switch develop
git pull --ff-only origin develop
git switch -c docs/spec-as-skills
```

Después, extraer **el contenido** del ZIP en la raíz del repositorio. Deben quedar allí `AGENTS.md`, `spec`, `.agents` y `assets`.

Verificar antes de guardar:

```powershell
git status --short
git add AGENTS.md spec .agents assets
git commit -m "docs: agregar especificaciones y skills de EMPRENDE+"
git push --set-upstream origin docs/spec-as-skills
```

Crear un Pull Request de `docs/spec-as-skills` hacia `develop`. No enviar este paquete directamente a `main`.

## Uso por cada integrante

1. Cambiar a la rama del módulo asignado y actualizarla desde `develop` antes de programar.
2. Pedir a Antigravity que use la skill correspondiente, por ejemplo: `Usa $emprende-calculadora y prepara el plan de implementación del módulo`.
3. Revisar el plan antes de autorizar cambios de código.
4. Implementar solamente lo descrito en la especificación del módulo.
5. Ejecutar TypeScript, lint y las pruebas manuales indicadas.
6. Crear Pull Request desde la rama `feature/*` hacia `develop`.

## Regla de cambios

Si una decisión funcional cambia, primero se modifica su archivo de `spec/`, se registra la razón y se revisan los módulos afectados. Las skills no deben contener requisitos distintos a los de la especificación.

