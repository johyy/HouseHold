import AsyncStorage from '@react-native-async-storage/async-storage';

const useSignOut = () => {
  const signOut = async () => {
    await AsyncStorage.removeItem('accessToken');
  };

  return signOut;
};

export default useSignOut;