import * as SecureStore from 'expo-secure-store';

const TOKEN_KEY = 'univibe_token';

export const tokenStorage = {
  async get() {
    return SecureStore.getItemAsync(TOKEN_KEY);
  },
  async set(token: string) {
    await SecureStore.setItemAsync(TOKEN_KEY, token);
  },
  async remove() {
    await SecureStore.deleteItemAsync(TOKEN_KEY);
  }
};

export const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));
