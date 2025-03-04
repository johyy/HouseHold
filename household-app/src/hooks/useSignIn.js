import { useState } from "react";
import useAuthStorage from "../hooks/useAuthStorage";
import { API_URL_USERS } from "@env";

const useSignIn = () => {
  const authStorage = useAuthStorage();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const signIn = async ({ username, password }) => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch(`${API_URL_USERS}/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to sign in");
      }

      const { token } = await response.json();
      await authStorage.setAccessToken(token);

      return token;
    } catch (e) {
      setError(e.message);
      throw e;
    } finally {
      setLoading(false);
    }
  };

  return { signIn, loading, error };
};

export default useSignIn;
