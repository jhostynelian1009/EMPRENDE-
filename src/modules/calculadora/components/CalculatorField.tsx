import { forwardRef } from 'react';
import {
  StyleSheet,
  Text,
  TextInput,
  type TextInputProps,
  View,
} from 'react-native';

import { calculatorTheme as theme } from '../theme';

type CalculatorFieldProps = TextInputProps & {
  label: string;
  help?: string;
  error?: string;
};

export const CalculatorField = forwardRef<TextInput, CalculatorFieldProps>(
  function CalculatorField({ label, help, error, ...inputProps }, ref) {
    return (
      <View style={styles.wrapper}>
        <Text style={styles.label}>{label}</Text>
        {help ? <Text style={styles.help}>{help}</Text> : null}
        <TextInput
          ref={ref}
          style={[styles.input, error ? styles.inputError : null]}
          placeholderTextColor={theme.color.textMuted}
          accessibilityLabel={label}
          {...inputProps}
        />
        {error ? (
          <Text style={styles.error} accessibilityLiveRegion="polite">
            {error}
          </Text>
        ) : null}
      </View>
    );
  },
);

const styles = StyleSheet.create({
  wrapper: {
    marginBottom: theme.space.lg,
  },
  label: {
    color: theme.color.text,
    fontSize: 14,
    lineHeight: 18,
    fontWeight: '600',
    marginBottom: theme.space.xs,
  },
  help: {
    color: theme.color.textMuted,
    fontSize: 12,
    lineHeight: 16,
    marginBottom: theme.space.sm,
  },
  input: {
    minHeight: 48,
    borderWidth: 1,
    borderColor: theme.color.border,
    borderRadius: theme.radius.field,
    backgroundColor: theme.color.surface,
    color: theme.color.text,
    fontSize: 16,
    lineHeight: 24,
    paddingHorizontal: theme.space.lg,
    paddingVertical: theme.space.md,
  },
  inputError: {
    borderColor: theme.color.error,
  },
  error: {
    color: theme.color.error,
    fontSize: 14,
    lineHeight: 20,
    marginTop: theme.space.sm,
  },
});
