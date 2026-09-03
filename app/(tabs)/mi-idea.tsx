<<<<<<< Updated upstream
import { useEffect, useMemo, useRef } from 'react';
import {
    Alert,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';

import { useMiIdea } from '@/src/modules/miIdea/hooks/useMiIdea';

const FIELD_CONFIG = [
  { key: 'nombreNegocio', label: 'Nombre de la idea', placeholder: 'Escribe un nombre para identificar tu idea.', multiline: false },
  { key: 'problema', label: 'Problema', placeholder: 'Describe la necesidad que deseas resolver.', multiline: true },
  { key: 'solucion', label: 'Solución', placeholder: 'Explica cómo tu propuesta resolverá el problema.', multiline: true },
  { key: 'publicoObjetivo', label: 'Público objetivo', placeholder: 'Indica quiénes necesitan o comprarían la solución.', multiline: false },
  { key: 'recursosNecesarios', label: 'Recursos', placeholder: 'Incluye recursos materiales, económicos o humanos.', multiline: true },
] as const;

export default function MiIdeaScreen() {
  const {
    form,
    errors,
    isLoading,
    isSaving,
    readError,
    saveError,
    savedAt,
    statusText,
    loadIdea,
    updateField,
    submit,
  } = useMiIdea();
=======
import { IconSymbol } from '@/components/ui/icon-symbol';
import { useBottomTabBarHeight } from '@react-navigation/bottom-tabs';
import { useNavigation } from 'expo-router';
import { useEffect, useRef, useState } from 'react';
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View
} from 'react-native';

import { getBusinessIdea, saveBusinessIdea } from '@/src/modules/miIdea/data/repository';
import { BusinessIdea, MiIdeaErrors } from '@/src/modules/miIdea/domain/BusinessIdea';
import { normalizeText, validateMiIdea, validateSingleField } from '@/src/modules/miIdea/domain/validators';
import { ContentCard } from '@/src/modules/miIdea/presentation/components/ContentCard';
import { PrimaryButton } from '@/src/modules/miIdea/presentation/components/PrimaryButton';
import { TextField } from '@/src/modules/miIdea/presentation/components/TextField';
import { MiIdeaColors } from '@/src/modules/miIdea/presentation/theme/colors';

export default function MiIdeaScreen() {
  const tabBarHeight = useBottomTabBarHeight();

  const [nombre, setNombre] = useState('');
  const [problema, setProblema] = useState('');
  const [solucion, setSolucion] = useState('');
  const [publico, setPublico] = useState('');
  const [recursos, setRecursos] = useState('');
>>>>>>> Stashed changes

  const inputRefs = useRef<Record<string, TextInput | null>>({});

  useEffect(() => {
    void loadIdea();
  }, [loadIdea]);

  useEffect(() => {
<<<<<<< Updated upstream
    const firstInvalid = Object.keys(errors)[0] as keyof typeof form | undefined;
    if (!firstInvalid) {
      return;
    }

    const timeout = setTimeout(() => {
      const ref = inputRefs.current[firstInvalid];
      if (ref) {
        ref.focus();
      }
    }, 80);

    return () => clearTimeout(timeout);
  }, [errors, form]);

  const formattedDate = useMemo(() => {
    if (!savedAt) {
      return 'Aún no has guardado tu idea.';
=======
    const unsubscribe = navigation.addListener('beforeRemove', (e) => {
      if (!isDirty) {
        return;
      }

      e.preventDefault();

      if (Platform.OS === 'web') {
        const confirmDiscard = window.confirm('Tienes cambios que aún no has guardado. ¿Deseas salir de todas formas?');
        if (confirmDiscard) {
          navigation.dispatch(e.data.action);
        }
      } else {
        Alert.alert(
          'Cambios sin guardar',
          'Tienes cambios que aún no has guardado. ¿Deseas salir de todas formas?',
          [
            { text: 'Seguir editando', style: 'cancel', onPress: () => { } },
            {
              text: 'Salir sin guardar',
              style: 'destructive',
              onPress: () => navigation.dispatch(e.data.action)
            }
          ]
        );
      }
    });

    return unsubscribe;
  }, [navigation, isDirty]);

  const handleChange = (field: keyof MiIdeaErrors, value: string) => {
    // 1. Actualizar el estado correspondiente
    switch (field) {
      case 'nombreNegocio': setNombre(value); break;
      case 'problema': setProblema(value); break;
      case 'solucion': setSolucion(value); break;
      case 'publicoObjetivo': setPublico(value); break;
      case 'recursosNecesarios': setRecursos(value); break;
    }

    // 2. Si el campo tenía un error, revalidarlo de inmediato
    if (errors[field]) {
      const errorMsg = validateSingleField(field, value);
      setErrors((prev) => {
        const newErrors = { ...prev };
        if (errorMsg) {
          newErrors[field] = errorMsg;
        } else {
          delete newErrors[field];
        }
        return newErrors;
      });
    }
  };

  const handleSave = async () => {
    setSuccessMessage('');
    setSaveError('');

    // Normalizar
    const normNombre = normalizeText(nombre);
    const normProblema = normalizeText(problema);
    const normSolucion = normalizeText(solucion);
    const normPublico = normalizeText(publico);
    const normRecursos = normalizeText(recursos);

    // Validar todos los campos usando las funciones puras
    const newErrors = validateMiIdea(normNombre, normProblema, normSolucion, normPublico, normRecursos);
    setErrors(newErrors);

    if (Object.keys(newErrors).length > 0) {
      // Enfocar el primer error encontrado respetando el orden del formulario
      if (newErrors.nombreNegocio) {
        nombreRef.current?.focus();
      } else if (newErrors.problema) {
        problemaRef.current?.focus();
      } else if (newErrors.solucion) {
        solucionRef.current?.focus();
      } else if (newErrors.publicoObjetivo) {
        publicoRef.current?.focus();
      } else if (newErrors.recursosNecesarios) {
        recursosRef.current?.focus();
      }
      return;
    }

    setIsSaving(true);

    const ideaToSave: BusinessIdea = {
      schemaVersion: 1,
      nombreNegocio: normNombre,
      problema: normProblema,
      solucion: normSolucion,
      publicoObjetivo: normPublico,
      recursosNecesarios: normRecursos,
      updatedAt: new Date().toISOString(),
    };

    try {
      await saveBusinessIdea(ideaToSave);

      // Actualizar a los valores normalizados (sin espacios extra)
      setNombre(normNombre);
      setProblema(normProblema);
      setSolucion(normSolucion);
      setPublico(normPublico);
      setRecursos(normRecursos);

      // Actualizar el snapshot para limpiar isDirty
      setSnapshot({
        nombreNegocio: normNombre,
        problema: normProblema,
        solucion: normSolucion,
        publicoObjetivo: normPublico,
        recursosNecesarios: normRecursos
      });

      setSuccessMessage('Tu idea se guardó correctamente.');
    } catch {
      setSaveError('No pudimos guardar los cambios. Inténtalo nuevamente.');
    } finally {
      setIsSaving(false);
>>>>>>> Stashed changes
    }

    const date = new Date(savedAt);
    if (Number.isNaN(date.getTime())) {
      return 'Aún no has guardado tu idea.';
    }

    return date.toLocaleString('es-ES', {
      dateStyle: 'medium',
      timeStyle: 'short',
    });
  }, [savedAt]);

  const handleSubmit = async () => {
    const result = await submit();

    if (result.ok) {
      Alert.alert('Éxito', 'Tu idea se guardó correctamente.');
      return;
    }

    const message = saveError ?? 'No pudimos guardar los cambios. Reintenta sin cerrar la pantalla.';
    Alert.alert('Error', message);
  };

  if (isLoading) {
    return (
      <View style={styles.centeredState}>
        <Text style={styles.stateText}>Cargando tu idea...</Text>
      </View>
    );
  }

  return (
<<<<<<< Updated upstream
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={90}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={styles.title}>Mi Idea</Text>
          <Text style={styles.status}>{statusText}</Text>
          {savedAt ? (
            <Text style={styles.date}>Guardado: {formattedDate}</Text>
          ) : (
            <Text style={styles.date}>Aún no has guardado tu idea.</Text>
          )}
        </View>

        {readError ? (
          <View style={styles.noticeError}>
            <Text style={styles.noticeText}>No pudimos cargar tu idea. Intenta de nuevo.</Text>
            <TouchableOpacity style={styles.secondaryButton} onPress={() => void loadIdea()}>
              <Text style={styles.secondaryButtonText}>Reintentar</Text>
            </TouchableOpacity>
=======
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        style={styles.keyboardAvoiding}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView
          contentContainerStyle={[styles.scrollContent, { paddingBottom: tabBarHeight + 24 }]}
          keyboardShouldPersistTaps="handled"
        >
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.title}>Mi Idea</Text>
            <Text style={styles.subtitle}>
              Convierte una necesidad en una propuesta de negocio clara y estructurada.
            </Text>
>>>>>>> Stashed changes
          </View>
        ) : null}

        {FIELD_CONFIG.map((field) => {
          const value = form[field.key];
          const error = errors[field.key];

          return (
            <View key={field.key} style={styles.fieldGroup}>
              <Text style={styles.label}>{field.label}</Text>
              <Text style={styles.helper}> {field.key === 'nombreNegocio' ? 'Escribe un nombre para identificar tu idea.' : field.key === 'problema' ? 'Describe la necesidad que deseas resolver.' : field.key === 'solucion' ? 'Explica cómo tu propuesta resolverá el problema.' : field.key === 'publicoObjetivo' ? 'Indica quiénes necesitan o comprarían la solución.' : 'Incluye recursos materiales, económicos o humanos.'}</Text>
              <TextInput
                ref={(ref) => {
                  inputRefs.current[field.key] = ref;
                }}
                value={value}
                onChangeText={(nextValue) => updateField(field.key, nextValue)}
                placeholder={field.placeholder}
                placeholderTextColor="#8f9bb3"
                multiline={field.multiline}
                numberOfLines={field.multiline ? 5 : 1}
                style={[
                  styles.input,
                  field.multiline ? styles.textarea : null,
                  error ? styles.inputError : null,
                ]}
                textAlignVertical={field.multiline ? 'top' : 'center'}
                autoCapitalize={field.key === 'nombreNegocio' || field.key === 'publicoObjetivo' ? 'words' : 'sentences'}
                autoCorrect
                blurOnSubmit={!field.multiline}
                returnKeyType={field.multiline ? 'default' : 'next'}
              />
              {error ? <Text style={styles.errorText}>{error}</Text> : null}
            </View>
          );
        })}

        {saveError ? <Text style={styles.errorText}>{saveError}</Text> : null}

<<<<<<< Updated upstream
        <TouchableOpacity
          style={[styles.primaryButton, isSaving ? styles.primaryButtonDisabled : null]}
          onPress={() => void handleSubmit()}
          disabled={isSaving}>
          <Text style={styles.primaryButtonText}>{isSaving ? 'Guardando...' : 'Guardar idea'}</Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
=======
          {/* Formulario */}
          <View style={styles.formContainer}>
            <TextField
              ref={nombreRef}
              label="Nombre del negocio"
              helperText="Escribe un nombre para identificar tu idea."
              errorMessage={errors.nombreNegocio}
              value={nombre}
              onChangeText={(val) => handleChange('nombreNegocio', val)}
              maxLength={50}
              showCounter
            />

            <TextField
              ref={problemaRef}
              label="Problema"
              helperText="Describe la necesidad que deseas resolver."
              errorMessage={errors.problema}
              value={problema}
              onChangeText={(val) => handleChange('problema', val)}
              multiline
            />

            <TextField
              ref={solucionRef}
              label="Solución"
              helperText="Explica cómo tu propuesta resolverá el problema."
              errorMessage={errors.solucion}
              value={solucion}
              onChangeText={(val) => handleChange('solucion', val)}
              multiline
            />

            <TextField
              ref={publicoRef}
              label="Público objetivo"
              helperText="Indica quiénes necesitan o comprarían la solución."
              errorMessage={errors.publicoObjetivo}
              value={publico}
              onChangeText={(val) => handleChange('publicoObjetivo', val)}
            />

            <TextField
              ref={recursosRef}
              label="Recursos necesarios"
              helperText="Incluye recursos materiales, económicos o humanos."
              errorMessage={errors.recursosNecesarios}
              value={recursos}
              onChangeText={(val) => handleChange('recursosNecesarios', val)}
              multiline
            />
          </View>

          {/* Botón Guardar */}
          <View style={styles.buttonContainer}>
            <PrimaryButton
              title="Guardar mi idea"
              onPress={handleSave}
              loading={isSaving}
            />
          </View>

        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
>>>>>>> Stashed changes
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f7fb',
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 32,
  },
  centeredState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f7fb',
  },
  stateText: {
    fontSize: 18,
    color: '#2c3a4b',
    fontWeight: '600',
  },
  header: {
    marginBottom: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#1d2939',
    marginBottom: 8,
  },
  status: {
    fontSize: 16,
    color: '#475467',
    marginBottom: 6,
  },
  date: {
    fontSize: 13,
    color: '#667085',
  },
  fieldGroup: {
    marginBottom: 18,
  },
  label: {
    fontSize: 15,
    fontWeight: '600',
    color: '#1d2939',
    marginBottom: 6,
  },
  helper: {
    fontSize: 12,
    color: '#667085',
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#ffffff',
    minHeight: 52,
    borderWidth: 1,
    borderColor: '#d0d5dd',
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 15,
    color: '#101828',
  },
  textarea: {
    minHeight: 110,
    textAlignVertical: 'top',
  },
  inputError: {
    borderColor: '#d92d20',
  },
  errorText: {
    color: '#d92d20',
    fontSize: 12,
    marginTop: 6,
  },
  primaryButton: {
    backgroundColor: '#f97316',
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 12,
  },
  primaryButtonDisabled: {
    opacity: 0.7,
  },
  primaryButtonText: {
    color: '#ffffff',
    fontWeight: '700',
    fontSize: 16,
  },
  secondaryButton: {
    backgroundColor: '#e4e7ec',
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 14,
    alignSelf: 'flex-start',
    marginTop: 8,
  },
  secondaryButtonText: {
    color: '#344054',
    fontWeight: '600',
  },
  noticeError: {
    backgroundColor: '#fee4e2',
    borderWidth: 1,
    borderColor: '#fecdca',
    borderRadius: 12,
    padding: 12,
    marginBottom: 18,
  },
  noticeText: {
    color: '#b42318',
    fontSize: 14,
  },
<<<<<<< Updated upstream
=======
  errorContainer: {
    backgroundColor: MiIdeaColors.error + '1A',
    borderColor: MiIdeaColors.error,
    borderWidth: 1,
    padding: 16,
    borderRadius: 12,
    marginBottom: 24,
  },
  errorTextGlobal: {
    color: MiIdeaColors.error,
    fontSize: 15,
    fontWeight: '500',
    textAlign: 'center',
  }
>>>>>>> Stashed changes
});
