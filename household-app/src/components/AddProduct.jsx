import React, { useState, useEffect } from "react";
import { View, TextInput, Pressable } from "react-native";
import { Picker } from "@react-native-picker/picker";
import Text from "./Text";
import { useNavigate } from "react-router-native";
import useAuthStorage from "../hooks/useAuthStorage";
import { API_URL_PRODUCTS } from "@env";
import DateTimePicker from "@react-native-community/datetimepicker";
import styles from "../utils/styles";

const AddProduct = () => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [quantity, setQuantity] = useState("");
  const [locations, setLocations] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedLocation, setSelectedLocation] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [loading, setLoading] = useState(true);
  const [expirationDate, setExpirationDate] = useState(null);
  const [unit, setUnit] = useState("kpl");
  const navigate = useNavigate();
  const authStorage = useAuthStorage();

  const DateInput = ({ date, setDate }) => {
    const [showPicker, setShowPicker] = useState(false);

    const onChange = (event, selectedDate) => {
      setShowPicker(false);
      if (selectedDate) {
        setDate(selectedDate);
      }
    };

    return (
      <View>
        <Pressable onPress={() => setShowPicker(true)}>
          <TextInput
            style={styles.input}
            placeholder="Viimeinen käyttöpäivä"
            value={date ? date.toISOString().split("T")[0] : ""}
            editable={false}
          />
        </Pressable>

        {showPicker && (
          <DateTimePicker
            value={date || new Date()}
            mode="date"
            onChange={onChange}
          />
        )}
      </View>
    );
  };

  const fetchLocationsAndCategories = async () => {
    try {
      const token = await authStorage.getAccessToken();
      if (!token) {
        return;
      }

      const [locationResponse, categoryResponse] = await Promise.all([
        fetch(`${API_URL_PRODUCTS}/locations`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
        fetch(`${API_URL_PRODUCTS}/categories`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
      ]);

      if (!locationResponse.ok || !categoryResponse.ok) {
        throw new Error("Error fetching information");
      }

      const locationsData = await locationResponse.json();
      const categoriesData = await categoryResponse.json();

      setLocations(locationsData);
      setCategories(categoriesData);
    } catch (error) {
      console.error("Error fetching locations or categories:", error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLocationsAndCategories();
  }, []);

  const handleAddProduct = async () => {
    try {
      const token = await authStorage.getAccessToken();
      if (!token) {
        return;
      }

      const response = await fetch(`${API_URL_PRODUCTS}/products`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          name,
          description,
          quantity,
          unit,
          location_id: selectedLocation,
          category_id: selectedCategory,
          expiration_date: expirationDate,
        }),
      });

      if (!response.ok) {
        throw new Error("Tavaran lisääminen epäonnistui");
      }

      setName("");
      setDescription("");
      setUnit("kpl");
      setSelectedLocation("");
      setSelectedCategory("");
      setExpirationDate(null);
      navigate("/");
    } catch (error) {
      console.log("Adding a product failed:", error.message);
    }
  };

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
        keyboardType="numeric"
      />
      <View style={styles.picker}>
        <Picker
          selectedValue={unit}
          onValueChange={(itemValue) => setUnit(itemValue)}
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
      <DateInput date={expirationDate} setDate={setExpirationDate} />
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
      <Pressable
        style={styles.createButton}
        onPress={() => navigate("/addlocation")}
      >
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
      <Pressable
        style={styles.createButton}
        onPress={() => navigate("/addcategory")}
      >
        <Text style={styles.createButtonText}>+ Luo uusi kategoria</Text>
      </Pressable>
      <Pressable style={styles.button} onPress={handleAddProduct}>
        <Text style={styles.buttonText}>Lisää tavara</Text>
      </Pressable>
    </View>
  );
};

export default AddProduct;
