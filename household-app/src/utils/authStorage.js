import AsyncStorage from "@react-native-async-storage/async-storage";

class AuthStorage {
  async getAccessToken() {
    const accessToken = await AsyncStorage.getItem("accessToken");
    return accessToken;
  }

  async setAccessToken(token) {
    await AsyncStorage.setItem("accessToken", token);
  }

  async removeAccessToken() {
    await AsyncStorage.removeItem("accessToken");
  }
}

export default AuthStorage;
