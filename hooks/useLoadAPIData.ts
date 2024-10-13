import AsyncStorage from "@react-native-async-storage/async-storage";
import { ScryfallCard } from "@scryfall/api-types";
import { useEffect, useState } from "react";

export const useLoadAPIData = (
  STORAGE_KEY: string,
  API_URL: string,
  setError: (error: string | null) => void,
  setLoading: (loading: boolean) => void
): ScryfallCard.Scheme[] => {
  const [cards, setCards] = useState<ScryfallCard.Scheme[]>([]);

  useEffect(() => {
    const fetchCards = async () => {
      try {
        const cachedCards = await AsyncStorage.getItem(STORAGE_KEY);
        if (cachedCards) {
          // Use cached data
          setCards(JSON.parse(cachedCards));
        } else {
          // Fetch data from API if no cached data
          const response = await fetch(API_URL);
          if (!response.ok) {
            throw new Error("Failed to fetch cards");
          }
          const data = await response.json();
          setCards(data.data);
          // Cache the fetched data
          await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(data.data));
        }
      } catch (error: any) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchCards();
  }, []);

  return cards;
};
