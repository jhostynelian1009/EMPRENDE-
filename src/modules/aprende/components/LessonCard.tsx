import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { Lesson } from '../domain/types';

export type LessonStatus = 'completed' | 'inProgress' | 'pending';

type LessonCardProps = {
  lesson: Lesson;
  status: LessonStatus;
  onPress: () => void;
};

/**
 * Etiquetas de estado y acción según spec/02-modules/aprende/spec.md.
 */
const STATUS_LABEL: Record<LessonStatus, string> = {
  completed: 'Revisada',
  inProgress: 'En progreso',
  pending: 'Pendiente',
};

const ACTION_LABEL: Record<LessonStatus, string> = {
  completed: 'Repasar',
  inProgress: 'Continuar',
  pending: 'Comenzar',
};

const STATUS_COLOR: Record<LessonStatus, string> = {
  completed: '#15803D',  // color.success
  inProgress: '#0F766E', // color.accent
  pending: '#6B7280',    // color.textMuted
};

export function LessonCard({ lesson, status, onPress }: LessonCardProps) {
  const actionLabel = ACTION_LABEL[status];
  const statusLabel = STATUS_LABEL[status];
  const statusColor = STATUS_COLOR[status];

  return (
    <View style={styles.card}>
      {/* Número y estado */}
      <View style={styles.headerRow}>
        <View style={styles.orderBadge}>
          <Text style={styles.orderText}>{lesson.order}</Text>
        </View>
        <Text style={[styles.statusLabel, { color: statusColor }]}>{statusLabel}</Text>
      </View>

      {/* Título */}
      <Text style={styles.title}>{lesson.title}</Text>

      {/* Objetivo (texto breve ya disponible en los datos) */}
      <Text style={styles.objective} numberOfLines={2}>
        {lesson.objective}
      </Text>

      {/* Acción */}
      <Pressable
        onPress={onPress}
        style={({ pressed }) => [styles.actionButton, pressed && styles.actionButtonPressed]}
        accessibilityRole="button"
        accessibilityLabel={`${actionLabel} lección ${lesson.order}: ${lesson.title}`}
      >
        <Text style={styles.actionText}>{actionLabel}</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000000',
    shadowOpacity: 0.08,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 3 },
    elevation: 2,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  orderBadge: {
    backgroundColor: '#FFEDD5',
    borderRadius: 20,
    width: 32,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  orderText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#C2410C',
  },
  statusLabel: {
    fontSize: 12,
    fontWeight: '500',
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 4,
  },
  objective: {
    fontSize: 14,
    color: '#6B7280',
    lineHeight: 20,
    marginBottom: 12,
  },
  actionButton: {
    backgroundColor: '#C2410C',
    borderRadius: 12,
    paddingVertical: 10,
    paddingHorizontal: 16,
    alignSelf: 'flex-start',
    minHeight: 40,
    justifyContent: 'center',
  },
  actionButtonPressed: {
    opacity: 0.8,
  },
  actionText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
});
