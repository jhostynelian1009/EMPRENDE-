---
name: emprende-calculadora
description: "Implementa, revisa o planifica la Calculadora financiera de EMPRENDE+ en feature/calculadora: entradas, parseo, validaciones, fórmulas, resultados, interpretación y persistencia. Úsala cuando se mencionen costos, precio, margen, ganancia o cálculo financiero."
---

# Calculadora financiera

## Antes de actuar

1. Confirma `feature/calculadora`; si no coincide, detente.
2. Lee `AGENTS.md`, arquitectura, contratos, sistema visual y `spec/02-modules/calculadora/spec.md` completos.
3. No edites si solo se solicitó explicar, revisar o planificar.

## Alcance

Trabaja en `app/calculadora.tsx` y `src/modules/calculadora/**`. Consume `src/storage` y componentes compartidos.

No cambies fórmulas, rangos, moneda, contrato, navegación compartida ni otros módulos. No instales librerías de formularios o decimales sin aprobación.

## Procedimiento

1. Mapea el trabajo a `CAL-*` y separa dominio puro de UI/persistencia.
2. Implementa primero parseo y validación; luego fórmulas con precisión completa.
3. Comprueba los casos A, B e inválido de la spec.
4. Guarda únicamente cálculos válidos y conserva entradas ante errores.
5. Representa interpretación positiva, cero y negativa con texto e icono.
6. Prueba coma/punto, límites, cantidad decimal/cero, teclado y reinicio.
7. Ejecuta TypeScript y lint. Reporta archivos, casos y resultados; no hagas commit/push/PR salvo autorización.
