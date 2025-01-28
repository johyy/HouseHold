import { StyleSheet, View } from 'react-native';
import { Route, Routes, Navigate, useNavigate, useLocation } from 'react-router-native';

import ProductList from './ProductList';
import ProductDetails from './ProductDetails';
import AppBar from './AppBar';
import SignIn from './SignIn';
import SignUp from './SignUp';
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
  const location = useLocation();

  useEffect(() => {
    const checkAuth = async () => {
      const token = await AsyncStorage.getItem('accessToken');
      setIsSignedIn(!!token);

      if (token && location.pathname === '/signin') {
        navigate('/'); 
      }
      if (!token && location.pathname !== '/signup' && location.pathname !== '/signin') {
        navigate('/signin'); 
      }
    };
    checkAuth();
  }, [location]);

  const handleSignOut = async () => {
    await AsyncStorage.removeItem('accessToken');
    setIsSignedIn(false);
    navigate('/signin');
  };

  if (isSignedIn === null) {
    return <View style={styles.container} />;
  }

  return (
    <View style={styles.container}>
      <AppBar isSignedIn={isSignedIn} onSignOut={handleSignOut} />
      <Routes>
        <Route
          path="/"
          element={isSignedIn ? <ProductList /> : <Navigate to="/signin" replace />}
        />
        <Route
          path="/signin"
          element={!isSignedIn ? <SignIn onSignIn={() => setIsSignedIn(true)} /> : <Navigate to="/" replace />}
        />
        <Route
          path="/signup"
          element={!isSignedIn ? <SignUp /> : <Navigate to="/" replace />}
        />
        <Route
          path="/product/:id"
          element={isSignedIn ? <ProductDetails /> : <Navigate to="/singin" replace />}
        />
        <Route
          path="*"
          element={<Navigate to={isSignedIn ? '/' : '/signin'} replace />}
        />
      </Routes>
    </View>
  );
};

export default Main;
