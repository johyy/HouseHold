import React, { useState } from 'react';
import { View, TextInput, Pressable, StyleSheet } from 'react-native';
import Text from './Text';
import { useNavigate } from 'react-router-native';
import useAuthStorage from '../hooks/useAuthStorage';
import { API_URL_USERS } from '@env';

const styles = StyleSheet.create({
    container: {
        padding: 15,
        backgroundColor: 'white',
        flex: 1,
    },
    input: {
        borderWidth: 1,
        borderColor: '#ccc',
        padding: 10,
        marginBottom: 15,
        borderRadius: 5,
        backgroundColor: '#f9f9f9',
    },
    button: {
        backgroundColor: '#2E5894',
        padding: 15,
        alignItems: 'center',
        borderRadius: 5,
        marginTop: 20,
    },
    buttonText: {
        color: 'white',
        fontWeight: 'bold',
    }
});

const AddPreferences = () => {
    const [clothingSizes, setClothingSizes] = useState('');
    const [cosmeticPreferences, setCosmeticPreferences] = useState('');
    const [notes, setNotes] = useState('');
    const navigate = useNavigate();
    const authStorage = useAuthStorage();

    const handleSavePreferences = async () => {
        try {
            const token = await authStorage.getAccessToken();
            if (!token) {
                return;
            }

            const response = await fetch(`${API_URL_USERS}/preferences`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({ 
                    clothing_sizes: clothingSizes, 
                    cosmetic_preferences: cosmeticPreferences, 
                    notes: notes
                }),
            });

            if (!response.ok) {
                throw new Error('Preferenssien tallennus epäonnistui');
            }

            navigate('/preferences');
        } catch (error) {
            console.error('Error saving preferences:', error.message);
        }
    };

    return (
        <View style={styles.container}>
            
            <TextInput
                style={styles.input}
                placeholder="Vaatteiden koot"
                value={clothingSizes}
                onChangeText={setClothingSizes}
            />
            <TextInput
                style={styles.input}
                placeholder="Kosmetiikkamieltymykset"
                value={cosmeticPreferences}
                onChangeText={setCosmeticPreferences}
            />
            <TextInput
                style={styles.input}
                placeholder="Muistiinpanot"
                value={notes}
                onChangeText={setNotes}
                multiline
            />

            <Pressable style={styles.button} onPress={handleSavePreferences}>
                <Text style={styles.buttonText}>Tallenna preferenssit</Text>
            </Pressable>
        </View>
    );
};

export default AddPreferences;
