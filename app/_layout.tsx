import { API_DATA_STORAGE_KEY, API_URL } from "@/constants/values";
import { loadDecksFromStorage } from "@/helpers/savedDeckManager";
import { useLoadAPIData } from "@/hooks/useLoadAPIData";
import { useCardStore, useSavedDeckStore } from "@/store/store";
import { useFonts } from "expo-font";
import { Image } from "expo-image";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useEffect, useState } from "react";
import "react-native-reanimated";

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [loaded] = useFonts({
    SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
    Beleren: require("../assets/fonts/Beleren-Bold.ttf"),
  });
  const [imagesLoaded, setImagesLoaded] = useState(false);
  const { loadCardsIntoStore, setError, setLoading } = useCardStore();
  const { loadDecksFromStorageIntoState } = useSavedDeckStore();

  // checks if card data exists in local storage. If not, send API request and cache it.
  const data = useLoadAPIData(API_DATA_STORAGE_KEY, API_URL, setError, setLoading);

  // ----  APP INIT ----
  // Load cards into state when data is fetched from api/localstorage.
  // Load saved decks from local storage into state.
  // Pre-fetch images for cards that are not stored in local cache.
  useEffect(() => {
    if (data.length === 0) {
      return;
    }

    loadCardsIntoStore(data);

    const initialiseAppData = async () => {
      const savedDecks = await loadDecksFromStorage();
      if (savedDecks) {
        loadDecksFromStorageIntoState(savedDecks);
      }

      const prefetchImagesPromises = data.map(async (card) => {
        const cachePath = await Image.getCachePathAsync(card.image_uris?.border_crop!);
        if (!cachePath) {
          await Image.prefetch(card.image_uris?.border_crop!);
        }
      });

      await Promise.all(prefetchImagesPromises);
      setImagesLoaded(true);
    };

    initialiseAppData();
  }, [data, loadCardsIntoStore, loadDecksFromStorageIntoState]);

  useEffect(() => {
    if (loaded && imagesLoaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded, imagesLoaded]);

  if (!loaded) {
    return null;
  }

  return (
    <Stack>
      <Stack.Screen name="index" options={{ headerShown: false, animation: "fade" }} />
      <Stack.Screen name="(tabs)" options={{ headerShown: false, animation: "fade" }} />
      <Stack.Screen name="gamescreen/index" options={{ headerShown: false, animation: "fade" }} />
    </Stack>
  );
}
