import React, { useState } from "react";
import { View, TextInput, Pressable } from "react-native";
import Text from "./Text";
import { useNavigate } from "react-router-native";
import useAuthStorage from "../hooks/useAuthStorage";
import { API_URL_PRODUCTS } from "@env";
import styles from "../utils/styles";

const AddCategory = () => {
  const [categoryName, setCategoryName] = useState("");
  const [description, setDescription] = useState("");
  const navigate = useNavigate();
  const authStorage = useAuthStorage();

  const handleAddCategory = async () => {
    try {
      const token = await authStorage.getAccessToken();
      if (!token) {
        return;
      }

      const response = await fetch(`${API_URL_PRODUCTS}/categories`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ name: categoryName, description }),
      });

      if (!response.ok) {
        throw new Error("Kategorian lisääminen epäonnistui");
      }

      setCategoryName("");
      setDescription("");
      navigate(-1);
    } catch (error) {
      console.error("Adding a category failed:", error.message);
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
