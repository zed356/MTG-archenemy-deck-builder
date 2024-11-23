import CustomButton from "@/components/button/CustomButton";
import Card from "@/components/card/Card";
import Filter from "@/components/card/filter/Filter";
import PulseWrapper from "@/components/style-elements/PulseWrapper";
import TabsIcon from "@/components/style-elements/TabsIcon";
import { defaultColors } from "@/constants/Colors";
import { defaultBorderRadius } from "@/constants/styles";
import { MAX_DECK_NAME_LENGTH, MINIMUM_CARDS_IN_NEW_DECK } from "@/constants/values";
import { SavedDeck, useCardStore } from "@/store/store";
import { ScryfallCard } from "@scryfall/api-types";
import { useEffect, useState } from "react";
import { StyleSheet, Text, TextInput, View } from "react-native";
import CustomModal from "../CustomModal";
import { LinearGradient } from "expo-linear-gradient";

interface InputProps {
  modalVisible: boolean;
  setVisible: (value: boolean) => void;
  deck: SavedDeck | null;
  updateDeck: (deck: SavedDeck, newDeckName?: string) => void;
  selectDeckForPlay: (deck: SavedDeck) => void;
}

const SavedDeckModal: React.FC<InputProps> = ({
  modalVisible,
  deck,
  setVisible,
  updateDeck,
  selectDeckForPlay,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [newDeckName, setNewDeckName] = useState<string>("");
  const { cardsInStore } = useCardStore();
  const [deckAfterSaveEdit, setDeckAfterSaveEdit] = useState<SavedDeck | null>(null);
  const [deepCopyOfDeck, setDeepCopyOfDeck] = useState<SavedDeck>(JSON.parse(JSON.stringify(deck)));
  const [displayedCards, setDisplayedCards] = useState<ScryfallCard.Scheme[]>(cardsInStore);
  const [deckCardNames, setDeckCardNames] = useState<Set<string>>(new Set());
  const [filteredCards, setFilteredCards] = useState<ScryfallCard.Scheme[]>(cardsInStore);

  const cardsInDeck: number = deepCopyOfDeck ? deepCopyOfDeck.cards.length : 0;
  const correctAmountOfCardsInDeck: boolean = cardsInDeck
    ? cardsInDeck >= MINIMUM_CARDS_IN_NEW_DECK
    : false;

  useEffect(() => {
    if (!deepCopyOfDeck) return;

    const namesOfCardInDeck = new Set(deepCopyOfDeck.cards.map((el) => el.name));
    const namesOfFilteredCards = new Set(filteredCards.map((el) => el.name));
    setDeckCardNames(namesOfCardInDeck);

    // Separate existing and new cards
    const newCards = filteredCards.filter((card) => !namesOfCardInDeck.has(card.name));
    const existingCards = deepCopyOfDeck.cards;
    const fullDeck = [...existingCards, ...newCards];

    // Combine existing and new cards, with new cards appended at the end
    setDisplayedCards(fullDeck.filter((el) => (namesOfFilteredCards.has(el.name) ? el : null)));
  }, [deepCopyOfDeck, cardsInStore, isEditing, filteredCards]);

  const resetDeepCopyOfDeck = () => {
    setDeepCopyOfDeck(JSON.parse(JSON.stringify(deck)));
  };

  const resetDisplayedCards = () => {
    setDisplayedCards(cardsInStore);
  };

  const handleAddCardToDeckWhileEditing = (card: ScryfallCard.Scheme) => {
    setDeepCopyOfDeck((prev) => {
      return { ...prev, cards: [...prev.cards, card] };
    });
  };

  const handleRemoveCardFromDeckWhileEditing = (card: ScryfallCard.Scheme) => {
    setDeepCopyOfDeck((prev) => {
      return {
        ...prev,
        cards: prev.cards.filter((el) => el.name !== card.name),
      };
    });
  };

  const handleSaveEdit = () => {
    updateDeck(deepCopyOfDeck, newDeckName);
    setDeckAfterSaveEdit(deepCopyOfDeck);
    setFilteredCards(cardsInStore);
    setIsEditing(false);
  };

  const calcCorrectTextColor = () => {
    if (isEditing && correctAmountOfCardsInDeck) {
      return defaultColors.green;
    }
    if (isEditing && !correctAmountOfCardsInDeck) {
      return defaultColors.red;
    }
    return defaultColors.gold;
  };

  const styles = StyleSheet.create({
    buttonContainer: {
      flexDirection: "row",
      width: "100%",
      position: "relative",
      justifyContent: "space-between",
      alignItems: "center",
    },
    cardCountTextContainer: {
      marginVertical: 5,
      padding: 5,
      flexDirection: "row",
      alignItems: "center",
      alignSelf: "center",
    },
    cardCountText: {
      paddingLeft: 15, // impossible to center text. its always a bit off to the left.
      color: calcCorrectTextColor(),
      fontSize: 25,
    },
    modalInput: {
      borderWidth: 1,
      opacity: 0.8,
      borderRadius: defaultBorderRadius,
      borderColor: defaultColors.grey,
      width: "96%",
      textAlign: "center",
      fontFamily: "Beleren",
      color: defaultColors.gold,
      fontSize: 20,
      marginBottom: 5,
      padding: 5,
    },
    filterContainer: {
      width: "96%",
      marginBottom: 10,
    },
    deckContainer: {
      flexDirection: "row",
      flexWrap: "wrap",
      justifyContent: "center",
    },
    cardContainer: {
      marginHorizontal: 2,
    },
  });

  const content = deck != null && (
    <CustomModal visible={modalVisible} setVisible={setVisible} scrollEnabled={true}>
      <>
        <View style={styles.buttonContainer}>
          {!isEditing && (
            <CustomButton type="neutral" text="EDIT" onPress={() => setIsEditing(true)} />
          )}
          {isEditing && (
            <CustomButton
              type="positive"
              text="SAVE"
              onPress={handleSaveEdit}
              disabled={!correctAmountOfCardsInDeck}
            />
          )}
          <CustomButton
            type="positive"
            text="PLAY"
            onPress={() => {
              selectDeckForPlay && selectDeckForPlay(deepCopyOfDeck);
            }}
            disabled={isEditing}
          />
          <CustomButton
            type="negative"
            text={isEditing ? "CANCEL" : "CLOSE"}
            onPress={() => {
              setNewDeckName("");
              resetDisplayedCards();
              if (isEditing) {
                if (deckAfterSaveEdit) {
                  setDeepCopyOfDeck(deckAfterSaveEdit);
                } else {
                  resetDeepCopyOfDeck();
                }
                setIsEditing(false);
              } else {
                setVisible(false);
              }
            }}
          />
        </View>
        <PulseWrapper pulseEffectOnValueChange={cardsInDeck}>
          <View style={styles.cardCountTextContainer}>
            <Text style={styles.cardCountText}>
              {`${cardsInDeck}${isEditing ? ` / ${MINIMUM_CARDS_IN_NEW_DECK}` : ""}`}{" "}
            </Text>
            <TabsIcon
              source={require("./../../../assets/tab-icons/cards-icon.svg")}
              color={calcCorrectTextColor()}
            />
            <View style={{ marginHorizontal: 4 }}></View>
          </View>
        </PulseWrapper>
        <TextInput
          style={styles.modalInput}
          value={newDeckName || deck.deckName || ""}
          multiline={true}
          maxLength={MAX_DECK_NAME_LENGTH}
          autoCorrect={false}
          onChangeText={setNewDeckName}
          editable={isEditing}
          onChange={() => {}}
        />
        {isEditing && (
          <View style={styles.filterContainer}>
            <Filter
              cards={cardsInStore}
              setFilteredCards={setFilteredCards}
              filterIconInactiveColor="white"
            />
          </View>
        )}
        <View style={styles.deckContainer}>
          {displayedCards.map((card) => {
            if (deckCardNames.has(card.name) || isEditing) {
              return (
                <View key={card.name} style={styles.cardContainer}>
                  <Card
                    card={card}
                    size="small"
                    showAddRemoveOperator={isEditing}
                    border={false}
                    isOpacityControlled={isEditing}
                    existsInDeck={deckCardNames.has(card.name)}
                    addToDeck={handleAddCardToDeckWhileEditing}
                    removeFromDeck={handleRemoveCardFromDeckWhileEditing}
                  />
                </View>
              );
            }
            return null;
          })}
        </View>
      </>
    </CustomModal>
  );

  return <>{content}</>;
};

export default SavedDeckModal;
