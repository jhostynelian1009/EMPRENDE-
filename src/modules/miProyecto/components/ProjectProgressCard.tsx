import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { ContentCard, ProgressBar } from '@/src/components/ui';
import { colors } from '@/src/theme';

interface ProjectProgressCardProps {
  progressPercentage: number;
  lastUpdatedAt: string | null;
}

function formatDate(isoString: string | null): string {
  if (!isoString) return '';
  try {
    const date = new Date(isoString);
    return date.toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  } catch {
    return '';
  }
}

export const ProjectProgressCard: React.FC<ProjectProgressCardProps> = ({
  progressPercentage,
  lastUpdatedAt,
}) => {
  const formattedDate = formatDate(lastUpdatedAt);

  return (
    <ContentCard style={styles.card}>
      <View style={styles.headerRow}>
        <View style={styles.textContainer}>
          <Text style={styles.title}>Progreso general</Text>
          <Text style={styles.subtitle}>Resumen del avance de tu proyecto</Text>
        </View>
        <Text style={styles.percentageText}>{progressPercentage}%</Text>
      </View>

      <View style={styles.progressContainer}>
        <ProgressBar progress={progressPercentage} />
      </View>

      {formattedDate ? (
        <Text style={styles.updatedAtText}>
          Última actualización: {formattedDate}
        </Text>
      ) : null}
    </ContentCard>
  );
};

const styles = StyleSheet.create({
  card: {
    marginBottom: 16,
    padding: 16,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  textContainer: {
    flex: 1,
    marginRight: 12,
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.secondary,
  },
  subtitle: {
    fontSize: 14,
    color: colors.textMuted,
    marginTop: 2,
  },
  percentageText: {
    fontSize: 28,
    fontWeight: '800',
    color: colors.primary,
  },
  progressContainer: {
    marginVertical: 4,
  },
  updatedAtText: {
    fontSize: 12,
    color: colors.textMuted,
    marginTop: 12,
  },
});
