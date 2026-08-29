# Reglas de trabajo de EMPRENDE+

Estas reglas aplican a personas y agentes que trabajen en este repositorio.

## Fuente de verdad

1. Leer `spec/README.md`, los documentos compartidos y la especificación del módulo antes de modificar código.
2. Usar la skill de `.agents/skills/` que corresponde a la rama activa.
3. Si el código, una conversación o una suposición contradicen `spec/`, detenerse y solicitar una decisión del líder. No inventar requisitos.

## Flujo Git obligatorio

- `main`: versión estable y protegida.
- `develop`: integración y pruebas del equipo.
- `feature/*`: trabajo de un módulo.
- Todo cambio modular entra por Pull Request hacia `develop`; `develop` llega a `main` por otro Pull Request.
- No hacer push directo a `main` o `develop`, no usar `--force` y no eliminar ramas protegidas.
- Verificar la rama con `git branch --show-current` antes de editar.
- Los commits deben describir el aporte real. La autoría se demuestra con el historial Git; no atribuir trabajo a quien no lo realizó.

## Límites técnicos

- Base aprobada: Expo SDK 54, React Native, TypeScript, Expo Router y AsyncStorage.
- El prototipo es offline, sin backend, registro, autenticación, perfiles, comunidad, mentores, notificaciones remotas ni pagos.
- No cambiar de framework, actualizar Expo, instalar dependencias o ejecutar `npm audit fix --force` sin aprobación del líder.
- No duplicar contratos de datos. Usar las claves y estructuras de `spec/00-project/03-data-contracts.md`.
- No modificar archivos de otro módulo salvo que el líder apruebe el cambio compartido.
- `Mi Proyecto` solo consulta y resume; no guarda copias de los datos de otros módulos.

## Calidad mínima

Antes de solicitar revisión:

```bash
npx tsc --noEmit
npm run lint
```

Además, ejecutar los casos manuales de la especificación del módulo en Android. En una integración final, ejecutar también `npx expo-doctor@latest`.

El reporte del cambio debe indicar: rama, archivos modificados, requisitos cubiertos, comprobaciones ejecutadas y asuntos pendientes.

