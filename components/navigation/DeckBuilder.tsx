import { defaultColors } from "@/constants/Colors";
import { globalStyles } from "@/constants/styles";
import { MINIMUM_CARDS_IN_NEW_DECK } from "@/constants/values";
import { useCardStore, useNewDeckStore } from "@/store/store";
import { ScryfallCard } from "@scryfall/api-types";
import { Fragment, useState } from "react";
import { FlatList, StyleSheet, Text, View } from "react-native";
import Card from "../card/Card";
import Filter from "../card/Filter";
import NewDeck from "../decks/NewDeck";
import ErrorModal from "../modals/specific-modals/ErrorModal";
import PulseWrapper from "../style-elements/PulseWrapper";

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
      paddingBottom: 5,
    },
    scrollContainer: { flex: 1, marginVertical: 30 },
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
      <NewDeck />
      <Filter cards={cardsInStore} setFilteredCards={setDisplayedCards} />
    </Fragment>
  );

  return (
    <View style={styles.scrollContainer}>
      <PulseWrapper count={cardsInNewDeck.length}>
        <Text style={[globalStyles.text, styles.text]}>
          {cardsInNewDeck.length}/{MINIMUM_CARDS_IN_NEW_DECK}
        </Text>
      </PulseWrapper>
      <FlatList
        ListHeaderComponent={headerComponent}
        data={displayedCards}
        renderItem={renderItem}
        keyExtractor={(item) => item.name} // Assuming `name` is unique
        numColumns={2} // This sets the number of columns to 2
        initialNumToRender={4} // Reduce the number of items to render initially
        windowSize={21}
        maxToRenderPerBatch={6}
        contentContainerStyle={{ flexGrow: 1 }}
        keyboardShouldPersistTaps="handled"
      />
    </View>
  );
};

export default DeckBuilder;
