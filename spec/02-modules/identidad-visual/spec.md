# Especificación — Identidad visual, Inicio y navegación

## Propósito

Traducir el sistema visual naranja aprobado a tokens, componentes compartidos, navegación inferior e Inicio, sin implementar la lógica interna de otros módulos.

## Fuentes obligatorias

- `spec/01-design/01-design-system.md`
- `spec/01-design/02-navigation-home.md`
- `assets/dashboard-reference.jpg`

## Entregables

- Tokens tipados en `src/theme/`.
- Componentes compartidos definidos por el sistema visual.
- layouts de Expo Router y barra inferior.
- pantalla Inicio con datos reales integrables y estados recuperables.
- nombre/identidad tipográfica temporal `EMPRENDE+` hasta recibir logo.
- documentación breve de uso de componentes en el código, sin crear otro sistema paralelo.

## Responsabilidad de archivos

Permitidos principalmente:

```text
app/_layout.tsx
app/(tabs)/_layout.tsx
app/(tabs)/index.tsx
src/theme/**
src/components/ui/**
assets/**
```

No modificar rutas, contenido, fórmulas, validadores o almacenamiento propios de Aprende, Calculadora, Mi Idea, Quiz, Retos o Mi Proyecto.

## Tokens mínimos

Exportar objetos `colors`, `spacing`, `radii`, `typography` y `shadows` con los valores exactos del sistema visual. No escribir hexadecimales repetidos dentro de pantallas, excepto transparencias justificadas.

## Inicio

Implementar la estructura, tarjetas, estados y algoritmo definidos en navegación. La capa visual puede recibir un modelo de vista:

```ts
type HomeProgress = {
  lessonsCompleted: number;
  ideaReady: boolean;
  calculatorReady: boolean;
  quizScore: number | null;
  challengesCompleted: number;
  projectPercent: number;
};
```

Este tipo no crea una nueva clave de almacenamiento. Los datos se derivan de contratos existentes.

## Logo y activos

- Usar texto de marca temporal mientras no exista un archivo aprobado.
- No convertir la foto de referencia en parte de la interfaz.
- No generar un logo automáticamente ni usar propuestas descartadas.
- Al recibir el logo, guardar un original y versiones necesarias sin alterar proporción.

## Criterios de aceptación

- `IDV-01`: tokens coinciden con los valores aprobados y son la única fuente visual.
- `IDV-02`: botones y texto cumplen las reglas de contraste, especialmente el naranja.
- `IDV-03`: Inicio refleja la composición de referencia sin funciones fuera del alcance.
- `IDV-04`: navegación inferior contiene exactamente cinco pestañas.
- `IDV-05`: componentes soportan estados normal, presionado, deshabilitado y error cuando aplica.
- `IDV-06`: pantallas respetan Safe Area, scroll, teclado y fuente aumentada.
- `IDV-07`: no existen textos de ejemplo en inglés ni nombre/avatar ficticio.
- `IDV-08`: los módulos pueden consumir los componentes sin importar lógica de Inicio.

## Pruebas mínimas

1. Comparar todos los tokens con el documento visual.
2. Revisar botón primario, secundario, campos, tarjetas, progreso y estados.
3. Probar Inicio sin datos, parcial, completo y lectura fallida.
4. Navegar por las cinco pestañas y abrir Calculadora/Quiz desde tarjetas.
5. Revisar un Android estrecho, uno alto y texto aumentado.

