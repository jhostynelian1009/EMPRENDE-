import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

type AprendeProgressBarProps = {
  completedCount: number;
  totalLessons: number;
  progressPercentage: number;
};

/**
 * Barra de progreso local al módulo Aprende.
 * No almacena ni recalcula el porcentaje: lo recibe como prop derivado de useAprende.
 * Clampea el ancho entre 0 % y 100 % para protección visual.
 */
export function AprendeProgressBar({
  completedCount,
  totalLessons,
  progressPercentage,
}: AprendeProgressBarProps) {
  // Protección visual: porcentaje entero entre 0 y 100.
  const clampedPercent = Math.min(100, Math.max(0, Math.round(progressPercentage)));
  const widthPercent = `${clampedPercent}%` as const;

  const hasCompleted = completedCount > 0;
  const isComplete = completedCount >= totalLessons;

  const statusText = isComplete
    ? '¡Completaste las siete lecciones! Puedes repasarlas cuando quieras.'
    : hasCompleted
      ? `Has revisado ${completedCount} de ${totalLessons} lecciones.`
      : 'Empieza con los conceptos básicos del emprendimiento.';

  return (
    <View style={styles.container}>
      <Text style={styles.statusText}>{statusText}</Text>

      {/* Barra */}
      <View style={styles.track}>
        <View style={[styles.fill, { width: widthPercent }]} />
      </View>

      {/* Etiqueta de porcentaje */}
      <Text style={styles.percentLabel}>{clampedPercent} %</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 24,
  },
  statusText: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 8,
    lineHeight: 20,
  },
  track: {
    height: 8,
    backgroundColor: '#E5E7EB',
    borderRadius: 8,
    overflow: 'hidden',
    marginBottom: 4,
  },
  fill: {
    height: '100%',
    backgroundColor: '#0F766E',
    borderRadius: 8,
  },
  percentLabel: {
    fontSize: 12,
    fontWeight: '500',
    color: '#0F766E',
    textAlign: 'right',
  },
});
