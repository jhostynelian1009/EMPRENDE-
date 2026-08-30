import React, { forwardRef } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  TextInputProps,
  ViewStyle,
  TextStyle,
  StyleProp,
} from 'react-native';
import { colors, radii, spacing, typography } from '@/src/theme';

export interface TextFieldProps extends Omit<TextInputProps, 'style'> {
  label: string;
  helperText?: string;
  errorMessage?: string;
  maxLength?: number;
  showCounter?: boolean;
  containerStyle?: StyleProp<ViewStyle>;
  inputStyle?: StyleProp<TextStyle>;
}

export const TextField = forwardRef<TextInput, TextFieldProps>(
  (
    {
      label,
      helperText,
      errorMessage,
      maxLength,
      showCounter = false,
      containerStyle,
      inputStyle,
      value = '',
      onChangeText,
      multiline,
      placeholder,
      ...rest
    },
    ref
  ) => {
    const hasError = !!errorMessage;
    const currentLength = value ? value.length : 0;

    return (
      <View style={[styles.container, containerStyle]}>
        <View style={styles.labelRow}>
          <Text style={styles.label}>{label}</Text>
          {showCounter && maxLength ? (
            <Text style={styles.counter}>
              {currentLength}/{maxLength}
            </Text>
          ) : null}
        </View>

        {helperText && !hasError ? (
          <Text style={styles.helperText}>{helperText}</Text>
        ) : null}

        <TextInput
          ref={ref}
          value={value}
          onChangeText={onChangeText}
          maxLength={maxLength}
          multiline={multiline}
          placeholder={placeholder}
          placeholderTextColor={colors.textMuted}
          style={[
            styles.input,
            multiline && styles.multilineInput,
            hasError && styles.inputError,
            inputStyle,
          ]}
          accessibilityLabel={label}
          accessibilityHint={hasError ? errorMessage : helperText}
          aria-invalid={hasError}
          {...rest}
        />

        {hasError ? (
          <Text style={styles.errorText} accessibilityRole="alert">
            {errorMessage}
          </Text>
        ) : null}
      </View>
    );
  }
);

TextField.displayName = 'TextField';

const styles = StyleSheet.create({
  container: {
    marginBottom: spacing.lg,
    width: '100%',
  },
  labelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.xs,
  },
  label: {
    ...typography.label,
    color: colors.text,
  },
  counter: {
    ...typography.caption,
    color: colors.textMuted,
  },
  helperText: {
    ...typography.caption,
    color: colors.textMuted,
    marginBottom: spacing.xs,
  },
  input: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radii.field,
    minHeight: 48,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    ...typography.body,
    color: colors.text,
  },
  multilineInput: {
    minHeight: 96,
    textAlignVertical: 'top',
    paddingTop: spacing.md,
  },
  inputError: {
    borderColor: colors.error,
    borderWidth: 1.5,
  },
  errorText: {
    ...typography.caption,
    color: colors.error,
    marginTop: spacing.xs,
  },
});
