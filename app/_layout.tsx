import { API_DATA_STORAGE_KEY, API_URL } from "@/constants/values";
import { useLoadAPIData } from "@/hooks/useLoadAPIData";
import { useCardStore } from "@/store/store";
import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useEffect } from "react";
import "react-native-reanimated";

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [loaded] = useFonts({
    SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
    Beleren: require("../assets/fonts/Beleren-Bold.ttf"),
  });

  const { loadCardsIntoStore, setError, setLoading } = useCardStore();

  // checks if card data exists in local storage. If not, send API request and cache it.
  const data = useLoadAPIData(API_DATA_STORAGE_KEY, API_URL, setError, setLoading);

  // Update cards only when data changes
  useEffect(() => {
    if (data.length > 0) {
      loadCardsIntoStore(data);
    }
  }, [data]); // Run this effect only when `data` changes

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }
  return (
    <Stack>
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
    </Stack>
  );
}
