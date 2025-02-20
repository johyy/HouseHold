import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Pressable, Modal, Alert, TextInput } from 'react-native';
import { useParams, useNavigate } from 'react-router-native';
import useAuthStorage from '../hooks/useAuthStorage';
import { API_URL_PRODUCTS } from '@env';

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
    },
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0,0,0,0.5)',
    },
    modalContent: {
        backgroundColor: 'white',
        padding: 20,
        borderRadius: 10,
        width: 300,
        alignItems: 'center',
    },
    input: {
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 5,
        padding: 8,
        width: '100%',
        marginTop: 10,
        textAlign: 'center',
        fontSize: 16,
    }
});

const ProductDetailsMissingProducts = () => {
    const { id } = useParams();
    const [product, setProduct] = useState(null);
    const navigate = useNavigate();
    const authStorage = useAuthStorage();
    const [modalVisible, setModalVisible] = useState(false);
    const [quantity, setQuantity] = useState('');

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

    const handleInsert = () => {
        setModalVisible(true);
    }

    const confirmInsert = async () => {
        try {
            const token = await authStorage.getAccessToken();
            if (!token) {
                return;
            }

            const updatedProduct = {
                quantity: quantity
            };

            const response = await fetch(`${API_URL_PRODUCTS}/products/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(updatedProduct),
            });

              
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(`Päivitys epäonnistui: ${JSON.stringify(errorData)}`);
            }

            setModalVisible(false);
            Alert.alert("Ilmoitus", "Siirretty takaisin tavaralistaukseen");
            navigate(`/product/${id}`);
        } catch (error) {
            console.error("Error updating product:", error.message);
        }
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
  
            <Pressable style={styles.button} onPress={() => handleInsert()}>
                <Text style={styles.buttonText}>Merkitse ostetuksi</Text>
            </Pressable>
            <Pressable style={styles.button} onPress={() => navigate(`/modifymissingproduct/${product.id}`)}>
                <Text style={styles.buttonText}>Muokkaa tavaraa</Text>
            </Pressable>
            <Pressable style={styles.button} onPress={() => handleDeletion()}>
                <Text style={styles.buttonText}>Poista tavara</Text>
            </Pressable>
            <Modal transparent={true} visible={modalVisible}>
                <View style={styles.modalContainer}>
                    <View style={styles.modalContent}>
                        <Text style={styles.title}>Syötä ostettu määrä</Text>
                        <TextInput
                            style={styles.input}
                            keyboardType="numeric"
                            placeholder="Määrä"
                            value={quantity}
                            onChangeText={setQuantity}
                        />
                        <Pressable style={styles.button} onPress={confirmInsert}>
                            <Text style={styles.buttonText}>Vahvista</Text>
                        </Pressable>
                        <Pressable style={[styles.button, { backgroundColor: 'gray' }]} onPress={() => setModalVisible(false)}>
                            <Text style={styles.buttonText}>Peruuta</Text>
                        </Pressable>
                    </View>
                </View>
            </Modal>
        </View>
    );
};

export default ProductDetailsMissingProducts;
