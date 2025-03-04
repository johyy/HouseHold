import { useEffect, useState } from "react";
import { View, Pressable } from "react-native";
import Text from "./Text";
import useAuthStorage from "../hooks/useAuthStorage";
import { useNavigate, useLocation } from "react-router-native";
import useSignOut from "../hooks/useSignOut";
import Icon from "react-native-vector-icons/MaterialIcons";
import styles from "../utils/styles";

const AppBar = () => {
  const [isSignedIn, setIsSignedIn] = useState(false);
  const signOut = useSignOut();
  const navigate = useNavigate();
  const location = useLocation();
  const authStorage = useAuthStorage();

  useEffect(() => {
    const checkAuth = async () => {
      const token = await authStorage.getAccessToken();
      if (token) {
        setIsSignedIn(true);
      } else {
        setIsSignedIn(false);
      }
    };
    checkAuth();
  }, [location]);

  const handleSignOut = async () => {
    await signOut();
    setIsSignedIn(false);
    navigate("/signin");
  };

  return (
    <View style={styles.appBarContainer}>
      <Pressable onPress={() => navigate("/signin")}>
        <Text style={styles.title}>HouseHold</Text>
      </Pressable>
      <View style={styles.buttonContainer}>
        {isSignedIn ? (
          <Pressable onPress={handleSignOut}>
            <Icon name="logout" size={30} color="white" />
          </Pressable>
        ) : (
          <>
            <Pressable
              onPress={() => navigate("/signin")}
              style={{ marginRight: 30 }}
            >
              <Icon name="login" size={30} color="white" />
            </Pressable>
            <Pressable onPress={() => navigate("/signup")}>
              <Icon name="person-add" size={30} color="white" />
            </Pressable>
          </>
        )}
      </View>
    </View>
  );
};

export default AppBar;
