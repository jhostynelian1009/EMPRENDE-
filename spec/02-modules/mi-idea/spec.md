# Especificación — Mi Idea

## Propósito

Permitir que el estudiante describa, guarde y edite su idea de negocio mediante cinco campos. Funciona sin internet y conserva una sola versión vigente.

## Ruta y archivos

- Ruta: `app/(tabs)/mi-idea.tsx`.
- Dominio, formulario, hook y repositorio: `src/modules/miIdea/`.
- Clave: `@emprende_plus:idea`.

## Campos

| Campo / propiedad | Control | Validación tras `trim()` | Ayuda |
|---|---|---|---|
| Nombre del negocio / `nombreNegocio` | texto corto | requerido, 3–50 caracteres | `Escribe un nombre para identificar tu idea.` |
| Problema / `problema` | texto multilínea | requerido, mínimo 10 | `Describe la necesidad que deseas resolver.` |
| Solución / `solucion` | texto multilínea | requerido, mínimo 10 | `Explica cómo tu propuesta resolverá el problema.` |
| Público objetivo / `publicoObjetivo` | texto corto | requerido, mínimo 3 | `Indica quiénes necesitan o comprarían la solución.` |
| Recursos necesarios / `recursosNecesarios` | texto multilínea | requerido, mínimo 5 | `Incluye recursos materiales, económicos o humanos.` |

No imponer máximos no aprobados en campos largos. El nombre muestra contador 0/50.

## Mensajes de validación

- Nombre: `El nombre debe tener entre 3 y 50 caracteres.`
- Problema: `Describe el problema con al menos 10 caracteres.`
- Solución: `Describe la solución con al menos 10 caracteres.`
- Público: `Indica un público objetivo de al menos 3 caracteres.`
- Recursos: `Describe los recursos con al menos 5 caracteres.`

Los errores aparecen debajo del campo y el foco va al primero inválido. No mostrar éxito antes de completar la escritura local.

## Flujo y estados

- Primera apertura: formulario vacío y texto `Completa los datos principales de tu idea de negocio.`
- Con datos: precargar todos los campos y texto `Actualiza tu idea y guarda los cambios cuando termines.`
- Guardado: `Tu idea se guardó correctamente.` y fecha legible.
- Error de lectura: `No pudimos cargar tu idea. Intenta de nuevo.` con `Reintentar`.
- Error de guardado: `No pudimos guardar los cambios. Reintenta sin cerrar la pantalla.`
- Si hay cambios sin guardar y se intenta salir, solicitar confirmación para descartarlos.

## Ejemplo de prueba

| Campo | Valor |
|---|---|
| Nombre | Sabores San Lorenzo |
| Problema | En la comunidad no hay opciones rápidas de comida saludable a precio accesible para estudiantes. |
| Solución | Un puesto móvil de comida saludable con menús económicos e ingredientes locales. |
| Público | Estudiantes del ISTAE y jóvenes de San Lorenzo entre 16 y 25 años. |
| Recursos | Carrito móvil, insumos de cocina, ingredientes frescos, capital inicial y permiso municipal. |

## Integración

`Mi Proyecto` lee los cinco campos y `updatedAt`. Mi Idea no conoce ni modifica Mi Proyecto. Inicio considera la idea lista cuando el snapshot existe y vuelve a cumplir todas las validaciones.

## Criterios de aceptación

- `IDEA-01`: aparecen exactamente los cinco campos y ayudas definidos.
- `IDEA-02`: no se guarda un campo vacío o fuera de longitud.
- `IDEA-03`: el foco llega al primer error y cada error está asociado a su campo.
- `IDEA-04`: guardado y edición persisten tras reiniciar la APK.
- `IDEA-05`: `updatedAt` cambia solo tras un guardado válido.
- `IDEA-06`: un fallo de guardado no borra lo escrito.
- `IDEA-07`: salir con cambios ofrece conservarlos o descartarlos.
- `IDEA-08`: Mi Proyecto puede leer el contrato sin transformación ambigua.

## Pruebas mínimas

1. Enviar vacío y revisar cinco mensajes.
2. Probar exactamente límites 3/50, 10, 10, 3 y 5.
3. Probar espacios exteriores y un nombre de 51 caracteres.
4. Guardar el ejemplo, cerrar, abrir, editar problema y volver a guardar.
5. Simular fallo de lectura/escritura y confirmar recuperación.

