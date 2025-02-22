import React from 'react';
import { View, StyleSheet, Alert, Pressable } from 'react-native';
import Text from './Text';
import { useNavigate } from 'react-router-native';
import useAuthStorage from '../hooks/useAuthStorage';
import { API_URL_USERS } from '@env';

const styles = StyleSheet.create({
    container: {
        padding: 15,
        backgroundColor: 'white',
        flex: 1
    },
    deleteButton: {
        backgroundColor: 'red',
        padding: 15,
        borderRadius: 5,
    },
    buttonText: {
        color: 'white',
        fontWeight: 'bold',
        fontSize: 16,
    }
});

const Settings = () => {
    const navigate = useNavigate();
    const authStorage = useAuthStorage();

    const handleDeleteAccount = async () => {
        Alert.alert(
            "Poista käyttäjätili",
            "Haluatko varmasti poistaa käyttäjätilisi? Tätä toimintoa ei voi peruuttaa.",
            [
                { text: "Peruuta", style: "cancel" },
                { 
                    text: "OK", 
                    style: "destructive", 
                    onPress: async () => {
                        try {
                            const token = await authStorage.getAccessToken();
                            if (!token) {
                                return;
                            }

                            const userResponse = await fetch(`${API_URL_USERS}/users/me`, {
                                headers: { Authorization: `Bearer ${token}` }
                            });

                            const userData = await userResponse.json();
                            const userId = userData.id;

                            const deleteResponse = await fetch(`${API_URL_USERS}/users/${userId}`, {
                                method: 'DELETE',
                                headers: { Authorization: `Bearer ${token}` }
                            });

                            if (!deleteResponse.ok) {
                                throw new Error('Käyttäjän poistaminen epäonnistui');
                            }

                            await authStorage.removeAccessToken();
                            navigate('/login');
                        } catch (error) {
                            console.error("Error while deleting a user:", error.message);
                        }
                    }
                }
            ]
        );
    };

    return (
        <View style={styles.container}>
            <Pressable style={styles.deleteButton} onPress={handleDeleteAccount}>
                <Text style={styles.buttonText}>Poista käyttäjätili</Text>
            </Pressable>
        </View>
    );
}

export default Settings;
