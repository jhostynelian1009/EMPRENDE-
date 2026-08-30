import { useEffect, useRef } from 'react';
import { TextInput, View } from 'react-native';

import {
  CALCULATOR_FIELDS,
  FIELD_LABELS,
  type CalculatorField,
  type CalculatorFormValues,
  type FieldErrors,
} from '../domain';
import { CalculatorField as CalculatorTextField } from './CalculatorField';

const FIELD_HELP: Partial<Record<CalculatorField, string>> = {
  margenPorcentaje: 'Porcentaje entre 0 y 100. Acepta coma o punto.',
  cantidad: 'Número entero mayor que cero.',
};

const KEYBOARD: Record<CalculatorField, 'decimal-pad' | 'number-pad'> = {
  inversionInicial: 'decimal-pad',
  costosFijos: 'decimal-pad',
  costoVariableUnitario: 'decimal-pad',
  cantidad: 'number-pad',
  margenPorcentaje: 'decimal-pad',
};

type CalculatorFormProps = {
  values: CalculatorFormValues;
  errors: FieldErrors;
  firstErrorField: CalculatorField | null;
  onChange: (field: CalculatorField, value: string) => void;
  onFirstErrorFocused: () => void;
};

export function CalculatorForm({
  values,
  errors,
  firstErrorField,
  onChange,
  onFirstErrorFocused,
}: CalculatorFormProps) {
  const refs = useRef<Partial<Record<CalculatorField, TextInput | null>>>({});

  useEffect(() => {
    if (!firstErrorField) {
      return;
    }

    refs.current[firstErrorField]?.focus();
    onFirstErrorFocused();
  }, [firstErrorField, onFirstErrorFocused]);

  return (
    <View>
      {CALCULATOR_FIELDS.map((field) => (
        <CalculatorTextField
          key={field}
          ref={(node: TextInput | null) => {
            refs.current[field] = node;
          }}
          label={FIELD_LABELS[field]}
          help={FIELD_HELP[field]}
          error={errors[field]}
          value={values[field]}
          onChangeText={(value) => onChange(field, value)}
          keyboardType={KEYBOARD[field]}
          inputMode={field === 'cantidad' ? 'numeric' : 'decimal'}
          returnKeyType={field === 'margenPorcentaje' ? 'done' : 'next'}
          onSubmitEditing={() => {
            const currentIndex = CALCULATOR_FIELDS.indexOf(field);
            const nextField = CALCULATOR_FIELDS[currentIndex + 1];
            if (nextField) {
              refs.current[nextField]?.focus();
            }
          }}
        />
      ))}
    </View>
  );
}
