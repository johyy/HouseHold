import React, { useState, useEffect } from 'react';
import { FlatList, View, StyleSheet, Text, Pressable } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigate } from 'react-router-native';
import { API_URL_PRODUCTS } from '@env';

const styles = StyleSheet.create({
  separator: {
    height: 10,
  },
  itemContainer: {
    padding: 15,
    backgroundColor: 'white',
    borderRadius: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.3,
    shadowRadius: 2,
    elevation: 2,
  },
  name: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  errorText: {
    color: 'red',
    textAlign: 'center',
    marginTop: 20,
  },
  loading: {
    marginTop: 20,
    alignItems: 'center',
  },
  emptyText: {
    textAlign: 'center',
    marginTop: 20,
    fontSize: 16,
    color: 'gray',
  },
});

const ItemSeparator = () => <View style={styles.separator} />;

const ProductItem = ({ item, onPress }) => (
  <Pressable onPress={() => onPress(item.id)}>
    <View style={styles.itemContainer}>
      <Text style={styles.name}>{item.name}</Text>
    </View>
  </Pressable>
);

const ProductList = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const fetchProducts = async () => {
    try {
      setLoading(true);
      setError(null); 
  
      const token = await AsyncStorage.getItem('accessToken');
  
      if (!token) {
        return;
      }
  
      const response = await fetch(`${API_URL_PRODUCTS}/products`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });
  
      if (!response.ok) {
        throw new Error('Fetiching products failed.');
      }
  
      const data = await response.json();
      setProducts(data);
    } catch (error) {
      console.error('Error fetching products:', error.message);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };
  

  useEffect(() => {
    fetchProducts();
  }, []);

  if (loading) {
    return (
      <View style={styles.loading}>
        <Text>Ladataan tavaroita...</Text>
      </View>
    );

  }

  if (error) {
    return <Text style={styles.errorText}>{error}</Text>;
  }

  return (
    <FlatList
      data={products}
      ItemSeparatorComponent={ItemSeparator}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => (
        <ProductItem
          item={item}
          onPress={(id) => navigate(`/product/${id}`)}
        />
      )}
      ListEmptyComponent={<Text style={styles.emptyText}>Ei vielä lisättyjä tavaroita</Text>}
      contentContainerStyle={{ paddingBottom: 45 }}
    />
  );
};

export default ProductList;
