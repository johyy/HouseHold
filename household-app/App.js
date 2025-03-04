import { StatusBar } from "expo-status-bar";

import { NativeRouter } from "react-router-native";

import Main from "./src/components/Main";
import AuthStorage from "./src/utils/authStorage";
import AuthStorageContext from "./src/contexts/AuthStorageContext";

const authStorage = new AuthStorage();

const App = () => {
  return (
    <>
      <NativeRouter>
        <AuthStorageContext.Provider value={authStorage}>
          <Main />
        </AuthStorageContext.Provider>
      </NativeRouter>
      <StatusBar style="auto" />
    </>
  );
};

export default App;
