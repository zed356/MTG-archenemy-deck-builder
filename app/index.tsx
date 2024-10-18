import DeckBuilder from "@/components/navigation/DeckBuilder";
import { LinearGradient } from "expo-linear-gradient";
import React from "react";
import { StyleSheet } from "react-native";

export default function HomeScreen() {
  const styles = StyleSheet.create({
    background: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
    },
  });
  return (
    <LinearGradient style={styles.background} colors={["#2E0054", "#000000"]}>
      <DeckBuilder />
    </LinearGradient>
  );
}
