import AsyncStorage from '@react-native-async-storage/async-storage';

export async function readJson(key: string): Promise<unknown> {
  const raw = await AsyncStorage.getItem(key);
  if (raw === null) {
    return null;
  }

  return JSON.parse(raw) as unknown;
}

export async function writeJson(key: string, value: unknown): Promise<void> {
  await AsyncStorage.setItem(key, JSON.stringify(value));
}

export async function removeJson(key: string): Promise<void> {
  await AsyncStorage.removeItem(key);
}
