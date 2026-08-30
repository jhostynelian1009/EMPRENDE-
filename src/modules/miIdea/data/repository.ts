import AsyncStorage from '@react-native-async-storage/async-storage';
import { BusinessIdea } from '../domain/BusinessIdea';

const STORAGE_KEY = '@emprende_plus:idea';

export async function getBusinessIdea(): Promise<BusinessIdea | null> {
  try {
    const jsonValue = await AsyncStorage.getItem(STORAGE_KEY);
    if (!jsonValue) {
      return null;
    }
    
    const parsed = JSON.parse(jsonValue);
    
    // Validación estructural básica
    if (
      typeof parsed === 'object' &&
      parsed !== null &&
      parsed.schemaVersion === 1 &&
      typeof parsed.nombreNegocio === 'string' &&
      typeof parsed.problema === 'string' &&
      typeof parsed.solucion === 'string' &&
      typeof parsed.publicoObjetivo === 'string' &&
      typeof parsed.recursosNecesarios === 'string' &&
      typeof parsed.updatedAt === 'string'
    ) {
      return parsed as BusinessIdea;
    }
    
    return null;
  } catch {
    // Falla segura: devolvemos null y permitimos que la pantalla quede utilizable
    return null;
  }
}

export async function saveBusinessIdea(idea: BusinessIdea): Promise<void> {
  const jsonValue = JSON.stringify(idea);
  await AsyncStorage.setItem(STORAGE_KEY, jsonValue);
}
