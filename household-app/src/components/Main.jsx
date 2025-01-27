import { StyleSheet, View } from 'react-native';
import { Route, Routes, Navigate, useNavigate } from 'react-router-native';

import ProductList from './ProductList';
import AppBar from './AppBar';
import SignIn from './SignIn';
import theme from '../theme';
import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { useEffect, useState } from 'react';

const styles = StyleSheet.create({
  container: {
    backgroundColor: theme.colors.mainBackground,
    flexGrow: 1,
    flexShrink: 1,
  },
});

const Main = () => {
  const [isSignedIn, setIsSignedIn] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuth = async () => {
      const token = await AsyncStorage.getItem('accessToken');
      setIsSignedIn(!!token);
      if (!!token) {
        navigate('/');
      } else {
        navigate('/signin'); 
      }
    };

    checkAuth();
  }, [navigate]);

  const handleSignOut = async () => {
    await AsyncStorage.removeItem('accessToken');
    setIsSignedIn(false); 
    navigate('/signin');
  };
  
  return (
    <View style={styles.container}>
      <AppBar isSignedIn={isSignedIn} onSignOut={handleSignOut} />
      <Routes>
        <Route path="/" element={isSignedIn ? <ProductList /> : <Navigate to="/signin" replace />} />
        <Route path="/signin" element={!isSignedIn ? <SignIn onSignIn={() => setIsSignedIn(true)} /> : <Navigate to="/" replace />} />
        <Route path="*" element={<Navigate to={isSignedIn ? '/' : '/signin'} replace />} />
      </Routes>
    </View>
  );
};

export default Main;
