import { defaultColors } from "@/constants/Colors";
import { ScryfallCard } from "@scryfall/api-types";
import { Image } from "expo-image";
import React, { Fragment, useState } from "react";
import { ActivityIndicator, Pressable, StyleSheet, Text, View } from "react-native";
import SelectedCardModal from "../modals//specific-modals/SelectedCardModal";
import { FontAwesome } from "@expo/vector-icons";

interface InputProps {
  card: ScryfallCard.Scheme;
  size: "small" | "normal" | "large";
  border?: boolean;
  existsInDeck: boolean;
  isOpacityControlled: boolean;
  showAddRemoveOperator: boolean;
  addToDeck?: (card: ScryfallCard.Scheme) => void;
  removeFromDeck?: (card: ScryfallCard.Scheme) => void;
}

const Card: React.FC<InputProps> = ({
  card,
  size,
  existsInDeck,
  border = true,
  isOpacityControlled,
  showAddRemoveOperator,
  addToDeck,
  removeFromDeck,
}) => {
  const [loading, setLoading] = useState(false);
  const [isSelected, setIsSelected] = useState(false);

  const displayPlusMinusCardButton = !existsInDeck ? "plus" : "minus";

  let cardSize;
  let operatorSize;
  if (size == "small") {
    cardSize = { width: 100, height: 150 };
    operatorSize = { fontSize: 20 };
  } else if (size == "normal") {
    cardSize = { width: 160, height: 230 };
    operatorSize = { fontSize: 25 };
  } else if (size == "large") {
    cardSize = { width: 350, height: 500 };
    operatorSize = { fontSize: 30 };
  }

  const handleImageLoadEnd = () => {
    // TODO: creates a 'bump' effect when adding a card to the newDeck.
    // Due to loading spinner most likely.
    // create options prop for card component to disable loading spinner + other configs
    // setLoading(false);
  };

  const handleAddRemoveCardToNewDeck = () => {
    if (existsInDeck && removeFromDeck) {
      removeFromDeck(card);
      setIsSelected(false);
    } else if (!existsInDeck && addToDeck) {
      addToDeck(card);
      setIsSelected(false);
    }
  };

  const styles = StyleSheet.create({
    imageContainer: {
      position: "relative",
      alignItems: "flex-end",
    },
    card: {
      width: cardSize?.width,
      height: cardSize?.height,
      borderRadius: 11,
      marginBottom: 5,
      borderWidth: existsInDeck && border ? 2 : undefined,
      borderColor: existsInDeck && border ? defaultColors.border : undefined,
      opacity: existsInDeck && isOpacityControlled ? 0.4 : 1,
      // backgroundColor: "rgba(22, 22, 1, 10)", // Optional: Add a semi-transparent background
    },
    plusButton: {
      position: "absolute",
      backgroundColor: "rgba(0, 0, 0, 0.65)",
      borderRadius: 8,
    },
  });

  return (
    <Fragment>
      <Pressable onPress={() => setIsSelected((oldState) => !oldState)}>
        {loading && <ActivityIndicator size="large" color="#FFD700" />}
        <View style={styles.imageContainer}>
          <Image
            style={styles.card}
            source={
              typeof card.image_uris!.normal === "string"
                ? { uri: card.image_uris!.normal }
                : card.image_uris!.normal
            }
            contentFit="contain"
            transition={500}
            onError={() => {
              console.log("Error loading image: " + card.image_uris!.normal);
            }}
            onLoadEnd={handleImageLoadEnd}
          />
          <Pressable style={[styles.plusButton]} onPress={handleAddRemoveCardToNewDeck}>
            {showAddRemoveOperator && (
              <FontAwesome
                name={displayPlusMinusCardButton}
                size={operatorSize?.fontSize}
                color={!existsInDeck ? defaultColors.green : "red"}
              />
            )}
          </Pressable>
        </View>
      </Pressable>
      <SelectedCardModal
        card={card}
        existsInDeck={existsInDeck}
        isSelected={isSelected}
        setIsSelected={setIsSelected}
        showAddRemoveOperator={showAddRemoveOperator}
        addRemoveCardToDeck={handleAddRemoveCardToNewDeck}
        displayPlusMinusCardButton={displayPlusMinusCardButton}
      />
    </Fragment>
  );
};

export default Card;
