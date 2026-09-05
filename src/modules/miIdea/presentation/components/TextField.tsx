import React, { useState, forwardRef } from 'react';
import { View, Text, TextInput, StyleSheet, TextInputProps, NativeSyntheticEvent, TargetedEvent } from 'react-native';
import { MiIdeaColors } from '../theme/colors';

interface TextFieldProps extends TextInputProps {
  label: string;
  helperText?: string;
  errorMessage?: string;
  showCounter?: boolean;
}

export const TextField = forwardRef<TextInput, TextFieldProps>(({ 
  label, 
  helperText, 
  errorMessage, 
  showCounter,
  maxLength,
  value = '',
  multiline,
  style,
  onFocus,
  onBlur,
  ...props 
}, ref) => {
  const [isFocused, setIsFocused] = useState(false);

  const handleFocus = (e: NativeSyntheticEvent<TargetedEvent>) => {
    setIsFocused(true);
    onFocus && onFocus(e);
  };

  const handleBlur = (e: NativeSyntheticEvent<TargetedEvent>) => {
    setIsFocused(false);
    onBlur && onBlur(e);
  };

  const hasError = !!errorMessage;
  
  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>
      
      <TextInput
        ref={ref}
        style={[
          styles.input,
          multiline && styles.multilineInput,
          isFocused && styles.inputFocused,
          hasError && styles.inputError,
          style
        ]}
        value={value}
        maxLength={maxLength}
        multiline={multiline}
        textAlignVertical={multiline ? 'top' : 'center'}
        onFocus={handleFocus}
        onBlur={handleBlur}
        placeholderTextColor={MiIdeaColors.mutedText}
        {...props}
      />
      
      <View style={styles.footer}>
        <View style={styles.helperContainer}>
          {hasError ? (
            <Text style={styles.errorText}>{errorMessage}</Text>
          ) : helperText ? (
            <Text style={styles.helperText}>{helperText}</Text>
          ) : <View />}
        </View>
        
        {showCounter && maxLength && (
          <Text style={styles.counterText}>
            {value.length}/{maxLength}
          </Text>
        )}
      </View>
    </View>
  );
});

TextField.displayName = 'TextField';

const styles = StyleSheet.create({
  container: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: MiIdeaColors.text,
    marginBottom: 8,
  },
  input: {
    minHeight: 48,
    borderWidth: 1,
    borderColor: MiIdeaColors.border,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 12,
    fontSize: 16,
    color: MiIdeaColors.text,
    backgroundColor: MiIdeaColors.surface,
  },
  multilineInput: {
    minHeight: 120,
    paddingTop: 12,
  },
  inputFocused: {
    borderColor: MiIdeaColors.primary,
    borderWidth: 2,
  },
  inputError: {
    borderColor: MiIdeaColors.error,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 4,
  },
  helperContainer: {
    flex: 1,
    paddingRight: 8,
  },
  helperText: {
    fontSize: 14,
    color: MiIdeaColors.mutedText,
  },
  errorText: {
    fontSize: 14,
    color: MiIdeaColors.error,
    fontWeight: '500',
  },
  counterText: {
    fontSize: 12,
    color: MiIdeaColors.mutedText,
  },
});
