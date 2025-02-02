import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { useParams, useNavigate } from 'react-router-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
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
  backButton: {
    marginTop: 20,
    padding: 10,
    backgroundColor: '#2E5894',
    borderRadius: 5,
    alignSelf: 'flex-start'
  },
  backButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
});

const ProductDetails = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProduct = async () => {
      const token = await AsyncStorage.getItem('accessToken');
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

  return (
    <View style={styles.container}>
      <Text style={styles.title}>
        {product.name} {product.quantity} {['rulla', 'litra', 'pussi'].includes(product.unit) && product.quantity > 1 ? `${product.unit}a` : product.unit}
      </Text>
      <Text style={styles.text}>
        {product.description 
        ? 'Selite: ' + product.description 
        : ''}
      </Text>
      <Text style={styles.text}>Kategoria: {product.category}</Text>
      <Text style={styles.text}>Sijainti: {product.location}</Text>
      <Text style={styles.text}>
        {product.expiration_date 
        ? `Viimeinen käyttöpäivä: ${new Date(product.expiration_date).toLocaleDateString('fi-FI')}` 
        : ''}
      </Text>
  
      <Pressable style={styles.backButton} onPress={() => navigate('/')}>
        <Text style={styles.backButtonText}>⇦ Takaisin tavaroihin</Text>
      </Pressable>
    </View>
  );
};

export default ProductDetails;
