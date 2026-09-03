<<<<<<< HEAD
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
=======
import React, { useState, useRef, useEffect } from 'react';
import { 
  StyleSheet, 
  ScrollView, 
  KeyboardAvoidingView, 
  Platform, 
  View, 
  Text,
  SafeAreaView,
  TextInput,
  Alert
>>>>>>> efc6cb34c0e44541333d066a00a05ae89f1183d7
} from 'react-native';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { useBottomTabBarHeight } from '@react-navigation/bottom-tabs';
import { useNavigation } from 'expo-router';

import { MiIdeaColors } from '@/src/modules/miIdea/presentation/theme/colors';
import { TextField } from '@/src/modules/miIdea/presentation/components/TextField';
import { PrimaryButton } from '@/src/modules/miIdea/presentation/components/PrimaryButton';
import { ContentCard } from '@/src/modules/miIdea/presentation/components/ContentCard';
import { validateMiIdea, validateSingleField, normalizeText } from '@/src/modules/miIdea/domain/validators';
import { MiIdeaErrors, BusinessIdea } from '@/src/modules/miIdea/domain/BusinessIdea';
import { getBusinessIdea, saveBusinessIdea } from '@/src/modules/miIdea/data/repository';

export default function MiIdeaScreen() {
<<<<<<< HEAD
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

=======
  const tabBarHeight = useBottomTabBarHeight();
  
>>>>>>> efc6cb34c0e44541333d066a00a05ae89f1183d7
  const [nombre, setNombre] = useState('');
  const [problema, setProblema] = useState('');
  const [solucion, setSolucion] = useState('');
  const [publico, setPublico] = useState('');
  const [recursos, setRecursos] = useState('');
<<<<<<< HEAD
>>>>>>> Stashed changes
=======
>>>>>>> efc6cb34c0e44541333d066a00a05ae89f1183d7

  // Snapshot del último estado guardado
  const [snapshot, setSnapshot] = useState({
    nombreNegocio: '',
    problema: '',
    solucion: '',
    publicoObjetivo: '',
    recursosNecesarios: ''
  });
  const [isLoading, setIsLoading] = useState(true);

  // Estados visuales
  const [isSaving, setIsSaving] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [saveError, setSaveError] = useState('');
  // Referencias para focalizar el primer campo inválido
  const nombreRef = useRef<TextInput>(null);
  const problemaRef = useRef<TextInput>(null);
  const solucionRef = useRef<TextInput>(null);
  const publicoRef = useRef<TextInput>(null);
  const recursosRef = useRef<TextInput>(null);

  // Errores con el tipo de dominio
  const [errors, setErrors] = useState<MiIdeaErrors>({});

  useEffect(() => {
    async function preload() {
      const idea = await getBusinessIdea();
      if (idea) {
        setNombre(idea.nombreNegocio);
        setProblema(idea.problema);
        setSolucion(idea.solucion);
        setPublico(idea.publicoObjetivo);
        setRecursos(idea.recursosNecesarios);

<<<<<<< HEAD
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
=======
        setSnapshot({
          nombreNegocio: idea.nombreNegocio,
          problema: idea.problema,
          solucion: idea.solucion,
          publicoObjetivo: idea.publicoObjetivo,
          recursosNecesarios: idea.recursosNecesarios
        });
      }
      setIsLoading(false);
>>>>>>> efc6cb34c0e44541333d066a00a05ae89f1183d7
    }
    preload();
  }, []);

  const isDirty = !isLoading && (
    normalizeText(nombre) !== snapshot.nombreNegocio ||
    normalizeText(problema) !== snapshot.problema ||
    normalizeText(solucion) !== snapshot.solucion ||
    normalizeText(publico) !== snapshot.publicoObjetivo ||
    normalizeText(recursos) !== snapshot.recursosNecesarios
  );

  const navigation = useNavigation();

  useEffect(() => {
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
            { text: 'Seguir editando', style: 'cancel', onPress: () => {} },
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
    }
  };

  return (
<<<<<<< HEAD
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
=======
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView 
        style={styles.keyboardAvoiding} 
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView 
>>>>>>> efc6cb34c0e44541333d066a00a05ae89f1183d7
          contentContainerStyle={[styles.scrollContent, { paddingBottom: tabBarHeight + 24 }]}
          keyboardShouldPersistTaps="handled"
        >
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.title}>Mi Idea</Text>
            <Text style={styles.subtitle}>
              Convierte una necesidad en una propuesta de negocio clara y estructurada.
            </Text>
<<<<<<< HEAD
>>>>>>> Stashed changes
=======
>>>>>>> efc6cb34c0e44541333d066a00a05ae89f1183d7
          </View>

          {/* Tarjeta Introductoria */}
          <ContentCard style={styles.introCard}>
            <View style={styles.iconContainer}>
              <IconSymbol name="lightbulb.fill" size={24} color={MiIdeaColors.primary} />
            </View>
            <View style={styles.introTextContainer}>
              <Text style={styles.introTitle}>Dale forma a tu idea de negocio</Text>
              <Text style={styles.introText}>
                Completa los datos principales para definir mejor tu proyecto.
              </Text>
            </View>
          </ContentCard>

          {/* Mensajes de éxito y error */}
          {successMessage ? (
            <View style={styles.successContainer}>
              <Text style={styles.successText}>{successMessage}</Text>
            </View>
          ) : null}
          {saveError ? (
            <View style={styles.errorContainer}>
              <Text style={styles.errorTextGlobal}>{saveError}</Text>
            </View>
          ) : null}

<<<<<<< HEAD
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
=======
>>>>>>> efc6cb34c0e44541333d066a00a05ae89f1183d7
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
<<<<<<< HEAD
            <PrimaryButton
              title="Guardar mi idea"
              onPress={handleSave}
=======
            <PrimaryButton 
              title="Guardar mi idea" 
              onPress={handleSave} 
>>>>>>> efc6cb34c0e44541333d066a00a05ae89f1183d7
              loading={isSaving}
            />
          </View>

        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
<<<<<<< HEAD
>>>>>>> Stashed changes
=======
>>>>>>> efc6cb34c0e44541333d066a00a05ae89f1183d7
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: MiIdeaColors.background,
  },
  keyboardAvoiding: {
    flex: 1,
  },
  scrollContent: {
    padding: 24,
    width: '100%',
    maxWidth: 820,
    alignSelf: 'center',
  },
  header: {
    marginBottom: 24,
    marginTop: Platform.OS === 'android' ? 24 : 0,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: MiIdeaColors.navy,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: MiIdeaColors.text,
    lineHeight: 24,
  },
  introCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
  },
  iconContainer: {
    backgroundColor: MiIdeaColors.primarySoft,
    padding: 12,
    borderRadius: 12,
    marginRight: 16,
  },
  introTextContainer: {
    flex: 1,
  },
<<<<<<< HEAD
<<<<<<< Updated upstream
=======
  errorContainer: {
    backgroundColor: MiIdeaColors.error + '1A',
=======
  introTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: MiIdeaColors.navy,
    marginBottom: 4,
  },
  introText: {
    fontSize: 15,
    color: MiIdeaColors.text,
    lineHeight: 22,
  },
  formContainer: {
    marginBottom: 24,
  },
  buttonContainer: {
    marginTop: 8,
    marginBottom: 24,
  },
  successContainer: {
    backgroundColor: MiIdeaColors.success + '1A', // 10% opacity
    borderColor: MiIdeaColors.success,
    borderWidth: 1,
    padding: 16,
    borderRadius: 12,
    marginBottom: 24,
  },
  successText: {
    color: MiIdeaColors.success,
    fontSize: 15,
    fontWeight: '500',
    textAlign: 'center',
  },
  errorContainer: {
    backgroundColor: MiIdeaColors.error + '1A', 
>>>>>>> efc6cb34c0e44541333d066a00a05ae89f1183d7
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
<<<<<<< HEAD
>>>>>>> Stashed changes
=======
>>>>>>> efc6cb34c0e44541333d066a00a05ae89f1183d7
});
