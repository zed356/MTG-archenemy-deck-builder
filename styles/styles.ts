import { StyleSheet } from "react-native";

export const defaultColors = {
  border: "#FFC107",
  green: "#42b883",
  gold: "#FFC107",
  red: "#FF5722",
};

export const defaultBorderRadius = 5;

export const globalStyles = StyleSheet.create({
  positiveActionButton: {
    backgroundColor: "#42b883",
    padding: 10,
    borderRadius: defaultBorderRadius,
    margin: 5,
  },
  neutralActionButton: {
    backgroundColor: "#FFC107",
    padding: 10,
    borderRadius: defaultBorderRadius,
    margin: 5,
  },
  negativeActionButton: {
    backgroundColor: "#FF5722",
    padding: 10,
    borderRadius: defaultBorderRadius,
    margin: 5,
  },
  text: {
    color: "black",
    textAlign: "center",
    fontFamily: "Beleren",
  },
});
