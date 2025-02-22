import React, { useState } from 'react';
import { TextInput, Pressable, View, StyleSheet } from 'react-native';
import { useFormik } from 'formik';
import * as yup from 'yup';
import useSignIn from '../hooks/useSignIn';
import { useNavigate } from 'react-router-native';
import Text from './Text';

const styles = StyleSheet.create({
    container: {
        padding: 15,
    },
    input: {
        borderWidth: 1,
        borderColor: '#ccc',
        padding: 10,
        marginBottom: 15,
        borderRadius: 5,
        backgroundColor: 'white',
    },
    button: {
        backgroundColor: '#2E5894',
        padding: 12,
        alignItems: 'center',
        borderRadius: 5,
    },
    buttonText: {
        color: 'white',
        fontWeight: 'bold',
        fontSize: 16,
    },
    errorText: {
        color: 'red',
        marginBottom: 15,
        fontSize: 14,
    },
    loading: {
        marginTop: 10,
        alignItems: 'center',
    },
});

const validationSchema = yup.object().shape({
    username: yup.string().required('Käyttäjätunnus tarvitaan'),
    password: yup.string().required('Salasana tarvitaan'),
});

const SignInForm = ({ onSubmit, isLoading, errorMessage }) => {
    const formik = useFormik({
        initialValues: { username: '', password: '' },
        validationSchema,
        onSubmit,
    });

    return (
        <View style={styles.container}>
            <TextInput
                style={styles.input}
                placeholder="Käyttäjätunnus"
                value={formik.values.username}
                onChangeText={formik.handleChange('username')}
                editable={!isLoading}
            />
            {formik.touched.username && formik.errors.username && (
                <Text style={styles.errorText}>{formik.errors.username}</Text>
            )}
            <TextInput
                style={styles.input}
                placeholder="Salasana"
                secureTextEntry
                value={formik.values.password}
                onChangeText={formik.handleChange('password')}
                editable={!isLoading}
            />
            {formik.touched.password && formik.errors.password && (
                <Text style={styles.errorText}>{formik.errors.password}</Text>
            )}

            {errorMessage ? <Text style={styles.errorText}>{errorMessage}</Text> : null}
            <Pressable
                style={[styles.button, isLoading && { backgroundColor: '#ccc' }]}
                onPress={formik.handleSubmit}
                disabled={isLoading}
            >
                <Text style={styles.buttonText}>
                    {isLoading ? 'Kirjaudutaan...' : 'Kirjaudu sisään'}
                </Text>
            </Pressable>
            {isLoading && (
                <View style={styles.loading}>
                </View>
            )}
        </View>
    );
};

const SignIn = () => {
    const { signIn } = useSignIn();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');

    const onSubmit = async (values) => {
        try {
            setLoading(true);
            setErrorMessage('')
            await signIn(values);
            navigate('/');
        } catch (error) {
            console.log('Logging in failed:', error.message);
            setErrorMessage('Virheellinen käyttäjätunnus tai salasana');
        } finally {
            setLoading(false);
        }
    };

    return <SignInForm onSubmit={onSubmit} isLoading={loading} errorMessage={errorMessage} />;
};

export default SignIn;
