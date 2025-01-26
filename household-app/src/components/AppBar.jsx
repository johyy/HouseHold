import { View, StyleSheet } from 'react-native';
import Constants from 'expo-constants';
import Text from './Text';

const styles = StyleSheet.create({
  container: {
    paddingTop: Constants.statusBarHeight,
    backgroundColor: '#2E5894',
    flexDirection: 'row'
  },
  text: {
    color: 'white',
    fontSize: 25,
    fontWeight: 'bold',
    marginLeft: 15,
    marginBottom: 10
  },
});

const AppBar = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>HouseHold</Text>
    </View>
  );
};

export default AppBar;