import { useEffect, useState } from 'react';
import { View, StyleSheet, Pressable } from 'react-native';
import Constants from 'expo-constants';
import Text from './Text';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigate, useLocation } from 'react-router-native';
import useSignOut from '../hooks/useSignOut';
import Icon from 'react-native-vector-icons/MaterialIcons';


const styles = StyleSheet.create({
    container: {
        paddingTop: Constants.statusBarHeight,
        backgroundColor: '#2E5894',
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 10,
        justifyContent: 'space-between',
    },
    title: {
        color: 'white',
        fontSize: 25,
        fontWeight: 'bold',
        marginBottom: 10,
        marginLeft: 10
    },
    buttonContainer: {
        flexDirection: 'row',
    },
    button: {
        color: 'white',
        fontSize: 16,
        marginLeft: 10,
    },
});

const AppBar = () => {
    const [isSignedIn, setIsSignedIn] = useState(false);
    const signOut = useSignOut();
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

    const handleSignOut = async () => {
        await signOut();
        setIsSignedIn(false);
        navigate('/signin');
    };

    return (
        <View style={styles.container}>
            <Pressable onPress={() => navigate('/signin')}>
                <Text style={styles.title}>HouseHold</Text>
            </Pressable>
            <View style={styles.buttonContainer}>
                {isSignedIn ? (
                    <Pressable onPress={handleSignOut}>
                        <Icon name="logout" size={30} color="white" />
                    </Pressable>
                ) : (
                    <>
                        <Pressable onPress={() => navigate('/signin')} style={{ marginRight: 30 }}>
                            <Icon name="login" size={30} color="white" />
                        </Pressable>
                        <Pressable onPress={() => navigate('/signup')}>
                            <Icon name="person-add" size={30} color="white" />
                        </Pressable>
                    </>
                )}
            </View>
        </View>
    );
};

export default AppBar;
