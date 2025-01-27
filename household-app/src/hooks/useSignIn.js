import { useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_URL } from '@env';

const useSignIn = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const signIn = async ({ username, password }) => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch(`${API_URL}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to sign in');
      }

      const { token } = await response.json();
      await AsyncStorage.setItem('accessToken', token);

      return token;
    } catch (e) {
      setError(e.message);
      throw e;
    } finally {
      setLoading(false);
    }
  };

  return { signIn, loading, error };
};

export default useSignIn;
