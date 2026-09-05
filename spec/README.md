# Especificación del sistema EMPRENDE+

Estado: aprobada para iniciar desarrollo.  
Fecha objetivo de entrega: 2 de septiembre de 2026.

## Orden de lectura

1. `00-project/01-vision-scope.md`
2. `00-project/02-tech-architecture.md`
3. `00-project/03-data-contracts.md`
4. `00-project/04-quality-git-release.md`
5. `01-design/01-design-system.md`
6. `01-design/02-navigation-home.md`
7. La carpeta de `02-modules/` correspondiente al trabajo asignado.
8. `03-traceability/requirements-matrix.md` para verificar cobertura.

## Jerarquía de decisiones

1. La indicación del docente y el alcance aprobado por el líder.
2. Los documentos compartidos de `00-project` y `01-design`.
3. La especificación funcional del módulo.
4. La skill, que explica cómo ejecutar el trabajo sin repetir los requisitos.

Una skill nunca reemplaza la especificación. Si aparece una contradicción, prevalece `spec/` y debe avisarse al líder.

## Definición de terminado

Un módulo está terminado cuando:

- cumple todos sus criterios de aceptación;
- respeta el contrato local y el sistema visual;
- no invade el alcance de otra rama;
- pasa TypeScript y lint;
- fue probado manualmente en Android;
- tiene evidencia en commits y Pull Request;
- fue integrado y verificado en `develop`.

