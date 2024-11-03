import { API_DATA_STORAGE_KEY, API_URL } from "@/constants/values";
import { useLoadAPIData } from "@/hooks/useLoadAPIData";
import { useCardStore, useSavedDeckStore } from "@/store/store";
import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useEffect, useState } from "react";
import "react-native-reanimated";
import { Image } from "expo-image";
import { loadDecksFromStorage } from "@/helpers/savedDeckManager";

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
    if (data.length > 0) {
      loadCardsIntoStore(data);
    }

    const preFetchImages = async () => {
      if (data.length > 0) {
        for (let i = 0; i < data.length; i++) {
          if ((await Image.getCachePathAsync(data[i].image_uris?.border_crop!)) === null) {
            await Image.prefetch(data[i].image_uris?.border_crop!);
          }
        }
      }
      setImagesLoaded(true);
    };

    const hideSplashScreen = async () => {
      if (loaded && imagesLoaded) {
        await SplashScreen.hideAsync();
      }
    };

    const loadSavedDecks = async () => {
      const savedDecks = await loadDecksFromStorage();
      if (savedDecks != null) {
        loadDecksFromStorageIntoState(savedDecks);
      }
    };

    loadSavedDecks();
    preFetchImages();
    hideSplashScreen();
  }, [data]);

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
