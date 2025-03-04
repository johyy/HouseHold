import { useState } from "react";
import useAuthStorage from "./useAuthStorage";
import { API_URL_USERS } from "@env";

const useSignUp = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const authStorage = useAuthStorage(); 

  const signUp = async ({ name, username, password }) => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch(`${API_URL_USERS}/users`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, username, password }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to sign up");
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

  return { signUp, loading, error };
};

export default useSignUp;
