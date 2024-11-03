import AsyncStorage from "@react-native-async-storage/async-storage";
import { ScryfallCard } from "@scryfall/api-types";
import { useEffect, useState } from "react";
import * as Network from "expo-network";

export const useLoadAPIData = (
  STORAGE_KEY: string,
  API_URL: string,
  setError: (error: string | null) => void,
  setLoading: (loading: boolean) => void,
): ScryfallCard.Scheme[] => {
  const [cards, setCards] = useState<ScryfallCard.Scheme[]>([]);

  useEffect(() => {
    const fetchCards = async () => {
      try {
        let apiData;
        const networkState = await Network.getNetworkStateAsync();
        const cachedCards = await AsyncStorage.getItem(STORAGE_KEY);
        if (networkState.isInternetReachable === true) {
          {
            // Fetch data from API if no cached data
            const response = await fetch(API_URL);
            if (!response.ok) {
              throw new Error("Failed to fetch cards");
            }
            apiData = await response.json();
            if (
              cachedCards === null ||
              JSON.parse(cachedCards).length < apiData.data.length
            ) {
              await AsyncStorage.setItem(
                STORAGE_KEY,
                JSON.stringify(apiData.data),
              );
              setCards(apiData.data);
            } else {
              // Use cached data
              setCards(JSON.parse(cachedCards));
            }
          }
        } else if (cachedCards) {
          // Use cached data
          setCards(JSON.parse(cachedCards));
        } else {
          throw new Error(
            "No internet connection and no cached data. Please connect to the internet.",
          );
        }
      } catch (error: any) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchCards();
  }, [API_URL, STORAGE_KEY, setError, setLoading]);

  return cards;
};
