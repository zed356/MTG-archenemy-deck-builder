import React, { useEffect } from "react";
import GradientBackground from "@/components/GradientBackground";
import SavedDecks from "@/components/decks/SavedDecks";
import { API_DATA_STORAGE_KEY } from "@/constants/values";
import { useLoadAPIData } from "@/hooks/useLoadAPIData";
import { useCardStore } from "@/store/store";

export default function HomeScreen() {
  const { loadCardsIntoStore, setError, setLoading } = useCardStore();

  // checks if card data exists in local storage. If not, send API request and cache it.
  const data = useLoadAPIData(
    API_DATA_STORAGE_KEY,
    "https://api.scryfall.com/cards/search?q=s%3Aoarc",
    setError,
    setLoading
  );

  // Update cards only when data changes
  useEffect(() => {
    if (data.length > 0) {
      loadCardsIntoStore(data);
    }
  }, [data]); // Run this effect only when `data` changes

  return (
    <GradientBackground>
      <SavedDecks />
    </GradientBackground>
  );
}
