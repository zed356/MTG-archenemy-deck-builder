import { API_DATA_STORAGE_KEY, API_URL } from "@/constants/values";
import { useLoadAPIData } from "@/hooks/useLoadAPIData";
import { useCardStore } from "@/store/store";
import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useEffect, useState } from "react";
import "react-native-reanimated";
import { Image } from "expo-image";

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [loaded] = useFonts({
    SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
    Beleren: require("../assets/fonts/Beleren-Bold.ttf"),
  });
  const [imagesLoaded, setImagesLoaded] = useState(false);
  const { loadCardsIntoStore, setError, setLoading } = useCardStore();

  // checks if card data exists in local storage. If not, send API request and cache it.
  const data = useLoadAPIData(API_DATA_STORAGE_KEY, API_URL, setError, setLoading);

  // Load cards into state when data is fetched from api/localstorage.
  useEffect(() => {
    if (data.length > 0) {
      loadCardsIntoStore(data);
    }

    // prefetch images if not stored in local cache
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

    preFetchImages();
  }, [data]);

  if (loaded && imagesLoaded) {
    SplashScreen.hideAsync();
  }

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
