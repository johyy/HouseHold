import React, { useState, useEffect } from 'react';
import { FlatList, View, StyleSheet, Pressable, TextInput } from 'react-native';
import Text from './Text';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigate } from 'react-router-native';
import { API_URL_PRODUCTS } from '@env';
import { Picker } from '@react-native-picker/picker';

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
  container: {
    padding: 10,
    backgroundColor: 'white',
    flex: 1,
  },
  searchInput: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    marginBottom: 10,
    borderRadius: 5,
    backgroundColor: '#f9f9f9',
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    marginBottom: 10,
    backgroundColor: '#f9f9f9',
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
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [locations, setLocations] = useState([]);
  const [selectedLocation, setSelectedLocation] = useState('');
  const [sortBy, setSortBy] = useState('name'); 
  const [sortOrder, setSortOrder] = useState('asc');
  const [filterVisible, setFilterVisible] = useState(false);
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
        throw new Error('Tavaroiden haku epäonnistui.');
      }
  
      const data = await response.json();
      setProducts(data);
      setFilteredProducts(data);
    } catch (error) {
      console.error('Error fetching products:', error.message);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const token = await AsyncStorage.getItem('accessToken');
  
      if (!token) {
        return;
      }

      const response = await fetch(`${API_URL_PRODUCTS}/categories`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Kategorioiden haku epäonnistui.');
      }

      const categoriesData = await response.json();
      setCategories(categoriesData);
    } catch (error) {
      console.error('Error fetching categories:', error.message);
    }
  };

  const fetchLocations = async () => {
    try {
      const token = await AsyncStorage.getItem('accessToken');
  
      if (!token) {
        return;
      }

      const response = await fetch(`${API_URL_PRODUCTS}/locations`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Sijaintien haku epäonnistui.');
      }

      const locationsData = await response.json();
      setLocations(locationsData);
    } catch (error) {
      console.log('Error fetching locations:', error.message);
    }
  }

  useEffect(() => {
    fetchProducts();
    fetchCategories();
    fetchLocations();
  }, []);
  
  useEffect(() => {
    filterProducts();
  }, [searchQuery, selectedCategory, selectedLocation, products, sortBy, sortOrder])

  const filterProducts = () => {
    let filtered = products;

    if (searchQuery) {
      filtered = filtered.filter((product) => 
        product.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (selectedCategory) {
      filtered = filtered.filter((product) => product.category_id === selectedCategory);
    }

    if (selectedLocation) {
      filtered = filtered.filter((product) => product.location_id === selectedLocation);
    }

    filtered.sort((a, b) => {
      let valueA = a[sortBy]
      let valueB = b[sortBy]

      if (sortBy === 'created_at' || sortBy === 'expiration_date') {
        valueA = new Date(valueA);
        valueB = new Date(valueB);
      }

      if (valueA > valueB) {
        return sortOrder === 'asc' ? -1 : 1;
      }
      
      if (valueA < valueB) {
        return sortOrder === 'asc' ? 1 : -1;
      }

      return 0;

    });

    setFilteredProducts(filtered);
  };

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
    <View style={styles.container}>

      <Pressable
        onPress={() => setFilterVisible(!filterVisible)}
        style={{ flexDirection: 'row', marginBottom: 10 }}
      >
        <Text fontWeight="bold" fontSize="subheading">
          Muokkaa hakuehtoja
        </Text>
        <Text fontSize="subheading">
          {filterVisible ? " ▲" : " ▼"}
        </Text>
      </Pressable>
  

      {filterVisible && (
        <View>
          <TextInput
            style={styles.searchInput}
            placeholder="Hae tuotteita..."
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
  
          <View style={styles.pickerContainer}>
            <Picker
              selectedValue={selectedCategory}
              onValueChange={(itemValue) => setSelectedCategory(itemValue)}
            >
              <Picker.Item label="Kaikki kategoriat" value="" />
              {categories.map((c) => (
                <Picker.Item key={c.id} label={c.name} value={c.id} />
              ))}
            </Picker>
          </View>
  
          <View style={styles.pickerContainer}>
            <Picker
              selectedValue={selectedLocation}
              onValueChange={(itemValue) => setSelectedLocation(itemValue)}
            >
              <Picker.Item label="Kaikki sijainnit" value="" />
              {locations.map((l) => (
                <Picker.Item key={l.id} label={l.name} value={l.id} />
              ))}
            </Picker>
          </View>
  
          <View style={styles.pickerContainer}>
            <Picker
              selectedValue={sortBy}
              onValueChange={(itemValue) => setSortBy(itemValue)}
            >
              <Picker.Item label="Lajittele nimen mukaan" value="name" />
              <Picker.Item label="Lajittele lisäyspäivän mukaan" value="created_date" />
              <Picker.Item label="Lajittele vanhenemisen mukaan" value="expiration_date" />
            </Picker>
          </View>
  
          <View style={styles.pickerContainer}>
            <Picker
              selectedValue={sortOrder}
              onValueChange={(itemValue) => setSortOrder(itemValue)}
            >
              <Picker.Item label="Nouseva järjestys" value="asc" />
              <Picker.Item label="Laskeva järjestys" value="desc" />
            </Picker>
          </View>
        </View>
      )}
  
      <FlatList
        data={filteredProducts}
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
    </View>
  );
}  

export default ProductList;
