import { ScryfallCard } from "@scryfall/api-types";
import { Fragment, useState } from "react";
import { ActivityIndicator, FlatList, StyleSheet, View, Text } from "react-native";
import Card from "../card/Card";
import NewDeck from "../decks/NewDeck";
import ErrorModal from "../modals/specific-modals/ErrorModal";
import { API_DATA_STORAGE_KEY, MINIMUM_CARDS_IN_NEW_DECK } from "@/constants/values";
import { useCardStore, useNewDeckStore } from "@/store/store";
import CustomButton from "../button/CustomButton";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Filter from "../card/Filter";
import { Image } from "expo-image";
import { globalStyles } from "@/constants/styles";
import { defaultColors } from "@/constants/Colors";

const DeckBuilder: React.FC = () => {
  const { cardsInNewDeck, addCardToNewDeck, removeCardFromNewDeck } = useNewDeckStore();
  const { cardsInStore, error } = useCardStore();
  const [displayedCards, setDisplayedCards] = useState<ScryfallCard.Scheme[]>([]);

  if (error) {
    return <ErrorModal errorMessage={error} />;
  }

  const styles = StyleSheet.create({
    text: {
      color: cardsInNewDeck.length < MINIMUM_CARDS_IN_NEW_DECK ? defaultColors.red : "#42b883",
      fontSize: 18,
      margin: 0,
      padding: 0,
    },
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
    scrollContainer: { flex: 1, marginVertical: 20 },
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

  const headerComponent = (
    <Fragment>
      <CustomButton
        text="Clear cache"
        onPress={() => {
          AsyncStorage.removeItem(API_DATA_STORAGE_KEY);
          const clearDiskCache = async () => {
            await Image.clearDiskCache();
          };
          clearDiskCache();
        }}
        type="neutral"
      />
      <NewDeck />
      <Filter cards={cardsInStore} setDisplayedCards={setDisplayedCards} />
    </Fragment>
  );

  return (
    <View style={styles.scrollContainer}>
      <Text style={[globalStyles.text, styles.text]}>
        {cardsInNewDeck.length}/{MINIMUM_CARDS_IN_NEW_DECK}
      </Text>
      <FlatList
        ListHeaderComponent={headerComponent}
        data={displayedCards}
        renderItem={renderItem}
        keyExtractor={(item) => item.name} // Assuming `name` is unique
        numColumns={2} // This sets the number of columns to 2
        initialNumToRender={4} // Reduce the number of items to render initially
        windowSize={5}
        maxToRenderPerBatch={4}
      />
    </View>
  );
};

export default DeckBuilder;
