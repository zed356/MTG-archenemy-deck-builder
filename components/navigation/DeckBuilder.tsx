import { useLoadAPIData } from "@/hooks/useLoadAPIData";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { ScryfallCard } from "@scryfall/api-types";
import { useEffect, useState } from "react";
import { ActivityIndicator, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import Card from "../card/Card";
import NewDeck from "../decks/NewDeck";
import ErrorModal from "@/modals/ErrorModal";

const STORAGE_KEY = "@scryfall_cards";
const ARCHENEMEY_SCHEME_CARD_TOTAL_COUNT = 10;

const DeckBuilder: React.FC = () => {
  const [cards, setCards] = useState<ScryfallCard.Scheme[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [displayedCards, setDisplayedCards] = useState<ScryfallCard.Scheme[]>([]);

  // checks if card data exists in local storage. If not, send API request and cache it.
  const data = useLoadAPIData(
    STORAGE_KEY,
    "https://api.scryfall.com/cards/search?q=s%3Aoarc",
    setError,
    setLoading
  );

  // Update cards only when data changes
  useEffect(() => {
    if (data.length > 0) {
      setCards(data);
    }
  }, [data]); // Run this effect only when `data` changes

  // displayes 1 card per set interval.
  useEffect(() => {
    let count = 0;
    setDisplayedCards([]);
    const intervalId = setInterval(() => {
      if (count < Math.min(cards.length, ARCHENEMEY_SCHEME_CARD_TOTAL_COUNT)) {
        setDisplayedCards((prevCards) => [...prevCards, cards[count]]);
        count++;
      } else {
        clearInterval(intervalId); // Stop the interval after displaying cards
      }
    }, 300); // 0.3 second interval per card. CHANGE THIS FOR QUICKER / SLOWER LOAD

    return () => clearInterval(intervalId); // Cleanup on component unmount
  }, [cards]); // Trigger this effect when `cards` changes

  if (loading) {
    return <ActivityIndicator size="large" color="#FFFFFF" />;
  }

  if (error) {
    return <ErrorModal errorMessage={error} />;
  }

  return (
    <ScrollView style={styles.scrollContainer}>
      <Pressable
        style={styles.clearCacheButton}
        onPress={() => {
          AsyncStorage.removeItem(STORAGE_KEY);
        }}
      >
        <Text style={styles.clearCacheButtonText}>CLEAR CACHE</Text>
      </Pressable>

      <NewDeck />
      <View style={styles.container}>
        {displayedCards.map((el) => (
          <Card key={el.name} card={el} size={"normal"} isOpacityControlled={true} />
        ))}
      </View>
    </ScrollView>
  );
};

export default DeckBuilder;

const styles = StyleSheet.create({
  clearCacheButton: {
    width: 140,
    height: 40,
    maxHeight: 40,
    borderWidth: 2,
    alignSelf: "center",
    marginTop: 40,
    borderColor: "gold",
    backgroundColor: "gold",
    borderRadius: 10,
  },
  clearCacheButtonText: {
    fontSize: 15,
    color: "black",
    fontWeight: "bold",
    textAlign: "center",
    lineHeight: 35,
  },
  scrollContainer: { flex: 1 },
  container: {
    flex: 1,
    flexDirection: "row",
    flexWrap: "wrap",
    alignItems: "center",
    justifyContent: "space-evenly",
    marginTop: 40,
  },
});
