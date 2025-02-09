import { useEffect, useState } from 'react';
import { View, StyleSheet, Pressable } from 'react-native';
import useAuthStorage from '../hooks/useAuthStorage';
import { useNavigate, useLocation } from "react-router-native";
import Icon from 'react-native-vector-icons/MaterialIcons';

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

    const getIconColor = (path) => {
        return location.pathname === path ? "lightblue" : "white";
    };

    if (!isSignedIn) {
        return null;
    }
    
    return (
        <View style={styles.container}>
            <Pressable onPress={() => navigate('/')}>
                <Icon name="list" size={30} color={getIconColor('/')} />
            </Pressable>
            <Pressable onPress={() => navigate('/addproduct')}>
                <Icon name="playlist-add" size={30} color={getIconColor('/addproduct')} />
            </Pressable>
            <Pressable onPress={() => navigate('/missingproducts')}>
                <Icon name="shopping-cart" size={30} color={getIconColor('/missingproducts')} />
            </Pressable>
            <Pressable onPress={() => navigate('/settings')}>
                <Icon name="settings" size={30} color={getIconColor('/settings')} />
            </Pressable>
            <Pressable onPress={() => navigate('/userpreferences')}>
                <Icon name="person" size={30} color={getIconColor('/userpreferences')} />
            </Pressable>
        </View>
    );
};

export default FooterBar;