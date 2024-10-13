import { ActivityIndicator, StyleSheet, View, Text } from "react-native";
import { cardList } from "@/constants/CardList";
import Card from "../Card";
import { useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

const STORAGE_KEY = "@scryfall_cards";

const DeckBuilder: React.FC = () => {
  const [cards, setCards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCards = async () => {
      try {
        const cachedCards = await AsyncStorage.getItem(STORAGE_KEY);
        if (cachedCards) {
          // If cached data exists, use it
          setCards(JSON.parse(cachedCards));
        } else {
          // Fetch data from the API if no cached data
          console.log("i fired API");
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
        // TODO: fix error type
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchCards();
  }, []);

  if (loading) {
    return <ActivityIndicator size="large" color="#FFFFFF" />;
  }

  if (error) {
    return <Text>Error: {error}</Text>;
  }

  console.log(cards);

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      flexDirection: "row",
      flexWrap: "wrap",
      alignItems: "center",
    },
  });
  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" color="#FFD700" />
      {cardList.map((el) => (
        <Card key={el.name} card={el} />
      ))}
    </View>
  );
};

export default DeckBuilder;
