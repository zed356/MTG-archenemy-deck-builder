import CustomButton from "@/components/button/CustomButton";
import DeckBuilder from "@/components/navigation/DeckBuilder";
import { LinearGradient } from "expo-linear-gradient";
import { Link, router } from "expo-router";
import React from "react";
import { StyleSheet, View, Text } from "react-native";
import { Colors, defaultColors } from "@/constants/Colors";
import GradientBackground from "@/components/GradientBackground";

export default function HomeScreen() {
  const styles = StyleSheet.create({
    background: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
    },
  });
  return (
    <GradientBackground>
      {/* <CustomButton type="neutral" text="Builder" onPress={() => router.push("/deckbuilder")} /> */}
    </GradientBackground>
    /* <Link href="/users">Go to users!</Link> */
  );
}
