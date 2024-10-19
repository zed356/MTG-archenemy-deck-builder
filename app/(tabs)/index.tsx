import React from "react";
import GradientBackground from "@/components/GradientBackground";
import SavedDecks from "@/components/decks/SavedDecks";

export default function HomeScreen() {
  return (
    <GradientBackground>
      <SavedDecks />
    </GradientBackground>
  );
}
