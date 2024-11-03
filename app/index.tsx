import React from "react";
import GradientBackground from "@/components/style-elements/GradientBackground";
import { Redirect } from "expo-router";

export default function HomeScreen() {
  // Can't run app without main index.tsx file. Only purpose to redirect to tabs.

  //// TODO ///
  // 1. 'Back' gesture sometimes doesn't work during Play. No idea.
  // 3. gamescreen/index goes back using router.push which doesnt reset stack. router.replace does not work..
  // 4. helper funcs to handle state/storage updates in one go,
  //    rather than having to call multiple functions
  // 5. fix loading spinner in Card

  // 11. SAVED DECK FILTERING NOT WORKING! If filter active and you add / remove card, displayed cards get reset to include all.

  return (
    <GradientBackground>
      <Redirect href="/(tabs)/playmode" />
    </GradientBackground>
  );
}
