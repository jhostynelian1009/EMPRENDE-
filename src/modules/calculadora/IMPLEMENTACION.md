# Calculadora financiera — lo implementado

Rama: `feature/calculadora`  
Skill: `emprende-calculadora`  
Fuente: `spec/02-modules/calculadora/spec.md`  
Fecha: 30 de agosto de 2026

## Qué hace

Pantalla educativa en `/calculadora` que estima costos, precio sugerido, ingresos, ganancia operativa y si se recupera la inversión inicial. No es asesoría financiera.

Al abrir la ruta se ve:

1. explicación corta y aviso educativo;
2. formulario de cinco entradas;
3. botón **Calcular**;
4. resumen de resultados (dos decimales);
5. interpretación con texto e icono;
6. **Modificar datos** y **Limpiar**.

## Archivos

| Archivo | Rol |
|---|---|
| `app/calculadora.tsx` | Ruta y composición de la pantalla |
| `src/modules/calculadora/domain/parse.ts` | Parseo de coma/punto, enteros y rechazos |
| `src/modules/calculadora/domain/validate.ts` | Obligatoriedad, tipo y rangos |
| `src/modules/calculadora/domain/calculate.ts` | Fórmulas con precisión completa |
| `src/modules/calculadora/domain/interpret.ts` | Signo del resultado inicial |
| `src/modules/calculadora/domain/format.ts` | Redondeo solo al mostrar |
| `src/modules/calculadora/domain/snapshot.ts` | Forma y versión del contrato |
| `src/modules/calculadora/domain/referenceCases.ts` | Casos A, B e inválido |
| `src/modules/calculadora/storage/calculatorRepository.ts` | Lectura, escritura y borrado |
| `src/modules/calculadora/hooks/useCalculator.ts` | Estado de pantalla y persistencia |
| `src/modules/calculadora/components/*` | Formulario, resultados, interpretación y acciones |
| `src/storage/keys.ts` | Clave `@emprende_plus:calculadora` |
| `src/storage/jsonStorage.ts` | Adaptador JSON de AsyncStorage |

`src/storage` es un adaptador compartido mínimo. Hace falta para persistir; no implementa otros módulos.

## Contrato guardado

Clave: `@emprende_plus:calculadora`

Se guarda solo después de un cálculo válido:

- `schemaVersion: 1`
- `inputs` (cinco números)
- `results` (siete números, sin formatear)
- `updatedAt` en ISO 8601

Un JSON ilegible o una versión desconocida no se borra. La pantalla muestra un aviso recuperable.

## Requisitos cubiertos

| ID | Cómo se cubre |
|---|---|
| CAL-01 | `validateCalculatorForm` aplica tipo, obligatorio y rango |
| CAL-02 | `parseDecimal` acepta coma o punto; rechaza ambos a la vez |
| CAL-03 | Fórmulas coinciden con los casos A y B |
| CAL-04 | Cálculo completo; `formatMoney` muestra dos decimales (`9,10`) |
| CAL-05 | Interpretación usa el valor completo, no el texto redondeado |
| CAL-06 | Entrada inválida no calcula ni guarda un resultado nuevo |
| CAL-07 | Último cálculo persiste; **Limpiar** pide confirmación si hay snapshot |
| CAL-08 | `KeyboardAvoidingView` + `ScrollView` mantienen visible el formulario |
| CAL-09 | Parseo, validación y fórmulas son funciones puras |

## Casos de referencia

### Caso A

Entradas: 500 / 200 / 5 / 100 / 30 %

Resultados: variable total 500; total 700; unitario 7,00; precio 9,10; ingresos 910,00; ganancia 210,00; inicial **-290,00** → *Inversión todavía no recuperada*

### Caso B

Entradas: 100 / 50 / 2 / 100 / 50 %

Resultados: variable total 200; total 250; unitario 2,50; precio 3,75; ingresos 375,00; ganancia 125,00; inicial **25,00** → *Ganancia estimada*

### Caso inválido

Vacío / -50 / `cinco` / 0 / 120 → errores por campo, sin resultado nuevo y sin persistir.

Estos tres casos se comprobaron con `assertReferenceCases()`.

## Comprobaciones ejecutadas

```bash
npx tsc --noEmit
npm run lint
```

Ambos pasaron. También se ejecutaron los casos A, B, inválido, coma/punto e interpretación de signo 0.

## Cómo probar en Android

1. Arrancar `npx expo start` y abrir la ruta `calculadora` (desde Inicio cuando exista la tarjeta, o escribiendo `/calculadora`).
2. Repetir los casos A, B e inválido.
3. Probar `100,5` y `50.25`, cantidad decimal, margen 0 y 100.
4. Cerrar y reabrir la app: debe reaparecer el último cálculo.
5. **Limpiar** debe pedir confirmación y borrar solo esta clave.
6. Revisar que el teclado no tape campo, error ni **Calcular**.

## Pendiente

- Prueba manual en dispositivo Android (esta sesión no la ejecutó).
- Cuando `feature/identidad-visual` entregue `Screen`, `AppHeader`, `TextField` y botones compartidos, sustituir los controles locales del módulo.
- Inicio y Mi Proyecto deben enlazar a esta ruta; no se modificó la navegación compartida.
- No se hizo commit, push ni Pull Request.
