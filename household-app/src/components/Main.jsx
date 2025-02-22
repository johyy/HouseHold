import { StyleSheet, View } from 'react-native';
import { Route, Routes, Navigate, useNavigate, useLocation } from 'react-router-native';

import ProductList from './ProductList';
import ProductDetails from './ProductDetails';
import AppBar from './AppBar';
import FooterBar from './FooterBar';
import SignIn from './SignIn';
import SignUp from './SignUp';
import AddProduct from './AddProduct';
import AddLocation from './AddLocation';
import AddCategory from './AddCategory'
import ModifyProduct from './ModifyProduct';
import UserPreferences from './UserPreferences';
import MissingProducts from './MissingProducts';
import ProductDetailsMissingProduct from './ProductDetailsMissingProduct';
import ModifyMissingProduct from './ModifyMissingProduct';
import Settings from './Settings';
import AddPreferences from './AddPreferences';
import ModifyUserPreferences from './ModifyUserPreferences';
import theme from '../theme';
import useAuthStorage from '../hooks/useAuthStorage';
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
    const authStorage = useAuthStorage();

    useEffect(() => {
        const checkAuth = async () => {
            const token = await authStorage.getAccessToken();
            setIsSignedIn(token ? true : false);

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
        await authStorage.removeAccessToken();
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
                    path="/addproduct"
                    element={isSignedIn ? <AddProduct /> : <Navigate to="/singin" replace />}
                />
                <Route 
                    path="/addlocation"
                    element={isSignedIn ? <AddLocation /> : <Navigate to="/signin" replace />}
                />
                <Route 
                    path="/addcategory"
                    element={isSignedIn ? <AddCategory /> : <Navigate to="/signin" replace />}
                />
                <Route
                    path="/modifyproduct/:id"
                    element={isSignedIn ? <ModifyProduct /> : <Navigate to="/singin" replace />}
                />
                <Route
                    path="/userpreferences"
                    element={isSignedIn ? <UserPreferences /> : <Navigate to="/singin" replace />}
                />
                <Route
                    path="/missingproducts"
                    element={isSignedIn ? <MissingProducts /> : <Navigate to="/singin" replace />}
                />
                <Route
                    path="/settings"
                    element={isSignedIn ? <Settings /> : <Navigate to="/singin" replace />}
                />
                <Route
                    path="/productmissing/:id"
                    element={isSignedIn ? <ProductDetailsMissingProduct /> : <Navigate to="/singin" replace />}
                />
                <Route
                    path="/modifymissingproduct/:id"
                    element={isSignedIn ? <ModifyMissingProduct /> : <Navigate to="/singin" replace />}
                />
                <Route
                    path="/addpreferences"
                    element={isSignedIn ? <AddPreferences /> : <Navigate to="/singin" replace />}
                />
                <Route
                    path="/modifypreferences"
                    element={isSignedIn ? <ModifyUserPreferences /> : <Navigate to="/singin" replace />}
                />
                <Route
                    path="*"
                    element={<Navigate to={isSignedIn ? '/' : '/signin'} replace />}
                />
            </Routes>
            <FooterBar />
        </View>
    );
};

export default Main;
