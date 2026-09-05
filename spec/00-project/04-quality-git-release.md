# Calidad, Git y entrega APK

## Estrategia de ramas

| Rama | Uso | Destino de PR |
|---|---|---|
| `main` | versión estable de entrega | ninguno |
| `develop` | integración validada | `main` |
| `feature/aprende` | contenido y progreso educativo | `develop` |
| `feature/identidad-visual` | sistema visual, Inicio y navegación | `develop` |
| `feature/calculadora` | calculadora financiera | `develop` |
| `feature/mi-idea` | formulario de idea | `develop` |
| `feature/quiz` | cuestionario y resultados | `develop` |
| `feature/retos` | retos prácticos | `develop` |
| `feature/mi-proyecto` | resumen integrado | `develop` |

`main` y `develop` deben exigir Pull Request, bloquear force-push y eliminación. En `main`, exigir al menos una aprobación del líder y conversación resuelta.

## Comprobaciones automáticas

```bash
npx tsc --noEmit
npm run lint
npx expo-doctor@latest
```

Los dos primeros se ejecutan en cada módulo. `expo-doctor` se ejecuta en integración y antes de generar el APK.

## Matriz mínima en Android

- Inicio en pantalla compacta y pantalla alta.
- Navegación hacia todos los módulos y regreso.
- Cierre y reapertura con datos guardados.
- Formularios con teclado visible.
- Entradas válidas, límites e inválidas.
- Estado sin datos, parcial, completo y error recuperable.
- Texto aumentado sin controles inaccesibles.

## Criterio de Pull Request

El PR incluye:

- requisito(s) cubierto(s);
- capturas o grabación del flujo;
- comandos ejecutados y resultado;
- casos manuales ejecutados;
- archivos compartidos modificados, si los hay;
- limitaciones pendientes.

No integrar un PR con errores de TypeScript, lint o navegación.

## Construcción del APK

La configuración final debe usar EAS Build y un perfil Android que genere APK instalable, no AAB. Antes de construir:

1. Integrar todos los módulos aprobados en `develop`.
2. Ejecutar la matriz de regresión.
3. Crear PR `develop` → `main` y aprobarlo.
4. Comprobar `app.json`/`app.config.*`: nombre `EMPRENDE+`, slug válido, icono, splash, orientación y `android.package` único.
5. Construir desde `main` y conservar el enlace/archivo como evidencia.

Ejemplo conceptual de perfil:

```json
{
  "build": {
    "preview": {
      "android": { "buildType": "apk" }
    }
  }
}
```

La persona líder ejecuta la construcción final; los módulos no modifican por separado la configuración de release.

## Prohibición de arreglos destructivos

No ejecutar `npm audit fix --force`: el reporte actual propone actualizar Expo con cambios incompatibles. Las dependencias se mantienen compatibles con SDK 54 mientras `expo-doctor` y las comprobaciones del proyecto pasen.

