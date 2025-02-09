import { useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_URL_USERS } from '@env';

const useSignUp = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const signUp = async ({ name, username, password }) => {
        try {
            setLoading(true);
            setError(null);

            const response = await fetch(`${API_URL_USERS}/users`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name, username, password }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Failed to sign up');
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

    return { signUp, loading, error };
};

export default useSignUp;

