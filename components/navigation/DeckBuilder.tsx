import { ActivityIndicator, StyleSheet, View, Text, ScrollView, Pressable } from "react-native";
import Card from "../Card";
import { useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { ScryfallCard } from "@scryfall/api-types";

const STORAGE_KEY = "@scryfall_cards";
const ARCHENEMEY_SCHEME_CARD_TOTAL_COUNT = 10;

const DeckBuilder: React.FC = () => {
  const [cards, setCards] = useState<ScryfallCard.Scheme[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [displayedCards, setDisplayedCards] = useState<ScryfallCard.Scheme[]>([]);

  useEffect(() => {
    const fetchCards = async () => {
      try {
        const cachedCards = await AsyncStorage.getItem(STORAGE_KEY);
        if (cachedCards) {
          // Use cached data
          setCards(JSON.parse(cachedCards));
        } else {
          // Fetch data from API if no cached data
          const response = await fetch("https://api.scryfall.com/cards/search?q=s%3Aoarc");
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
    }, 1000); // 1 second interval

    return () => clearInterval(intervalId); // Cleanup on component unmount
  }, [cards]); // Trigger this effect when `cards` changes

  if (loading) {
    return <ActivityIndicator size="large" color="#FFFFFF" />;
  }

  if (error) {
    return <Text>Error: {error}</Text>;
  }

  return (
    <ScrollView style={styles.scrollContainer}>
      <View style={styles.container}>
        <Pressable
          style={styles.clearCacheButton}
          onPress={() => {
            console.log("cache clearedeedd");
            AsyncStorage.clear();
          }}
        >
          <Text>CLEAR CACHE</Text>
        </Pressable>
        {displayedCards.map((el) => (
          <Card key={el.name} card={el} />
        ))}
      </View>
    </ScrollView>
  );
};

export default DeckBuilder;

const styles = StyleSheet.create({
  clearCacheButton: {
    borderWidth: 2,
    width: 100,
    borderColor: "gold",
    color: "white",
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
