import { ScryfallCard } from "@scryfall/api-types";
import { useEffect, useState } from "react";
import { ActivityIndicator, FlatList, ScrollView, StyleSheet, View } from "react-native";
import Card from "../card/Card";
import NewDeck from "../decks/NewDeck";
import ErrorModal from "../modals/specific-modals/ErrorModal";
import { ARCHENEMEY_SCHEME_CARD_TOTAL_COUNT } from "@/constants/values";
import { useCardStore, useNewDeckStore } from "@/store/store";

const DeckBuilder: React.FC = () => {
  const { cardsInStore, loadCardsIntoStore, loading, error } = useCardStore();
  const [displayedCards, setDisplayedCards] = useState<ScryfallCard.Scheme[]>([]);

  const { cardsInNewDeck, addCardToNewDeck, removeCardFromNewDeck, clearNewDeck } =
    useNewDeckStore();

  // displayes 1 card per set interval.
  useEffect(() => {
    let count = 0;
    setDisplayedCards([]);
    const intervalId = setInterval(() => {
      if (count < Math.min(cardsInStore.length, ARCHENEMEY_SCHEME_CARD_TOTAL_COUNT)) {
        setDisplayedCards((prevCards) => [...prevCards, cardsInStore[count]]);
        count++;
      } else {
        clearInterval(intervalId); // Stop the interval after displaying cards
      }
    }, 300); // 0.3 second interval per card. CHANGE THIS FOR QUICKER / SLOWER LOAD

    return () => clearInterval(intervalId); // Cleanup on component unmount
  }, [cardsInStore]); // Trigger this effect when `cards` changes

  if (loading) {
    return <ActivityIndicator size="large" color="#FFFFFF" />;
  }

  if (error) {
    return <ErrorModal errorMessage={error} />;
  }

  const renderItem = ({ item }: { item: ScryfallCard.Scheme }) => (
    <View style={styles.cardWrapper}>
      <Card
        card={item}
        size={"normal"}
        isOpacityControlled={true}
        showAddRemoveOperator={true}
        addToDeck={() => addCardToNewDeck(item)}
        removeFromDeck={() => removeCardFromNewDeck(item)}
        existsInDeck={cardsInNewDeck.some((card) => card.name === item.name)} // Check if the card exists in the new deck
        showLoadingSpinner={true}
      />
    </View>
  );

  return (
    <View style={styles.scrollContainer}>
      <FlatList
        ListHeaderComponent={<NewDeck />}
        data={displayedCards}
        renderItem={renderItem}
        keyExtractor={(item) => item.name} // Assuming `name` is unique
        numColumns={2} // This sets the number of columns to 2
        initialNumToRender={4} // Reduce the number of items to render initially
        windowSize={5}
        maxToRenderPerBatch={4}
      />
    </View>
    // <ScrollView style={styles.scrollContainer}>
    //   <NewDeck />
    //   <View style={styles.container}>
    //     {displayedCards.map((el) => (
    //       <View style={styles.cardWrapper} key={el.name}>
    //         <Card
    //           card={el}
    //           size={"normal"}
    //           isOpacityControlled={true}
    //           showAddRemoveOperator={true}
    //           addToDeck={() => addCardToNewDeck(el)}
    //           removeFromDeck={() => removeCardFromNewDeck(el)}
    //           existsInDeck={cardsInNewDeck.find((card) => card.name === el.name) ? true : false}
    //           showLoadingSpinner={true}
    //         />
    //       </View>
    //     ))}
    //   </View>
    // </ScrollView>
  );
};

export default DeckBuilder;

// const styles = StyleSheet.create({
//   clearCacheButton: {
//     width: 140,
//     height: 40,
//     maxHeight: 40,
//     borderWidth: 2,
//     alignSelf: "center",
//     marginTop: 40,
//     borderColor: "gold",
//     backgroundColor: "gold",
//     borderRadius: 10,
//   },
//   clearCacheButtonText: {
//     fontSize: 15,
//     color: "black",
//     fontWeight: "bold",
//     textAlign: "center",
//     lineHeight: 35,
//   },
//   scrollContainer: { flex: 1, marginTop: 70 },
//   container: {
//     flex: 1,
//     flexDirection: "row",
//     // flexWrap: "wrap",
//     alignItems: "center",
//     justifyContent: "space-evenly",
//     marginTop: 10,
//   },
//   cardWrapper: {
//     marginVertical: 10,
//   },
// });

// ------------------------------------------------------------

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
  scrollContainer: { flex: 1, marginVertical: 70 },
  container: {
    flex: 1,
    justifyContent: "space-evenly",
    marginTop: 10,
  },
  cardWrapper: {
    flex: 1,
    marginVertical: 10,
    marginHorizontal: 5, // Add some horizontal margin for spacing
    alignItems: "center", // Center the columns
  },
  columnWrapper: {
    justifyContent: "space-between", // Optional: to evenly space columns
  },
});
