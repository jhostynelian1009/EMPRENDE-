# Especificación — Calculadora financiera

## Propósito

Estimar costos, precio sugerido, ingresos, ganancia operativa y recuperación inicial a partir de cinco entradas. Es una herramienta educativa, no asesoría financiera.

## Ruta y archivos

- Ruta: `app/calculadora.tsx`.
- Dominio, componentes, hooks y repositorio: `src/modules/calculadora/`.
- Clave local: `@emprende_plus:calculadora`.

## Entradas

| Campo | Tipo lógico | Regla | Mensaje principal |
|---|---|---|---|
| Inversión inicial | decimal | requerido, ≥ 0 | `Ingresa la inversión inicial.` |
| Costos fijos | decimal | requerido, ≥ 0 | `Ingresa los costos fijos.` |
| Costo variable por unidad | decimal | requerido, ≥ 0 | `Ingresa el costo variable por unidad.` |
| Cantidad de productos | entero | requerido, > 0 | `La cantidad debe ser un entero mayor que cero.` |
| Margen de ganancia | decimal | requerido, 0–100 | `El margen debe estar entre 0 % y 100 %.` |

Aceptar una coma o un punto como separador decimal. Recortar espacios. Rechazar letras, infinitos, `NaN`, signos mezclados o formatos ambiguos con coma y punto a la vez. La cantidad no acepta decimales.

## Fórmulas exactas

```text
costoVariableTotal = costoVariableUnitario × cantidad
costoTotal = costosFijos + costoVariableTotal
costoUnitario = costoTotal ÷ cantidad
precioSugerido = costoUnitario × (1 + margenPorcentaje ÷ 100)
ingresosEstimados = precioSugerido × cantidad
gananciaOperativa = ingresosEstimados − costoTotal
resultadoInicial = gananciaOperativa − inversionInicial
```

Calcular con precisión completa. Redondear solo al mostrar a dos decimales. No dividir si `cantidad <= 0`.

## Flujo de pantalla

1. explicación corta y aviso educativo;
2. formulario de entradas;
3. botón `Calcular`;
4. resumen de resultados;
5. interpretación del resultado inicial;
6. acciones `Modificar datos` y `Limpiar`.

`Limpiar` pide confirmación si existe un cálculo guardado y solo borra la clave de la calculadora.

## Interpretación

| Resultado inicial | Título | Explicación |
|---|---|---|
| > 0 | `Ganancia estimada` | Los ingresos cubren los costos y recuperan la inversión inicial, con excedente. |
| = 0 | `Punto de equilibrio` | Se recupera exactamente la inversión inicial, sin ganancia ni pérdida estimada. |
| < 0 | `Inversión todavía no recuperada` | La ganancia operativa aún no recupera completamente la inversión inicial. |

La comparación con cero usa el valor completo, no el texto redondeado.

## Casos de referencia

### Caso A

Entradas: inversión 500; fijos 200; variable 5; cantidad 100; margen 30.

Resultados: variable total 500; total 700; unitario 7; precio 9,10; ingresos 910; ganancia operativa 210; resultado inicial -290.

### Caso B

Entradas: inversión 100; fijos 50; variable 2; cantidad 100; margen 50.

Resultados: variable total 200; total 250; unitario 2,50; precio 3,75; ingresos 375; ganancia operativa 125; resultado inicial 25.

### Caso inválido

Inversión vacía; fijos -50; variable `cinco`; cantidad 0; margen 120. Deben aparecer errores específicos y no debe guardarse ni mostrarse un resultado nuevo.

## Persistencia

- Guardar entradas y resultados solo después de calcular válidamente.
- Al reabrir, mostrar el último cálculo y permitir editarlo.
- Un error de guardado conserva el cálculo en pantalla y ofrece reintentar.
- `Mi Proyecto` consulta el snapshot; no se crea un resumen adicional.

## Criterios de aceptación

- `CAL-01`: todas las entradas aplican tipo, obligatoriedad y rango.
- `CAL-02`: acepta coma o punto decimal válido.
- `CAL-03`: las fórmulas coinciden con los dos casos de referencia.
- `CAL-04`: los resultados se muestran con dos decimales sin redondear cálculos intermedios.
- `CAL-05`: la interpretación coincide con el signo del resultado inicial.
- `CAL-06`: una entrada inválida impide cálculo y persistencia.
- `CAL-07`: el último cálculo persiste y puede limpiarse con confirmación.
- `CAL-08`: el teclado no oculta campo, error ni acción principal.
- `CAL-09`: cálculo/parseo están en funciones puras probables.

