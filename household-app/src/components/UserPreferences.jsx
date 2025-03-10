import React, { useEffect, useState } from "react";
import { View, Pressable } from "react-native";
import Text from "./Text";
import { useNavigate } from "react-router-native";
import useAuthStorage from "../hooks/useAuthStorage";
import { API_URL_USERS } from "@env";
import styles from "../utils/styles";

const UserPreferences = () => {
  const [user, setUser] = useState(null);
  const [preferences, setPreferences] = useState(null);
  const authStorage = useAuthStorage();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = await authStorage.getAccessToken();
        if (!token) {
          return;
        }

        const response = await fetch(`${API_URL_USERS}/users/me`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!response.ok) {
          throw new Error("User data fetch failed");
        }

        const userData = await response.json();
        setUser(userData);
      } catch (error) {
        console.error("Error fetching user:", error.message);
      }
    };
    fetchUser();
  }, []);

  useEffect(() => {
    const fetchPreferences = async () => {
      try {
        const token = await authStorage.getAccessToken();
        if (!token) {
          return;
        }

        const response = await fetch(`${API_URL_USERS}/preferences`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (response.status === 404) {
          setPreferences(null);
          return;
        }

        if (!response.ok) {
          throw new Error("Preferences fetch failed");
        }

        const data = await response.json();

        if (data.length === 0) {
          setPreferences(null);
          return;
        }

        setPreferences(data[0]);
      } catch (error) {
        console.error("Error fetching user preferences:", error.message);
      }
    };

    fetchPreferences();
  }, []);

  if (!user) {
    return (
      <View style={styles.container}>
        <Text>Ladataan käyttäjätietoja...</Text>
      </View>
    );
  }

  if (!preferences) {
    return (
      <View style={styles.container}>
        <Text style={styles.name}>{user.name}</Text>
        <Text style={styles.text}>
          Sinulla ei ole vielä asetettuja preferenssejä
        </Text>
        <Pressable
          style={styles.detailsButton}
          onPress={() => navigate(`/addpreferences`)}
        >
          <Text style={styles.buttonText}>Aseta preferenssit</Text>
        </Pressable>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.name}>{user.name}</Text>
      <Text style={styles.text}>
        Vaatteiden koot: {preferences?.clothing_sizes || "Ei määritelty"}
      </Text>
      <Text style={styles.text}>
        Kosmetiikkamieltymykset:{" "}
        {preferences?.cosmetic_preferences || "Ei määritelty"}
      </Text>
      <Text style={styles.text}>
        Muistiinpanot: {preferences?.notes || "Ei muistiinpanoja"}
      </Text>

      <Pressable
        style={styles.detailsButton}
        onPress={() => navigate(`/modifypreferences`)}
      >
        <Text style={styles.buttonText}>Muokkaa preferenssejä</Text>
      </Pressable>
    </View>
  );
};

export default UserPreferences;
