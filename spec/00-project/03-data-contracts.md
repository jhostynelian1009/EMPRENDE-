# Contratos de datos locales

## Convenciones obligatorias

- Todas las claves comienzan con `@emprende_plus:`.
- Todo objeto raíz incluye `schemaVersion: 1`.
- Las fechas se guardan como texto ISO 8601 o `null`.
- Los textos se guardan recortados con `trim()`.
- Los números se guardan como `number`, nunca como texto formateado.
- El formateo a dos decimales se realiza al mostrar, no al calcular.
- Cada módulo es dueño de su clave. `Mi Proyecto` no guarda copias.

## Aprende

Clave: `@emprende_plus:aprende`

```ts
type AprendeProgress = {
  schemaVersion: 1;
  completedLessonIds: string[];
  lastLessonId: string | null;
  updatedAt: string | null;
};
```

`completedLessonIds` no contiene duplicados y solo acepta los siete IDs definidos en el contenido.

## Mi Idea

Clave: `@emprende_plus:idea`

```ts
type BusinessIdea = {
  schemaVersion: 1;
  nombreNegocio: string;
  problema: string;
  solucion: string;
  publicoObjetivo: string;
  recursosNecesarios: string;
  updatedAt: string;
};
```

## Calculadora

Clave: `@emprende_plus:calculadora`

```ts
type CalculatorSnapshot = {
  schemaVersion: 1;
  inputs: {
    inversionInicial: number;
    costosFijos: number;
    costoVariableUnitario: number;
    cantidad: number;
    margenPorcentaje: number;
  };
  results: {
    costoVariableTotal: number;
    costoTotal: number;
    costoUnitario: number;
    precioSugerido: number;
    ingresosEstimados: number;
    gananciaOperativa: number;
    resultadoInicial: number;
  };
  updatedAt: string;
};
```

Solo se persiste después de un cálculo completamente válido.

## Quiz

Clave: `@emprende_plus:quiz`

```ts
type QuizSnapshot = {
  schemaVersion: 1;
  status: 'inProgress' | 'completed';
  answers: Record<string, string>;
  score: number | null;
  approved: boolean | null;
  completedAt: string | null;
  updatedAt: string;
};
```

Las claves de `answers` son IDs de pregunta y los valores son IDs estables de opción; nunca índices visuales.

## Retos

Clave: `@emprende_plus:retos`

```ts
type ChallengeStatus = 'pending' | 'started' | 'completed';

type ChallengesSnapshot = {
  schemaVersion: 1;
  challenges: Record<string, {
    status: ChallengeStatus;
    answers: Record<string, string | number>;
    updatedAt: string | null;
  }>;
  updatedAt: string | null;
};
```

Solo existen `reto-1`, `reto-2` y `reto-3`. Un reto bloqueado mantiene `pending` y respuestas vacías.

## Progreso de Mi Proyecto

No tiene clave propia. Se deriva al abrir o enfocar la pantalla:

```text
25 × ideaCompleta
+ 25 × calculoCompleto
+ 25 × quizCompleto
+ 25 × (retosCompletados / 3)
```

Los tres indicadores de módulo valen 0 o 1. El resultado se limita a 0–100 y se redondea para mostrarlo. De este modo cada reto aporta aproximadamente 8,33 puntos sin duplicar datos.

## Compatibilidad

Una versión desconocida no debe interpretarse como válida. La app muestra la sección como no disponible y conserva el valor original. Cualquier migración futura debe ser explícita y probada.

