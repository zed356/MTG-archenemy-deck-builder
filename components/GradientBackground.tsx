import React from "react";
import { LinearGradient } from "expo-linear-gradient";
import { StyleSheet } from "react-native";

interface InputProps {
  children?: React.ReactNode;
  reversed?: boolean;
}

const GradientBackground: React.FC<InputProps> = ({ children, reversed = false }) => {
  const colors = reversed ? ["#000000", "#2E0054"] : ["#2E0054", "#000000"];

  return (
    <LinearGradient colors={colors} style={styles.gradient}>
      {children}
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  gradient: {
    flex: 1, // Fill the entire space
  },
});

export default GradientBackground;
