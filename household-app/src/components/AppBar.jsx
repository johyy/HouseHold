import React, { useEffect } from 'react';
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
  },
  title: {
    color: 'white',
    fontSize: 25,
    fontWeight: 'bold',
    flex: 1,
  },
  button: {
    color: 'white',
    fontSize: 16,
    marginHorizontal: 10,
  },
});

const AppBar = () => {
  const [isSignedIn, setIsSignedIn] = React.useState(false);
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

  return (
    <View style={styles.container}>
      <Text style={styles.title}>HouseHold</Text>
      {isSignedIn ? (
        <Pressable onPress={handleSignOut}>
          <Text style={styles.button}>Sign out</Text>
        </Pressable>
      ) : (
        <>
          <Pressable onPress={handleSignIn}>
            <Text style={styles.button}>Sign in</Text>
          </Pressable>
        </>
      )}
    </View>
  );
};

export default AppBar;
