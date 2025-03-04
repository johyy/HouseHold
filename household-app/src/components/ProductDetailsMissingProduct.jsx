import React, { useEffect, useState } from "react";
import { View, Pressable, Modal, Alert, TextInput } from "react-native";
import Text from "./Text";
import { useParams, useNavigate } from "react-router-native";
import useAuthStorage from "../hooks/useAuthStorage";
import { API_URL_PRODUCTS } from "@env";
import styles from "../utils/styles";

const ProductDetailsMissingProducts = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const navigate = useNavigate();
  const authStorage = useAuthStorage();
  const [modalVisible, setModalVisible] = useState(false);
  const [quantity, setQuantity] = useState("");

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
        <Text> Ladataan tavaran tietoja...</Text>
      </View>
    );
  }

  const handleInsert = () => {
    setModalVisible(true);
  };

  const confirmInsert = async () => {
    try {
      const token = await authStorage.getAccessToken();
      if (!token) {
        return;
      }

      const updatedProduct = {
        quantity: quantity,
      };

      const response = await fetch(`${API_URL_PRODUCTS}/products/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
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
  };

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

              const response = await fetch(
                `${API_URL_PRODUCTS}/products/${id}`,
                {
                  method: "DELETE",
                  headers: {
                    Authorization: `Bearer ${token}`,
                  },
                },
              );

              if (!response.ok) {
                const errorData = await response.json();
                throw new Error(
                  `Poisto epäonnistui: ${JSON.stringify(errorData)}`,
                );
              }
              navigate("/");
            } catch (error) {
              console.error("Error deleting product:", error.message);
            }
          },
        },
      ],
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.detailsTitle}>{product.name} LOPPUNUT</Text>
      <Text style={styles.text}>
        {product.description ? "Selite: " + product.description : ""}
      </Text>
      <Text style={styles.text}>Kategoria: {product.category}</Text>
      <Text style={styles.text}>Entinen sijainti: {product.location}</Text>

      <Pressable style={styles.detailsButton} onPress={() => handleInsert()}>
        <Text style={styles.buttonText}>Merkitse ostetuksi</Text>
      </Pressable>
      <Pressable
        style={styles.detailsButton}
        onPress={() => navigate(`/modifymissingproduct/${product.id}`)}
      >
        <Text style={styles.buttonText}>Muokkaa tavaraa</Text>
      </Pressable>
      <Pressable style={styles.detailsButton} onPress={() => handleDeletion()}>
        <Text style={styles.buttonText}>Poista tavara</Text>
      </Pressable>
      <Modal transparent={true} visible={modalVisible}>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.title}>Syötä ostettu määrä</Text>
            <TextInput
              style={styles.missingProductInput}
              keyboardType="numeric"
              placeholder="Määrä"
              value={quantity}
              onChangeText={setQuantity}
            />
            <View style={styles.modalButtonContainer}>
              <Pressable
                style={[styles.modalButton, { backgroundColor: "#2E5894" }]}
                onPress={confirmInsert}
              >
                <Text style={styles.buttonText}>Vahvista</Text>
              </Pressable>
              <Pressable
                style={[styles.modalButton, { backgroundColor: "gray" }]}
                onPress={() => setModalVisible(false)}
              >
                <Text style={styles.buttonText}>Peruuta</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default ProductDetailsMissingProducts;
