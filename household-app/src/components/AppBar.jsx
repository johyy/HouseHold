import { useEffect, useState } from 'react';
import { View, StyleSheet, Pressable } from 'react-native';
import Constants from 'expo-constants';
import Text from './Text';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigate, useLocation } from 'react-router-native';
import useSignOut from '../hooks/useSignOut';

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

  const handleSignIn = () => {
    navigate('/signin');
  };

  const handleSignUp = () => {
    navigate('/signup');
  };

  return (
    <View style={styles.container}>
      <Pressable onPress={handleSignIn}>
        <Text style={styles.title}>HouseHold</Text>
      </Pressable>
      <View style={styles.buttonContainer}>
        {isSignedIn ? (
          <Pressable onPress={handleSignOut}>
            <Text style={styles.button}>Kirjaudu ulos</Text>
          </Pressable>
        ) : (
          <>
            <Pressable onPress={handleSignIn}>
              <Text style={styles.button}>Kirjaudu</Text>
            </Pressable>
            <Pressable onPress={handleSignUp}>
              <Text style={styles.button}>Luo tunnus</Text>
            </Pressable>
          </>
        )}
      </View>
    </View>
  );
};

export default AppBar;
