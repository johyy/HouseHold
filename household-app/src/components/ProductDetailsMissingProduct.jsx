import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { useParams, useNavigate } from 'react-router-native';
import useAuthStorage from '../hooks/useAuthStorage';
import { API_URL_PRODUCTS } from '@env';
import { Alert } from 'react-native';

const styles = StyleSheet.create({
    container: {
        padding: 15,
        backgroundColor: 'white',
        borderRadius: 5,
    },
    title: { 
        fontSize: 20, 
        fontWeight: 'bold' 
    },
    text: { 
        fontSize: 16, 
        marginTop: 10 
    },
    button: {
        marginTop: 20,
        padding: 10,
        backgroundColor: '#2E5894',
        borderRadius: 5,
        alignSelf: 'flex-start'
    },
    buttonText: {
        color: 'white',
        fontWeight: 'bold',
        fontSize: 16,
    }
});

const ProductDetailsMissingProducts = () => {
    const { id } = useParams();
    const [product, setProduct] = useState(null);
    const navigate = useNavigate();
    const authStorage = useAuthStorage();

    useEffect(() => {
        const fetchProduct = async () => {
            const token = await authStorage.getAccessToken();
            const response = await fetch(`${API_URL_PRODUCTS}/products/${id}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            const data = await response.json();
            setProduct(data);
        };

        fetchProduct();
    }, [id]);

    if (!product) {
        return (
            <View style={styles.loading}>
                <Text>  Ladataan tavaran tietoja...</Text>
            </View>
        );
    }

    const handleDeletion = async () => {
        Alert.alert(
            "Vahvista poisto",
            `Haluatko varmasti poistaa tavaran "${product.name}?"`,
            [
                {
                    text: "Peruuta",
                    style: "cancel",
                },
                {
                    text: "Kyllä",
                    onPress: async () => {
                        try {
                            const token = await authStorage.getAccessToken();
                            if (!token) {
                                return;
                            }
  
                            const response = await fetch(`${API_URL_PRODUCTS}/products/${id}`, {
                                method: 'DELETE',
                                headers: {
                                    Authorization: `Bearer ${token}`,
                                },
                            });
  
                            if (!response.ok) {
                                const errorData = await response.json();
                                throw new Error(`Poisto epäonnistui: ${JSON.stringify(errorData)}`);
                            }
                            navigate('/');
  
                        } catch (error) {
                            console.error("Error deleting product:", error.message);
                        }
                    },
                },
            ]
        );
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>
                {product.name} LOPPUNUT
            </Text>
            <Text style={styles.text}>
                {product.description 
                    ? 'Selite: ' + product.description 
                    : ''}
            </Text>
            <Text style={styles.text}>Kategoria: {product.category}</Text>
            <Text style={styles.text}>Entinen sijainti: {product.location}</Text>
  
            <Pressable style={styles.button} onPress={() => navigate(`/modifymissingproduct/${product.id}`)}>
                <Text style={styles.buttonText}>Muokkaa tavaraa</Text>
            </Pressable>
            <Pressable style={styles.button} onPress={() => handleDeletion()}>
                <Text style={styles.buttonText}>Poista tavara</Text>
            </Pressable>

        </View>
    );
};

export default ProductDetailsMissingProducts;
