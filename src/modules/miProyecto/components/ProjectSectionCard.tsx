import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { ContentCard, SecondaryButton, StatusBadge } from '@/src/components/ui';
import { formatMoney } from '@/src/modules/calculadora';
import { colors } from '@/src/theme';
import {
  ChallengesProjectSummary,
  FinanceProjectSummary,
  IdeaProjectSummary,
  QuizProjectSummary,
} from '../domain/types';

interface ProjectSectionCardProps {
  type: 'idea' | 'finance' | 'quiz' | 'retos';
  title: string;
  idea?: IdeaProjectSummary;
  finance?: FinanceProjectSummary;
  quiz?: QuizProjectSummary;
  retos?: ChallengesProjectSummary;
  onNavigate: (route: string) => void;
}

export const ProjectSectionCard: React.FC<ProjectSectionCardProps> = ({
  type,
  title,
  idea,
  finance,
  quiz,
  retos,
  onNavigate,
}) => {
  const getStatusBadge = () => {
    switch (type) {
      case 'idea':
        if (idea?.status === 'valid') return <StatusBadge status="completed" customLabel="Completo" />;
        if (idea?.status === 'error') return <StatusBadge status="failed" customLabel="Error" />;
        return <StatusBadge status="pending" customLabel="Pendiente" />;

      case 'finance':
        if (finance?.status === 'valid') return <StatusBadge status="completed" customLabel="Completo" />;
        if (finance?.status === 'error') return <StatusBadge status="failed" customLabel="Error" />;
        return <StatusBadge status="pending" customLabel="Pendiente" />;

      case 'quiz':
        if (quiz?.status === 'valid') {
          if (quiz.isCompleted) {
            return quiz.approved
              ? <StatusBadge status="approved" customLabel="Aprobado" />
              : <StatusBadge status="failed" customLabel="No aprobado" />;
          }
          return <StatusBadge status="started" customLabel="En progreso" />;
        }
        if (quiz?.status === 'error') return <StatusBadge status="failed" customLabel="Error" />;
        return <StatusBadge status="pending" customLabel="Pendiente" />;

      case 'retos':
        if (retos?.status === 'valid') {
          if (retos.completedCount === 3) {
            return <StatusBadge status="completed" customLabel="Completo (3/3)" />;
          }
          if (retos.completedCount > 0) {
            return <StatusBadge status="started" customLabel={`${retos.completedCount}/3 Retos`} />;
          }
          return <StatusBadge status="pending" customLabel="Pendiente (0/3)" />;
        }
        if (retos?.status === 'error') return <StatusBadge status="failed" customLabel="Error" />;
        return <StatusBadge status="pending" customLabel="Pendiente" />;
    }
  };

  const renderContent = () => {
    if (type === 'idea') {
      if (idea?.status === 'error') {
        return <Text style={styles.errorText}>{idea.errorMessage}</Text>;
      }
      if (idea?.status === 'empty' || !idea) {
        return <Text style={styles.emptyText}>Aún no has definido tu idea de negocio.</Text>;
      }
      return (
        <View style={styles.detailsContainer}>
          <Text style={styles.itemTitle}>{idea.nombreNegocio || 'Sin nombre'}</Text>
          {idea.problema ? (
            <View style={styles.fieldRow}>
              <Text style={styles.fieldLabel}>Problema:</Text>
              <Text style={styles.fieldValue}>{idea.problema}</Text>
            </View>
          ) : null}
          {idea.solucion ? (
            <View style={styles.fieldRow}>
              <Text style={styles.fieldLabel}>Solución:</Text>
              <Text style={styles.fieldValue}>{idea.solucion}</Text>
            </View>
          ) : null}
          {idea.publicoObjetivo ? (
            <View style={styles.fieldRow}>
              <Text style={styles.fieldLabel}>Público:</Text>
              <Text style={styles.fieldValue}>{idea.publicoObjetivo}</Text>
            </View>
          ) : null}
          {idea.recursosNecesarios ? (
            <View style={styles.fieldRow}>
              <Text style={styles.fieldLabel}>Recursos:</Text>
              <Text style={styles.fieldValue}>{idea.recursosNecesarios}</Text>
            </View>
          ) : null}
        </View>
      );
    }

    if (type === 'finance') {
      if (finance?.status === 'error') {
        return <Text style={styles.errorText}>{finance.errorMessage}</Text>;
      }
      if (finance?.status === 'empty' || !finance) {
        return <Text style={styles.emptyText}>Aún no has realizado el cálculo financiero.</Text>;
      }
      return (
        <View style={styles.detailsContainer}>
          <View style={styles.gridRow}>
            <View style={styles.gridCol}>
              <Text style={styles.fieldLabel}>Inversión Inicial</Text>
              <Text style={styles.statValue}>
                {finance.inversionInicial !== null ? formatMoney(finance.inversionInicial) : '-'}
              </Text>
            </View>
            <View style={styles.gridCol}>
              <Text style={styles.fieldLabel}>Costo Total</Text>
              <Text style={styles.statValue}>
                {finance.costoTotal !== null ? formatMoney(finance.costoTotal) : '-'}
              </Text>
            </View>
          </View>
          <View style={styles.gridRow}>
            <View style={styles.gridCol}>
              <Text style={styles.fieldLabel}>Precio Sugerido</Text>
              <Text style={styles.statValue}>
                {finance.precioSugerido !== null ? formatMoney(finance.precioSugerido) : '-'}
              </Text>
            </View>
            <View style={styles.gridCol}>
              <Text style={styles.fieldLabel}>Ganancia Operativa</Text>
              <Text style={styles.statValue}>
                {finance.gananciaOperativa !== null ? formatMoney(finance.gananciaOperativa) : '-'}
              </Text>
            </View>
          </View>
        </View>
      );
    }

    if (type === 'quiz') {
      if (quiz?.status === 'error') {
        return <Text style={styles.errorText}>{quiz.errorMessage}</Text>;
      }
      if (quiz?.status === 'empty' || !quiz) {
        return <Text style={styles.emptyText}>Aún no has realizado la evaluación de conocimientos.</Text>;
      }
      return (
        <View style={styles.detailsContainer}>
          <Text style={styles.statValueLarge}>
            {quiz.score !== null ? `Puntaje: ${quiz.score}/10` : 'En progreso'}
          </Text>
          <Text style={styles.fieldValue}>
            {quiz.isCompleted
              ? quiz.approved
                ? '¡Felicidades! Has aprobado la evaluación.'
                : 'Evaluación completada (puedes volver a realizarla para mejorar).'
              : 'Has iniciado el cuestionario. Continúa respondiendo.'}
          </Text>
        </View>
      );
    }

    if (type === 'retos') {
      if (retos?.status === 'error') {
        return <Text style={styles.errorText}>{retos.errorMessage}</Text>;
      }
      if (retos?.status === 'empty' || !retos) {
        return <Text style={styles.emptyText}>Aún no has comenzado los retos prácticos.</Text>;
      }
      return (
        <View style={styles.detailsContainer}>
          <Text style={styles.statValueLarge}>
            {retos.completedCount} de 3 retos completados
          </Text>
          <View style={styles.challengeList}>
            {retos.challenges.map((c, index) => (
              <View key={c.id} style={styles.challengeItem}>
                <Text style={styles.challengeName}>Reto {index + 1}</Text>
                <Text
                  style={[
                    styles.challengeStatusText,
                    c.status === 'completed'
                      ? styles.completedColor
                      : c.status === 'started'
                      ? styles.inProgressColor
                      : styles.pendingColor,
                  ]}
                >
                  {c.status === 'completed'
                    ? 'Completado'
                    : c.status === 'started'
                    ? 'En curso'
                    : 'Pendiente'}
                </Text>
              </View>
            ))}
          </View>
        </View>
      );
    }

    return null;
  };

  const getActionText = () => {
    switch (type) {
      case 'idea':
        return idea?.status === 'valid' ? 'Ver o editar idea' : 'Crear mi idea';
      case 'finance':
        return finance?.status === 'valid' ? 'Abrir calculadora' : 'Calcular finanzas';
      case 'quiz':
        return quiz?.isCompleted ? 'Repetir quiz' : quiz?.status === 'valid' ? 'Continuar quiz' : 'Realizar quiz';
      case 'retos':
        return retos?.completedCount === 3 ? 'Ver retos' : retos?.completedCount ? 'Continuar retos' : 'Comenzar retos';
    }
  };

  const getRoute = () => {
    switch (type) {
      case 'idea':
        return '/(tabs)/mi-idea';
      case 'finance':
        return '/calculadora';
      case 'quiz':
        return '/quiz';
      case 'retos':
        return '/(tabs)/retos';
    }
  };

  return (
    <ContentCard style={styles.card}>
      <View style={styles.headerRow}>
        <Text style={styles.title}>{title}</Text>
        {getStatusBadge()}
      </View>

      {renderContent()}

      <View style={styles.buttonContainer}>
        <SecondaryButton
          title={getActionText()}
          onPress={() => onNavigate(getRoute())}
        />
      </View>
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
  title: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.secondary,
  },
  emptyText: {
    fontSize: 14,
    color: colors.textMuted,
    marginVertical: 8,
  },
  errorText: {
    fontSize: 14,
    color: colors.error,
    marginVertical: 8,
    lineHeight: 20,
  },
  detailsContainer: {
    marginVertical: 4,
  },
  itemTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.primaryDark,
    marginBottom: 8,
  },
  fieldRow: {
    marginBottom: 6,
  },
  fieldLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.textMuted,
  },
  fieldValue: {
    fontSize: 14,
    color: colors.text,
    marginTop: 2,
    lineHeight: 20,
  },
  gridRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  gridCol: {
    flex: 1,
  },
  statValue: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.secondary,
    marginTop: 2,
  },
  statValueLarge: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.secondary,
    marginBottom: 6,
  },
  challengeList: {
    marginTop: 8,
  },
  challengeItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 4,
  },
  challengeName: {
    fontSize: 14,
    color: colors.text,
  },
  challengeStatusText: {
    fontSize: 12,
    fontWeight: '600',
  },
  completedColor: {
    color: colors.success,
  },
  inProgressColor: {
    color: colors.warning,
  },
  pendingColor: {
    color: colors.textMuted,
  },
  buttonContainer: {
    marginTop: 12,
  },
});
