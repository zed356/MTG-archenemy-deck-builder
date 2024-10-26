import React, { useEffect } from "react";
import GradientBackground from "@/components/style-elements/GradientBackground";
import SavedDecks from "@/components/decks/SavedDecks";
import { API_DATA_STORAGE_KEY, API_URL } from "@/constants/values";
import { useLoadAPIData } from "@/hooks/useLoadAPIData";
import { useCardStore } from "@/store/store";
import RootLayout from "./_layout";
import { NavigationContainer } from "@react-navigation/native";
import { Redirect } from "expo-router";
import { View, Text } from "react-native";

export default function HomeScreen() {
  // const { loadCardsIntoStore, setError, setLoading } = useCardStore();

  // // checks if card data exists in local storage. If not, send API request and cache it.
  // const data = useLoadAPIData(API_DATA_STORAGE_KEY, API_URL, setError, setLoading);

  // // Update cards only when data changes
  // useEffect(() => {
  //   if (data.length > 0) {
  //     loadCardsIntoStore(data);
  //   }
  // }, [data]); // Run this effect only when `data` changes

  //// TODO ///
  // 1. PLAY MODE!!!
  // 3. fix + / - so they'd look nice, currently poop
  // 4. helper funcs to handle state/storage updates in one go,
  //    rather than having to call multiple functions
  // 5. fix loading spinner in Card
  // 6. app loads too fast, cant see splash screen. add delay of like 2s
  // 7. change splash background color, shows white briefly.
  // 8. CHANGE AMOUNT OF CARDS LOADED!!! currently 10...
  // 9. app icon head is cut off... :(
  // 10. fix index showing during app init...

  return (
    <GradientBackground>
      <Redirect href="/(tabs)/playmode" />
    </GradientBackground>
  );
}
