import { StyleSheet } from "react-native";
import Constants from "expo-constants";
import theme from "../theme";

const baseInput = {
  borderWidth: 1,
  borderColor: "#ccc",
  borderRadius: 5,
  padding: 10,
  backgroundColor: "#f9f9f9",
};

const baseButton = {
  padding: 15,
  borderRadius: 5,
  alignItems: "center",
};

const baseContainer = {
  backgroundColor: "white",
  borderRadius: 5,
  padding: 15,
};

const basePicker = {
  borderWidth: 1,
  borderColor: "#ccc",
  borderRadius: 5,
  marginBottom: 10,
  backgroundColor: "#f9f9f9",
};

const styles = StyleSheet.create({
  appBarContainer: {
    paddingTop: Constants.statusBarHeight,
    backgroundColor: "#2E5894",
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 10,
    justifyContent: "space-between",
  },
  button: {
    ...baseButton,
    backgroundColor: "#2E5894",
  },
  buttonContainer: {
    flexDirection: "row",
  },
  buttonText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 16,
  },
  container: {
    ...baseContainer,
    flex: 1,
  },
  createButton: {
    marginBottom: 15,
    alignSelf: "flex-end",
  },
  createButtonText: {
    color: "#2E5894",
    fontWeight: "bold",
  },
  deleteButton: {
    ...baseButton,
    backgroundColor: "red",
  },
  detailsButton: {
    ...baseButton,
    marginTop: 20,
    backgroundColor: "#2E5894",
    alignSelf: "flex-start",
  },
  detailsTitle: {
    fontSize: 20,
    fontWeight: "bold",
  },
  emptyText: {
    textAlign: "center",
    marginTop: 20,
    fontSize: 16,
    color: "gray",
  },
  errorText: {
    color: "red",
    textAlign: "center",
    marginTop: 20,
  },
  expiredItem: {
    borderColor: "red",
    borderWidth: 2,
  },
  footerBarContainer: {
    backgroundColor: "#2E5894",
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: "row",
    justifyContent: "space-around",
    paddingVertical: 10,
  },
  input: {
    ...baseInput,
    marginBottom: 15,
  },
  itemContainer: {
    ...baseContainer,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.3,
    shadowRadius: 2,
    elevation: 2,
  },
  label: {
    fontSize: 16,
    fontWeight: "bold",
    marginTop: 10,
  },
  loading: {
    marginTop: 20,
    alignItems: "center",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  mainContainer: {
    backgroundColor: theme.colors.mainBackground,
    flexGrow: 1,
    flexShrink: 1,
  },
  missingProductInput: {
    ...baseInput,
    width: "80%",
    textAlign: "center",
  },
  modalButton: {
    ...baseButton,
    flex: 1,
    marginHorizontal: 5,
    alignItems: "center",
  },
  modalButtonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    marginTop: 15,
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  modalContent: {
    ...baseContainer,
    padding: 20,
    width: 300,
    alignItems: "center",
  },
  modifyProductButton: {
    ...baseButton,
    marginTop: 20,
    backgroundColor: "#2E5894",
    alignSelf: "flex-start",
  },
  modifyProductInput: {
    ...baseInput,
    fontSize: 16,
    padding: 8,
    marginTop: 5,
  },
  modifyProductPicker: {
    ...basePicker,
    marginBottom: 5,
    marginTop: 5,
  },
  name: {
    fontSize: 18,
    fontWeight: "bold",
  },
  picker: basePicker,
  productListContainer: {
    ...baseContainer,
    flex: 1,
    padding: 10,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 15,
  },
  searchInput: {
    ...baseInput,
    marginBottom: 10,
  },
  separator: {
    height: 10,
  },
  signInContainer: {
    padding: 15,
  },
  signInInput: {
    ...baseInput,
    marginBottom: 15,
    backgroundColor: "white",
  },
  text: {
    fontSize: 16,
    marginTop: 10,
  },
  title: {
    color: "white",
    fontSize: 25,
    fontWeight: "bold",
    marginBottom: 10,
    marginLeft: 10,
  },
});

export default styles;
