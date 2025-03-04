import React, { useState } from "react";
import { View, TextInput, Pressable } from "react-native";
import Text from "./Text";
import { useNavigate } from "react-router-native";
import useAuthStorage from "../hooks/useAuthStorage";
import { API_URL_PRODUCTS } from "@env";
import styles from "../utils/styles";

const AddLocation = () => {
  const [locationName, setLocationName] = useState("");
  const [description, setDescription] = useState("");
  const navigate = useNavigate();
  const authStorage = useAuthStorage();

  const handleAddLocation = async () => {
    try {
      const token = await authStorage.getAccessToken();
      if (!token) {
        return;
      }

      const response = await fetch(`${API_URL_PRODUCTS}/locations`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ name: locationName, description }),
      });

      if (!response.ok) {
        throw new Error("Sijainnin lisääminen epäonnistui");
      }

      setLocationName("");
      setDescription("");
      navigate(-1);
    } catch (error) {
      console.error("Adding a location failed:", error.message);
    }
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Sijainnin nimi"
        value={locationName}
        onChangeText={setLocationName}
      />
      <TextInput
        style={styles.input}
        placeholder="Selite"
        value={description}
        onChangeText={setDescription}
      />
      <Pressable style={styles.button} onPress={handleAddLocation}>
        <Text style={styles.buttonText}>Luo sijainti</Text>
      </Pressable>
    </View>
  );
};

export default AddLocation;
