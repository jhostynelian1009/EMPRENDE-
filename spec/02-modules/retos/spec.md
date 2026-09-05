# Especificación — Retos de emprendimiento

## Propósito

Convertir lo aprendido y los datos de la idea en tres actividades prácticas: identificar problema/cliente, interpretar números y presentar el proyecto.

## Rutas y archivos

- Lista: `app/(tabs)/retos.tsx`.
- Detalle: `app/retos/[challengeId].tsx`.
- Dominio, contenido, componentes y repositorio: `src/modules/retos/`.
- Clave: `@emprende_plus:retos`.

## Comportamiento general

- Estados: `pending`, `started`, `completed`.
- Reto 1 está disponible; Reto 2 se desbloquea al completar 1; Reto 3 al completar 2.
- Se guarda avance parcial sin marcar completado.
- Al completar, los cuatro campos deben cumplir validaciones.
- Una respuesta completada puede volver a editarse.
- Progreso visible: 0/3, 1/3, 2/3 o 3/3.

## Reto 1 — Descubre el problema y tu cliente

**Propósito:** Convertir una idea general en un problema concreto y un público objetivo reconocible.

**Situación:** Tienes una idea que parece útil, pero aún no sabes exactamente quién la necesita ni qué problema resolverá.

**Problema:** Si el problema y el cliente son demasiado amplios, será difícil diseñar una solución útil.

**Pasos:**

1. Escribe una situación real que hayas observado.
2. Define a quién afecta usando características concretas.
3. Explica por qué vale la pena resolverla.
4. Redacta una propuesta de valor en una sola oración.

| ID / campo | Tipo | Validación |
|---|---|---|
| `problemaObservado` / Problema observado | texto largo | mínimo 20 caracteres |
| `publicoObjetivo` / Público objetivo | texto corto | mínimo 5 caracteres |
| `evidencia` / Evidencia o razón | texto largo | mínimo 15 caracteres |
| `propuestaValor` / Propuesta de valor | texto largo | mínimo 20 caracteres |

**Ejemplo:** Estudiantes del ISTAE pierden tiempo buscando almuerzos económicos. Ofreceremos menús saludables reservados por WhatsApp y entregados cerca del instituto.

**Logro:** El problema, el cliente y la propuesta guardan relación directa y pueden entenderse sin información adicional.

## Reto 2 — Ponle números a tu idea

**Propósito:** Usar la calculadora para comprobar si el precio cubre costos y margen esperado.

**Situación:** Ya tienes una solución, pero todavía no sabes cuánto cuesta ofrecerla ni qué precio sería razonable.

**Problema:** Vender sin calcular costos puede producir pérdidas aunque existan clientes.

**Pasos:**

1. Define una unidad de venta clara.
2. Registra costos fijos, variable por unidad, cantidad y margen.
3. Usa la Calculadora financiera de EMPRENDE+.
4. Interpreta si el resultado inicial es positivo, cero o negativo.

| ID / campo | Tipo | Validación |
|---|---|---|
| `unidadVenta` / Unidad de venta | texto corto | mínimo 3 caracteres |
| `resumenCostos` / Resumen de costos | texto largo | mínimo 15 y debe mencionar `fijo` y `variable` sin distinguir mayúsculas |
| `precioSugerido` / Precio sugerido | decimal | mayor que 0 |
| `interpretacion` / Interpretación | texto largo | mínimo 20 caracteres |

**Integración:** ofrecer `Abrir calculadora`. Si existe snapshot válido, permitir copiar el precio sugerido con confirmación; no copiar automáticamente ni modificar la calculadora.

**Ejemplo:** Para 100 almuerzos: costo total de 250 dólares, costo unitario de 2,50 y precio sugerido de 3,75 con margen del 50 %. El resultado inicial es positivo si se recupera la inversión.

**Logro:** La interpretación coincide con el resultado de la calculadora y explica si se recupera la inversión inicial. La app valida longitud y presencia de datos; la coherencia pedagógica se revisa en demostración, no mediante IA.

## Reto 3 — Presenta tu proyecto en un minuto

**Propósito:** Construir un mensaje breve que conecte problema, solución, cliente y viabilidad.

**Situación:** Debes explicar tu idea a una persona que no conoce el proyecto y solo tienes un minuto.

**Problema:** Una explicación extensa o desordenada puede ocultar el valor de una buena idea.

**Pasos:**

1. Menciona nombre del proyecto y problema.
2. Explica solución y quién la necesita.
3. Incluye un dato financiero o beneficio concreto.
4. Cierra con una acción: probar, comprar, apoyar o dar retroalimentación.

| ID / campo | Tipo | Validación |
|---|---|---|
| `nombreProblema` / Nombre y problema | texto largo | mínimo 20 caracteres |
| `solucionPublico` / Solución y público | texto largo | mínimo 25 caracteres |
| `datoBeneficio` / Dato o beneficio | texto largo | mínimo 15 caracteres |
| `llamadoAccion` / Llamado a la acción | texto corto | mínimo 5 caracteres |

**Ejemplo:** Sabores San Lorenzo ofrece almuerzos saludables y económicos para estudiantes con poco tiempo. Los pedidos se reservan por WhatsApp y el precio se calcula para cubrir costos. Buscamos cinco estudiantes que prueben el primer menú.

**Logro:** El mensaje contiene problema, solución, público, beneficio y acción. Mostrar contador orientativo de palabras; no bloquear por tiempo ni grabar audio.

## Estados y errores

- Bloqueado: `Completa el reto anterior para desbloquearlo.`
- Parcial: `Tu avance se guardó. Puedes continuar después.`
- Completado: `¡Reto completado! Puedes revisarlo o continuar.`
- Error: `No pudimos guardar tu avance. Reintenta sin cerrar esta pantalla.`
- ID inválido: `Reto no encontrado.` con regreso a la lista.

## Criterios de aceptación

- `RET-01`: existen exactamente tres retos y se desbloquean en orden.
- `RET-02`: cada reto contiene propósito, situación, problema, pasos, campos, ejemplo y logro.
- `RET-03`: guardar parcial cambia a `started` y conserva respuestas.
- `RET-04`: completar exige cuatro campos válidos.
- `RET-05`: progreso refleja cantidad completada sin duplicados.
- `RET-06`: un reto completado se puede editar y sigue completado solo si continúa válido.
- `RET-07`: Reto 2 integra la calculadora sin modificar su clave.
- `RET-08`: respuestas persisten tras reiniciar la APK.
- `RET-09`: IDs inválidos y fallos son recuperables.

