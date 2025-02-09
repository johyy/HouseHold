import React, { useEffect, useState } from 'react';
import { View, TextInput, StyleSheet, Pressable } from 'react-native';
import Text from './Text';
import { useParams, useNavigate } from 'react-router-native';
import useAuthStorage from '../hooks/useAuthStorage';
import { API_URL_PRODUCTS } from '@env';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Picker } from '@react-native-picker/picker';

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
    },
    picker: {
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 5,
        marginBottom: 5,
        marginTop: 5,
        backgroundColor: '#f9f9f9',
    }
});

const DateInput = ({ date, setDate }) => {
    const [showPicker, setShowPicker] = useState(false);
  
    const onChange = (event, selectedDate) => {
        setShowPicker(false);
        if (selectedDate) {
            setDate(new Date(selectedDate));
        }
    };
  
    return (
        <View>
            <Pressable onPress={() => setShowPicker(true)}>
                <TextInput
                    style={styles.input}
                    placeholder="Viimeinen käyttöpäivä"
                    value={date ? new Date(date).toISOString().split('T')[0] : ''}
                    editable={false}
                />
            </Pressable>
  
            {showPicker && (
                <DateTimePicker
                    value={date instanceof Date ? date : new Date()}
                    mode="date"
                    onChange={onChange}
                />
            )}
        </View>
    );
};

const ModifyProduct = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [product, setProduct] = useState({ 
        name: '', 
        quantity: '', 
        unit: '', 
        description: '', 
        category: '', 
        location: '' 
    });
    const [locations, setLocations] = useState([]);
    const [categories, setCategories] = useState([]);
    const authStorage = useAuthStorage();

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const token = await authStorage.getAccessToken();
                if (!token) {
                    return;
                }
    
                const [locationsRes, categoriesRes] = await Promise.all([
                    fetch(`${API_URL_PRODUCTS}/locations`, { headers: { Authorization: `Bearer ${token}` } }),
                    fetch(`${API_URL_PRODUCTS}/categories`, { headers: { Authorization: `Bearer ${token}` } })
                ]);
    
                const locationsData = await locationsRes.json();
                const categoriesData = await categoriesRes.json();
    
                setLocations(locationsData);
                setCategories(categoriesData);
    
                const response = await fetch(`${API_URL_PRODUCTS}/products/${id}`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
    
                if (!response.ok) throw new Error("Virhe tuotteen haussa");
    
                const data = await response.json();
    
                const categoryMatch = categoriesData.find(c => c.name === data.category);
                const locationMatch = locationsData.find(l => l.name === data.location);
    
                setProduct({
                    ...data,
                    category: categoryMatch ? String(categoryMatch.id) : "",
                    location: locationMatch ? String(locationMatch.id) : "",
                });
    
            } catch (error) {
                console.error("Error fetching data:", error.message);
            }
        };
    
        fetchProduct();
    }, [id]);
    

    const handleChange = (key, value) => {
        setProduct(prevProduct => ({
            ...prevProduct,
            [key]: value ? String(value) : "",
        }));
    };

    const handleSubmit = async () => {
        try {
            const token = await authStorage.getAccessToken();
            if (!token) {
                return;
            }
  
            const updatedProduct = {
                name: product.name,
                description: product.description,
                quantity: String(product.quantity), 
                unit: product.unit,
                expiration_date: product.expiration_date ? new Date(product.expiration_date).toISOString() : null,
                location_id: product.location, 
                category_id: product.category, 
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
            navigate(`/product/${id}`);

        } catch (error) {
            console.error("Error modifying product:", error.message);
        }
    };
  
    return (
        <View style={styles.container}>
            <TextInput 
                style={styles.input} 
                value={product.name} 
                onChangeText={text => handleChange('name', text)} 
            />
            <TextInput 
                style={styles.input} 
                keyboardType='numeric' 
                value={String(product.quantity)} 
                onChangeText={text => handleChange('quantity', text)} 
            />
            <TextInput 
                style={styles.input} 
                value={product.description} 
                onChangeText={text => handleChange('description', text)} 
            />
            <View style={styles.picker}>
                <Picker 
                    selectedValue={product.unit} 
                    onValueChange={(itemValue) => handleChange('unit', itemValue)}
                >
                    <Picker.Item label="kpl" value="kpl" />
                    <Picker.Item label="rulla" value="rulla" />
                    <Picker.Item label="litra" value="litra" />
                    <Picker.Item label="kg" value="kg" />
                    <Picker.Item label="paketti" value="paketti" />
                    <Picker.Item label="pussi" value="pussi" />
                    <Picker.Item label="pieni" value="pieni" />
                    <Picker.Item label="keskikokoinen" value="keskikokoinen" />
                    <Picker.Item label="suuri" value="suuri" />
                </Picker>
            </View>
            <DateInput 
                date={product.expiration_date} 
                setDate={date => handleChange('expiration_date', date)} 
            />

            <View style={styles.picker}>
                {locations.length > 0 && (
                    <Picker
                        selectedValue={product.location}
                        onValueChange={(itemValue) => handleChange('location', itemValue)}
                    >
                        {locations.map((l) => (
                            <Picker.Item key={l.id} label={l.name} value={String(l.id)} />
                        ))}
                    </Picker>
                )}
            </View>

            <View style={styles.picker}>
                {categories.length > 0 && (
                    <Picker
                        selectedValue={product.category}
                        onValueChange={(itemValue) => handleChange('category', itemValue)}
                    >
                        {categories.map((c) => (
                            <Picker.Item key={c.id} label={c.name} value={String(c.id)} />
                        ))}
                    </Picker>
                )}
            </View>

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