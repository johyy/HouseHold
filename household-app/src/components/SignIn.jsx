import React, { useState } from "react";
import { TextInput, Pressable, View } from "react-native";
import { useFormik } from "formik";
import * as yup from "yup";
import useSignIn from "../hooks/useSignIn";
import { useNavigate } from "react-router-native";
import Text from "./Text";
import styles from "../utils/styles";

const validationSchema = yup.object().shape({
  username: yup.string().required("Käyttäjätunnus tarvitaan"),
  password: yup.string().required("Salasana tarvitaan"),
});

const SignInForm = ({ onSubmit, isLoading, errorMessage }) => {
  const formik = useFormik({
    initialValues: { username: "", password: "" },
    validationSchema,
    onSubmit,
  });

  return (
    <View style={styles.signInContainer}>
      <TextInput
        style={styles.signInInput}
        placeholder="Käyttäjätunnus"
        value={formik.values.username}
        onChangeText={formik.handleChange("username")}
        editable={!isLoading}
      />
      {formik.touched.username && formik.errors.username && (
        <Text style={styles.errorText}>{formik.errors.username}</Text>
      )}
      <TextInput
        style={styles.signInInput}
        placeholder="Salasana"
        secureTextEntry
        value={formik.values.password}
        onChangeText={formik.handleChange("password")}
        editable={!isLoading}
      />
      {formik.touched.password && formik.errors.password && (
        <Text style={styles.errorText}>{formik.errors.password}</Text>
      )}

      {errorMessage ? (
        <Text style={styles.errorText}>{errorMessage}</Text>
      ) : null}
      <Pressable
        style={[styles.button, isLoading && { backgroundColor: "#ccc" }]}
        onPress={formik.handleSubmit}
        disabled={isLoading}
      >
        <Text style={styles.buttonText}>
          {isLoading ? "Kirjaudutaan..." : "Kirjaudu sisään"}
        </Text>
      </Pressable>
      {isLoading && <View style={styles.loading}></View>}
    </View>
  );
};

const SignIn = () => {
  const { signIn } = useSignIn();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const onSubmit = async (values) => {
    try {
      setLoading(true);
      setErrorMessage("");
      await signIn(values);
      navigate("/");
    } catch (error) {
      console.log("Logging in failed:", error.message);
      setErrorMessage("Virheellinen käyttäjätunnus tai salasana");
    } finally {
      setLoading(false);
    }
  };

  return (
    <SignInForm
      onSubmit={onSubmit}
      isLoading={loading}
      errorMessage={errorMessage}
    />
  );
};

export default SignIn;
