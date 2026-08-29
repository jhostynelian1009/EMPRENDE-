# Visión y alcance

## Producto

EMPRENDE+ es una aplicación móvil educativa que enseña conceptos básicos de negocio y guía a estudiantes para convertir una idea en un proyecto inicial. El entregable es un prototipo funcional instalable como APK para Android, acompañado por informe y manual de usuario.

## Usuario objetivo

Estudiante que está conociendo el emprendimiento y necesita explicaciones breves, ejemplos, ejercicios guiados y una forma de conservar su avance sin crear una cuenta.

## Objetivos verificables

- Consultar siete lecciones básicas de emprendimiento.
- Describir y guardar una idea de negocio.
- calcular costos, precio sugerido e indicadores simples.
- resolver un quiz de diez preguntas con retroalimentación.
- completar tres retos prácticos.
- consultar el resumen integrado del proyecto y continuar lo pendiente.
- conservar el avance localmente después de cerrar la app.

## Alcance de la versión 1

| Incluido | Excluido |
|---|---|
| APK Android | iOS como entregable |
| Uso sin conexión | Backend o base de datos remota |
| Persistencia con AsyncStorage | Registro, inicio de sesión o perfiles reales |
| Contenido educativo incorporado | Contenido descargable o administrable en línea |
| Progreso local | Sincronización entre dispositivos |
| Módulos Aprende, Mi Idea, Calculadora, Quiz, Retos y Mi Proyecto | Comunidad, chat, mentores, pagos, notificaciones remotas |
| Pantalla Inicio y navegación | Panel administrativo |

## Restricciones

- Tecnología aprobada: React Native con Expo SDK 54 y TypeScript.
- Navegación: Expo Router.
- Datos: AsyncStorage en el dispositivo.
- El prototipo debe funcionar sin credenciales ni internet después de instalarse.
- Lenguaje visible: español claro para estudiantes.
- La referencia visual orienta la composición; no incorpora las funciones en línea que aparecen en la imagen.

## Supuestos cerrados

- Existe una sola persona usuaria local por instalación.
- No se manejan monedas múltiples: se muestra `$` y dos decimales.
- No se exportan ni comparten datos en esta versión.
- El logo definitivo puede añadirse como activo sin cambiar la arquitectura; la interfaz debe poder funcionar con el nombre tipográfico `EMPRENDE+` mientras tanto.

## Indicadores de éxito de la demostración

1. La APK abre sin errores en Android.
2. Todos los módulos se alcanzan desde Inicio o la navegación principal.
3. Idea, cálculo, quiz y retos sobreviven al cierre y reapertura.
4. Mi Proyecto refleja los datos guardados sin duplicarlos.
5. La interfaz mantiene paleta, jerarquía y componentes coherentes.

