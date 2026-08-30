# Navegación e Inicio

## Objetivo

Inicio orienta al estudiante: muestra su avance, permite entrar a cualquier módulo y recomienda una sola acción siguiente. Adapta la estructura visual de la imagen proporcionada al alcance offline de EMPRENDE+.

## Barra inferior

| Orden | Etiqueta | Ruta | Icono conceptual |
|---:|---|---|---|
| 1 | Inicio | `/(tabs)` | casa |
| 2 | Aprende | `/(tabs)/aprende` | libro |
| 3 | Mi Idea | `/(tabs)/mi-idea` | bombilla |
| 4 | Retos | `/(tabs)/retos` | bandera/meta |
| 5 | Proyecto | `/(tabs)/proyecto` | carpeta |

Etiqueta siempre visible. Activo en `primaryDark`; inactivo en `textMuted`. La barra respeta Safe Area y no tapa contenido.

Calculadora y Quiz no ocupan pestaña: se abren desde las tarjetas de Inicio y desde Mi Proyecto.

## Orden de Inicio

1. **Bienvenida:** `Hola, emprendedor` y `Convierte tu idea en proyecto`.
2. **Tu recorrido:** carrusel horizontal de tarjetas de módulo.
3. **Continúa aprendiendo:** tarjeta de la última lección o primera pendiente.
4. **Siguiente paso:** una recomendación derivada del progreso.
5. Espacio inferior suficiente para la barra.

No usar nombre de persona, avatar, campana, ajustes, comunidad, mentores, calificaciones públicas ni duración ficticia de cursos.

## Tarjetas del recorrido

| Orden | Módulo | Resumen | Acción |
|---:|---|---|---|
| 1 | Aprende | `x de 7 lecciones` | Ver/Continuar |
| 2 | Mi Idea | Sin iniciar o Guardada | Crear/Editar |
| 3 | Calculadora | Pendiente o Calculada | Calcular/Revisar |
| 4 | Quiz | Pendiente, `x/10` | Realizar/Repetir |
| 5 | Retos | `x de 3 retos` | Comenzar/Continuar |
| 6 | Mi Proyecto | `x % completado` | Ver proyecto |

Cada tarjeta incluye icono, título, estado textual y control accesible. El carrusel deja ver una fracción de la tarjeta siguiente para indicar desplazamiento.

## Algoritmo de siguiente paso

Se devuelve la primera condición verdadera:

1. Ninguna lección completada → `Comienza con la lección Emprendimiento`.
2. Idea no válida/ausente → `Describe tu idea de negocio`.
3. Cálculo ausente → `Ponle números a tu idea`.
4. Quiz no completado → `Comprueba lo aprendido`.
5. Existen retos pendientes → `Continúa tus retos`.
6. Todo completo → `Revisa tu proyecto antes de presentarlo`.

## Estados

- **Carga:** esqueletos simples o indicador con texto `Cargando tu avance…`.
- **Sin progreso:** todas las tarjetas parten en pendiente y se recomienda Aprende.
- **Parcial:** se muestran valores reales de cada contrato.
- **Completo:** mensaje de logro y acción `Revisar mi proyecto`.
- **Lectura parcial fallida:** mostrar los demás estados; la tarjeta afectada indica `No disponible` y ofrece reintentar.

## Responsabilidad de la rama visual

`feature/identidad-visual` crea Inicio, navegación y componentes/tokens compartidos. No implementa fórmulas, preguntas, validaciones ni repositorios funcionales de los otros módulos. Puede usar adaptadores de progreso definidos por integración o datos temporales claramente marcados, pero los elimina antes de cerrar el PR.

## Criterios de aceptación

- `NAV-01`: las cinco pestañas son visibles y abren la ruta correcta.
- `NAV-02`: Calculadora y Quiz se alcanzan desde Inicio.
- `NAV-03`: Inicio no presenta funciones fuera del alcance.
- `NAV-04`: las tarjetas reflejan estados locales cuando estén disponibles.
- `NAV-05`: la recomendación sigue el algoritmo documentado.
- `NAV-06`: ninguna barra tapa contenido o controles.
- `NAV-07`: navegación y botones tienen etiqueta accesible.
- `NAV-08`: la composición coincide con el sistema visual naranja aprobado.

