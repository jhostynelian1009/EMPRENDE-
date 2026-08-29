import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

type LessonSectionProps = {
  label: string;
  children: React.ReactNode;
  /** Aplica un fondo de acento al bloque (usado para "Idea clave") */
  highlighted?: boolean;
};

/**
 * Bloque etiquetado para cada sección del detalle de lección.
 * Mantiene la pantalla [lessonId].tsx sin repetición de estructura visual.
 */
export function LessonSection({ label, children, highlighted = false }: LessonSectionProps) {
  return (
    <View style={[styles.container, highlighted && styles.highlighted]}>
      <Text style={[styles.label, highlighted && styles.labelHighlighted]}>{label}</Text>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 20,
  },
  highlighted: {
    backgroundColor: '#FFEDD5',
    borderRadius: 12,
    padding: 16,
    borderLeftWidth: 4,
    borderLeftColor: '#F97316',
  },
  label: {
    fontSize: 12,
    fontWeight: '600',
    color: '#6B7280',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 6,
  },
  labelHighlighted: {
    color: '#C2410C',
  },
});
