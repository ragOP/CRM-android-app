import AsyncStorage from '@react-native-async-storage/async-storage';

export const setItem = async (payload: Record<string, any>) => {
  try {
    if (Object.keys(payload).length > 0) {
      const keys = Object.keys(payload);
      for (let i = 0; i < keys.length; i++) {
        await AsyncStorage.setItem(keys[i], JSON.stringify(payload[keys[i]]));
      }
    }
  } catch (error) {
    console.error('Error setting item:', error);
  }
};

export const getItem = async (key: string) => {
  try {
    const value = await AsyncStorage.getItem(key);
    return value != null ? JSON.parse(value) : null;
  } catch (error) {
    console.error('Error getting item:', error);
    return null;
  }
};

export const removeItem = async (key: string) => {
  try {
    await AsyncStorage.removeItem(key);
  } catch (error) {
    console.error('Error removing item:', error);
  }
};
