import { useEffect, useState } from 'react';
import { View, StyleSheet, Pressable } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigate, useLocation } from "react-router-native";
import Text from "./Text";

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#2E5894',
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        flexDirection: 'row',
        justifyContent: 'space-around',
        paddingVertical: 10,
    },
    button: {
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold',
      },
});

const FooterBar = () => {
    const [isSignedIn, setIsSignedIn] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        const checkAuth = async () => {
          const token = await AsyncStorage.getItem('accessToken');
          if (token) {
            setIsSignedIn(true);
          } else {
            setIsSignedIn(false);
          }
        };
        checkAuth();
    }, [location]);

    const handleAddProduct = () => {
        navigate('/addproduct');
    };

    if (!isSignedIn || location.pathname === '/addproduct') {
        return null;
    }

    return (
        <View style={styles.container}>
            <Pressable onPress={handleAddProduct}>
                <Text style={styles.button}>Lisää tavara</Text>
            </Pressable>
        </View>
    );
};

export default FooterBar;