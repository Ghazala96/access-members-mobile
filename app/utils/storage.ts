import * as SecureStore from 'expo-secure-store';

export const saveToken = async (key: string, value: string) => {
  try {
    await SecureStore.setItemAsync(key, value);
  } catch (error) {
    console.error(`Error saving ${key}:`, error);
  }
};

export const getToken = async (key: string): Promise<string | null> => {
  try {
    return await SecureStore.getItemAsync(key);
  } catch (error) {
    console.error(`Error retrieving ${key}:`, error);
    return null;
  }
};

export const removeToken = async (key: string) => {
  try {
    await SecureStore.deleteItemAsync(key);
  } catch (error) {
    console.error(`Error deleting ${key}:`, error);
  }
};

export const clearAuthTokens = async () => {
  await removeToken('accessToken');
  await removeToken('refreshToken');
};
