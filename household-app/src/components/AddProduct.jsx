import React, { useState, useEffect } from 'react';
import { View, TextInput, Pressable, StyleSheet } from 'react-native';
import { Picker } from '@react-native-picker/picker';
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
  picker: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    marginBottom: 15,
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
  createButton: {
    marginBottom: 15,
    alignSelf: 'flex-end',
  },
  createButtonText: {
    color: '#2E5894',
    fontWeight: 'bold',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

const AddProduct = () => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [quantity, setQuantity] = useState('');
  const [locations, setLocations] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedLocation, setSelectedLocation] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const fetchLocationsAndCategories = async () => {
    try {
      const token = await AsyncStorage.getItem('accessToken');
      if (!token) return;

      const [locationResponse, categoryResponse] = await Promise.all([
        fetch(`${API_URL_PRODUCTS}/locations`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
        fetch(`${API_URL_PRODUCTS}/categories`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
      ]);

      if (!locationResponse.ok || !categoryResponse.ok) {
        throw new Error('Error fetching information');
      }

      const locationsData = await locationResponse.json();
      const categoriesData = await categoryResponse.json();

      setLocations(locationsData);
      setCategories(categoriesData);
    } catch (error) {
      console.error('Error fetching locations or categories:', error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLocationsAndCategories();
  }, []);

  const handleAddProduct = async () => {
    try {
      const token = await AsyncStorage.getItem('accessToken');
      if (!token) {
        return;
      }

      const response = await fetch(`${API_URL_PRODUCTS}/products`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ name, description, quantity, unit: "kpl", location_id: selectedLocation, category_id: selectedCategory }),
      });

      if (!response.ok) {
        throw new Error('Adding a product failed');
      }

      setName('');
      setDescription('');
      setSelectedLocation('');
      setSelectedCategory('');
      navigate('/');
    } catch (error) {
      console.log('Adding a product failed:', error.message);
    }
  };

  const handleCreateLocation = () => navigate('/');
  const handleCreateCategory = () => navigate('/');

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <Text>Ladataan tietoja...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Tuotteen nimi"
        value={name}
        onChangeText={setName}
      />
      <TextInput
        style={styles.input}
        placeholder="Tuotteen kuvaus"
        value={description}
        onChangeText={setDescription}
      />
      <TextInput
        style={styles.input}
        placeholder="Määrä"
        value={quantity}
        onChangeText={setQuantity}
      />
      <View style={styles.picker}>
        <Picker
          selectedValue={selectedLocation}
          onValueChange={(itemValue) => setSelectedLocation(itemValue)}
        >
          <Picker.Item label="Valitse sijainti" value="" />
          {locations.map((l) => (
            <Picker.Item key={l.id} label={l.name} value={l.id} />
          ))}
        </Picker>
      </View>
      <Pressable style={styles.createButton} onPress={handleCreateLocation}>
        <Text style={styles.createButtonText}>+ Luo uusi sijainti</Text>
      </Pressable>
      <View style={styles.picker}>
        <Picker
          selectedValue={selectedCategory}
          onValueChange={(itemValue) => setSelectedCategory(itemValue)}
        >
          <Picker.Item label="Valitse kategoria" value="" />
          {categories.map((c) => (
            <Picker.Item key={c.id} label={c.name} value={c.id} />
          ))}
        </Picker>
      </View>
      <Pressable style={styles.createButton} onPress={handleCreateCategory}>
        <Text style={styles.createButtonText}>+ Luo uusi kategoria</Text>
      </Pressable>
      <Pressable style={styles.button} onPress={handleAddProduct}>
        <Text style={styles.buttonText}>Lisää tavara</Text>
      </Pressable>
    </View>
  );
};

export default AddProduct;
