# Especificación — Quiz

## Propósito

Comprobar conceptos básicos mediante diez preguntas de opción múltiple, puntaje automático, aprobación desde 7/10 y retroalimentación final.

## Rutas y archivos

- Quiz: `app/quiz/index.tsx`.
- Resultado: `app/quiz/resultado.tsx`.
- Banco obligatorio: `question-bank.md`.
- Dominio, componentes, estado y repositorio: `src/modules/quiz/`.
- Clave: `@emprende_plus:quiz`.

## Modelo lógico

Cada pregunta tiene ID, enunciado, cuatro opciones con ID/texto, `correctOptionId` y retroalimentación. La calificación compara IDs; nunca letras o posición en pantalla.

## Flujo

1. Introducción: diez preguntas, un punto cada una, aprobación 7/10.
2. Cuestionario con indicador `Pregunta x de 10` y progreso.
3. Selección única por pregunta; se puede volver y cambiar antes de finalizar.
4. Borrador guardado después de cada selección válida.
5. `Finalizar quiz` solo se habilita con diez respuestas.
6. Confirmación antes de calificar.
7. Resultado con puntaje, aprobado/no aprobado y revisión de las diez preguntas.
8. `Repetir quiz` inicia intento nuevo tras confirmación y no mezcla respuestas previas.

## Orden de opciones

En el contenido original todas las respuestas correctas ocupan la primera posición. Para evitar una pista predecible:

- barajar las cuatro opciones al comenzar cada intento;
- mantener el orden estable durante ese intento;
- calificar por `optionId`;
- no cambiar el orden al volver a una pregunta;
- admitir pruebas inyectando un orden conocido.

El orden de las preguntas se mantiene del 1 al 10 para coincidir con el contenido educativo.

## Resultado y mensajes

```text
score = cantidad de respuestas cuyo optionId coincide con correctOptionId
approved = score >= 7
```

- Aprobado: `¡Aprobaste! Obtuviste x/10.`
- No aprobado: `Obtuviste x/10. Revisa la retroalimentación y vuelve a intentarlo.`
- Incompleto: `Responde las 10 preguntas antes de finalizar.`
- Error de guardado: `No pudimos guardar tu avance. Puedes continuar y reintentar.`

La revisión muestra: enunciado, respuesta elegida, respuesta correcta, icono/estado y retroalimentación. No depender solo de rojo/verde.

## Persistencia

- `status: inProgress` con `score/approved/completedAt` nulos durante el intento.
- Al finalizar, guardar `completed`, puntaje, aprobado y fecha.
- Si existe intento incompleto, ofrecer `Continuar intento` o `Empezar de nuevo`.
- `Mi Proyecto` solo utiliza estado, puntaje, aprobación y fecha.

## Criterios de aceptación

- `QUIZ-01`: carga exactamente diez preguntas y cuatro opciones cada una.
- `QUIZ-02`: una sola respuesta queda seleccionada por pregunta.
- `QUIZ-03`: no finaliza con respuestas pendientes.
- `QUIZ-04`: calcula puntaje 0–10 y aprueba desde 7.
- `QUIZ-05`: opciones se barajan sin perder la respuesta correcta.
- `QUIZ-06`: revisión muestra elección, correcta y retroalimentación.
- `QUIZ-07`: intento incompleto y resultado sobreviven al reinicio.
- `QUIZ-08`: repetir limpia el intento anterior después de confirmar.
- `QUIZ-09`: lector de pantalla anuncia selección y estado correcto/incorrecto.

## Casos de prueba

1. Diez correctas → 10/10 aprobado.
2. Exactamente siete → 7/10 aprobado.
3. Seis → 6/10 no aprobado.
4. Cero → 0/10 no aprobado.
5. Nueve respondidas → finalizar bloqueado y mensaje.
6. Cambiar una respuesta antes de finalizar → solo se califica la última.
7. Reiniciar en pregunta 5 → continuar con respuestas y orden visual intactos.
8. Repetir → nuevo orden posible, respuestas vacías, resultado anterior reemplazado solo al completar.

