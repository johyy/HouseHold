import React, { useEffect, useState } from 'react';
import { View, TextInput, StyleSheet, Pressable } from 'react-native';
import Text from './Text';
import { useParams, useNavigate } from 'react-router-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_URL_PRODUCTS } from '@env';

const styles = StyleSheet.create({
  container: {
    padding: 15,
    backgroundColor: 'white',
    borderRadius: 5,
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 10,
  },
  input: {
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 8,
    marginTop: 5,
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

const ModifyProduct = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState({ name: '', quantity: '', description: '' });

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

  const handleChange = (key, value) => {
    setProduct(prevProduct => {
      const updatedProduct = { ...prevProduct };
      updatedProduct[key] = value;
      return updatedProduct;
    });
  };


  const handleSubmit = async () => {
    try {
      const token = await AsyncStorage.getItem('accessToken');
      const response = await fetch(`${API_URL_PRODUCTS}/products/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(product),
      });

      if (!response.ok) throw new Error('Päivitys epäonnistui.');
      navigate(`/product/${id}`);

    } catch (error) {
      console.error('Error modifying product:', error.message);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Nimi:</Text>
      <TextInput style={styles.input} value={product.name} onChangeText={text => handleChange('name', text)} />

      <Text style={styles.label}>Määrä:</Text>
      <TextInput style={styles.input} keyboardType='numeric' value={String(product.quantity)} onChangeText={text => handleChange('quantity', text)} />

      <Text style={styles.label}>Selite:</Text>
      <TextInput style={styles.input} value={product.description} onChangeText={text => handleChange('description', text)} />

      <Pressable style={styles.button} onPress={handleSubmit}>
        <Text style={styles.buttonText}>Tallenna muutokset</Text>
      </Pressable>
      <Pressable style={styles.button} onPress={() => navigate(`/product/${id}`)}>
        <Text style={styles.buttonText}>Peruuta</Text>
      </Pressable>
    </View>
  );
};

export default ModifyProduct;