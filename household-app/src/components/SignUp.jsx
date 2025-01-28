import React, { useState } from 'react';
import { TextInput, Pressable, View, StyleSheet } from 'react-native';
import { useFormik } from 'formik';
import * as yup from 'yup';
import { useNavigate } from 'react-router-native';
import Text from './Text';
import useSignUp from '../hooks/useSignUp';

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
  name: yup.string().required('Nimi tarvitaan'),
  username: yup
    .string()
    .min(2, 'Käyttäjätunnuksen minimipituus on 2 merkkiä')
    .max(30, 'Käyttäjätunnuksen maksimipituus on 30 merkkiä')
    .required('Käyttäjätunnus tarvitaan'),
  password: yup
    .string()
    .min(5, 'Salasanan minimipituus on 5 merkkiä')
    .max(50, 'Salasanan maksimipituus on 50 merkkiä')
    .required('Salasana tarvitaan'),
  passwordConfirm: yup
    .string()
    .oneOf([yup.ref('password'), null], 'Salasanat eivät täsmää')
    .required('Salasanan vahvistus tarvitaan'),
});

const SignUpForm = ({ onSubmit, isLoading }) => {
  const formik = useFormik({
    initialValues: {
      name: '',
      username: '',
      password: '',
      passwordConfirm: '',
    },
    validationSchema,
    onSubmit,
  });

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Nimi"
        value={formik.values.name}
        onChangeText={formik.handleChange('name')}
        editable={!isLoading}
      />
      {formik.touched.name && formik.errors.name && (
        <Text style={styles.errorText}>{formik.errors.name}</Text>
      )}
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
      <TextInput
        style={styles.input}
        placeholder="Vahvista salasana"
        secureTextEntry
        value={formik.values.passwordConfirm}
        onChangeText={formik.handleChange('passwordConfirm')}
        editable={!isLoading}
      />
      {formik.touched.passwordConfirm && formik.errors.passwordConfirm && (
        <Text style={styles.errorText}>{formik.errors.passwordConfirm}</Text>
      )}
      <Pressable
        style={[styles.button, isLoading && { backgroundColor: '#ccc' }]}
        onPress={formik.handleSubmit}
        disabled={isLoading}
      >
        <Text style={styles.buttonText}>
          {isLoading ? 'Luodaan tunnusta...' : 'Luo tunnus'}
        </Text>
      </Pressable>
      {isLoading && (
        <View style={styles.loading}>
        </View>
      )}
    </View>
  );
};

const SignUp = () => {
  const { signUp } = useSignUp();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const onSubmit = async (values) => {
    try {
      setLoading(true);
      await signUp(values);
      navigate('/');
    } catch (error) {
      console.error('Rekisteröityminen epäonnistui:', error.message);
    } finally {
      setLoading(false);
    }
  };

  return <SignUpForm onSubmit={onSubmit} isLoading={loading} />;
};

export default SignUp;
