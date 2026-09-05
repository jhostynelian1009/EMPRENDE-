# Arquitectura técnica

## Base aprobada

- Expo SDK 54.
- React Native y TypeScript en modo estricto según el proyecto generado.
- Expo Router para navegación basada en archivos.
- `@react-native-async-storage/async-storage` para persistencia local.
- Componentes funcionales y hooks de React.
- Sin nuevas dependencias hasta demostrar una necesidad que la base no pueda cubrir.

## Capas

| Capa | Responsabilidad | Regla |
|---|---|---|
| `app/` | Rutas y composición de pantallas | Debe ser delgada; no contiene fórmulas ni acceso directo repetido a AsyncStorage. |
| `src/components/ui/` | Componentes visuales reutilizables | No conoce reglas particulares de los módulos. |
| `src/theme/` | Colores, tipografía, espacios, radios y sombras | Única fuente de tokens visuales. |
| `src/modules/<modulo>/` | UI específica, dominio, hooks, repositorio y datos del módulo | Cada rama modifica solamente su módulo y sus rutas propias. |
| `src/storage/` | Adaptadores JSON y claves compartidas | Centraliza lectura, escritura, parseo y manejo de errores. |

## Rutas previstas

```text
app/
  _layout.tsx
  (tabs)/
    _layout.tsx
    index.tsx
    aprende.tsx
    mi-idea.tsx
    retos.tsx
    proyecto.tsx
  aprende/[lessonId].tsx
  calculadora.tsx
  quiz/index.tsx
  quiz/resultado.tsx
  retos/[challengeId].tsx
src/
  components/ui/
  modules/
    aprende/
    calculadora/
    miIdea/
    quiz/
    retos/
    miProyecto/
  storage/
  theme/
```

La pestaña `Inicio` presenta accesos a los seis módulos. Las cinco pestañas inferiores son Inicio, Aprende, Mi Idea, Retos y Proyecto. Calculadora y Quiz se abren desde Inicio y desde acciones contextuales para no saturar la barra.

## Patrón interno de módulo

```text
src/modules/<modulo>/
  components/     componentes propios
  data/           contenido estático, si aplica
  domain/         tipos, validaciones y funciones puras
  hooks/          coordinación de estado de pantalla
  storage/        repositorio local del módulo
```

No es obligatorio crear una carpeta vacía. Solo se agrega cuando tiene un archivo útil.

## Flujo de datos

1. La pantalla solicita datos mediante el hook del módulo.
2. El hook llama al repositorio local.
3. El repositorio lee o escribe JSON por medio del adaptador compartido.
4. El dominio valida y calcula con funciones puras.
5. La UI representa `loading`, `ready`, `empty` o `error` sin cerrarse inesperadamente.

## Manejo de errores

- Toda lectura JSON debe validar forma y `schemaVersion`.
- Un valor ausente produce estado vacío, no error fatal.
- Un JSON ilegible se ignora para esa sección, se reporta en desarrollo y muestra un mensaje recuperable.
- Una escritura fallida conserva los valores del formulario en memoria y permite reintentar.
- Nunca borrar automáticamente datos por un fallo de lectura.

## Rendimiento y accesibilidad técnica

- Usar `ScrollView` o listas cuando el contenido supere la altura disponible.
- Evitar renders costosos; los cálculos financieros son funciones puras simples.
- Definir `accessibilityLabel` cuando el texto visible no explique el control.
- No comunicar estado únicamente por color.
- Probar con tamaño de fuente aumentado y teclado visible.

