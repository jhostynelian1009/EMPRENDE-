import React, { forwardRef } from 'react';
import { TextInput, type TextInputProps } from 'react-native';

import { TextField } from '@/src/components/ui/TextField';

type CalculatorFieldProps = Omit<TextInputProps, 'style'> & {
  label: string;
  help?: string;
  error?: string;
};

export const CalculatorField = forwardRef<TextInput, CalculatorFieldProps>(
  function CalculatorField({ label, help, error, ...inputProps }, ref) {
    return (
      <TextField
        ref={ref}
        label={label}
        helperText={help}
        errorMessage={error}
        {...inputProps}
      />
    );
  },
);
