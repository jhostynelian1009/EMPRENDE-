import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { ContentCard, PrimaryButton } from '@/src/components/ui';
import { colors } from '@/src/theme';
import { ProjectNextAction } from '../domain/types';

interface NextActionCardProps {
  nextAction: ProjectNextAction;
  onPressAction: (route: string | null) => void;
}

export const NextActionCard: React.FC<NextActionCardProps> = ({
  nextAction,
  onPressAction,
}) => {
  return (
    <ContentCard style={styles.card}>
      <Text style={styles.badgeLabel}>Siguiente paso recomendado</Text>
      <Text style={styles.title}>{nextAction.title}</Text>
      <Text style={styles.message}>{nextAction.message}</Text>

      <View style={styles.buttonContainer}>
        <PrimaryButton
          title={nextAction.actionText}
          onPress={() => onPressAction(nextAction.route)}
        />
      </View>
    </ContentCard>
  );
};

const styles = StyleSheet.create({
  card: {
    marginBottom: 20,
    padding: 16,
    borderLeftWidth: 4,
    borderLeftColor: colors.primary,
  },
  badgeLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.primaryDark,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 4,
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.secondary,
    marginBottom: 4,
  },
  message: {
    fontSize: 14,
    color: colors.text,
    lineHeight: 20,
    marginBottom: 16,
  },
  buttonContainer: {
    marginTop: 4,
  },
});
