import Ionicons from '@expo/vector-icons/Ionicons';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { SecondaryButton } from '@/src/components/ui';
import { colors, radii, spacing, typography } from '@/src/theme';

type CalculadoraIntegrationBannerProps = {
  onCopyPrice: () => void;
};

export function CalculadoraIntegrationBanner({
  onCopyPrice,
}: CalculadoraIntegrationBannerProps) {
  return (
    <View style={styles.container}>
      <View style={styles.headerRow}>
        <Ionicons name="calculator-outline" size={22} color={colors.secondary} />
        <Text style={styles.title}>Integración con Calculadora</Text>
      </View>
      <Text style={styles.text}>
        Si ya calculaste tus costos en la Calculadora financiera de EMPRENDE+,
        puedes copiar automáticamente el precio sugerido.
      </Text>
      <SecondaryButton
        title="Copiar precio sugerido"
        onPress={onCopyPrice}
        accessibilityHint="Copia el precio sugerido guardado en la Calculadora"
        style={styles.button}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.primaryLight,
    padding: spacing.lg,
    borderRadius: radii.card,
    marginBottom: spacing.lg,
    borderWidth: 1,
    borderColor: colors.border,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    marginBottom: spacing.xs,
  },
  title: {
    ...typography.h3,
    color: colors.secondary,
  },
  text: {
    ...typography.bodySmall,
    color: colors.text,
    marginBottom: spacing.md,
  },
  button: {
    backgroundColor: colors.surface,
  },
});
