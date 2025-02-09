import React, { useState } from 'react';
import { View, TextInput, Pressable, StyleSheet } from 'react-native';
import Text from './Text';
import { useNavigate } from 'react-router-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_URL_PRODUCTS } from '@env';

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
    },
    buttonText: {
        color: 'white',
        fontWeight: 'bold',
    },
});

const AddCategory = () => {
    const [categoryName, setCategoryName] = useState('');
    const [description, setDescription] = useState('');
    const navigate = useNavigate();

    const handleAddCategory = async () => {
        try {
            const token = await AsyncStorage.getItem('accessToken');
            if (!token) return;

            const response = await fetch(`${API_URL_PRODUCTS}/categories`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({ name: categoryName, description }),
            });

            if (!response.ok) {
                throw new Error('Kategorian lisääminen epäonnistui');
            }

            setCategoryName('');
            setDescription('');
            navigate(-1);
        } catch (error) {
            console.error('Adding a category failed:', error.message);
        }
    };

    return (
        <View style={styles.container}>
            <TextInput
                style={styles.input}
                placeholder="Kategorian nimi"
                value={categoryName}
                onChangeText={setCategoryName}
            />
            <TextInput
                style={styles.input}
                placeholder="Selite"
                value={description}
                onChangeText={setDescription}
            />
            <Pressable style={styles.button} onPress={handleAddCategory}>
                <Text style={styles.buttonText}>Luo kategoria</Text>
            </Pressable>
        </View>
    );
};

export default AddCategory;
