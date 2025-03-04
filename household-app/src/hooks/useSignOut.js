import useAuthStorage from "./useAuthStorage";

const useSignOut = () => {
  const authStorage = useAuthStorage();

  const signOut = async () => {
    await authStorage.removeAccessToken();
  };

  return signOut;
};

export default useSignOut;
