import { defaultColors } from "@/constants/Colors";
import { ScryfallCard } from "@scryfall/api-types";
import { Image } from "expo-image";
import React, { Fragment, useState } from "react";
import { ActivityIndicator, Dimensions, Pressable, StyleSheet, View } from "react-native";
import SelectedCardModal from "../modals//specific-modals/SelectedCardModal";
import { FontAwesome } from "@expo/vector-icons";

interface InputProps {
  card: ScryfallCard.Scheme;
  size: "small" | "normal" | "large";
  border?: boolean;
  existsInDeck: boolean;
  showLoadingSpinner?: boolean;
  showAddRemoveOperator: boolean;
  isOpacityControlled: boolean;
  isInPlayDeck?: boolean;
  alignFlexEnd?: boolean;
  showAddRemoveOperatorOnSelectedCard?: boolean;
  position?: "relative" | "absolute" | "static";
  addToDeck?: (card: ScryfallCard.Scheme) => void;
  removeFromDeck?: (card: ScryfallCard.Scheme) => void;
  onCardInPlayPress?: () => void;
}

const Card: React.FC<InputProps> = ({
  card,
  size,
  existsInDeck,
  showLoadingSpinner = false,
  isInPlayDeck = false,
  position = "static",
  border = true,
  isOpacityControlled,
  showAddRemoveOperator,
  alignFlexEnd = true,
  showAddRemoveOperatorOnSelectedCard = false,
  addToDeck,
  removeFromDeck,
  onCardInPlayPress,
}) => {
  const [loading, setLoading] = useState(true);
  const [isSelected, setIsSelected] = useState(false);

  const blurhash =
    "|rF?hV%2WCj[ayj[a|j[az_NaeWBj@ayfRayfQfQM{M|azj[azf6fQfQfQIpWXofj[ayj[j[fQayWCoeoeaya}j[ayfQa{oLj?j[WVj[ayayj[fQoff7azayj[ayj[j[ayofayayayj[fQj[ayayj[ayfjj[j[ayjuayj[";

  const displayPlusMinusCardButton = !existsInDeck ? "plus" : "minus";
  const { width, height } = Dimensions.get("window");

  let cardSize;
  let operatorSize;
  if (size == "small") {
    cardSize = { width: 100, height: 150 };
    operatorSize = { fontSize: 20 };
  } else if (size == "normal") {
    cardSize = { width: 160, height: 230 };
    operatorSize = { fontSize: 25 };
  } else if (size == "large") {
    cardSize = { width: width * 0.9, height: height * 0.625 };
    operatorSize = { fontSize: 30 };
  }

  const handleImageLoadEnd = () => {
    // TODO: creates a 'bump' effect when adding a card to the newDeck.
    // Due to loading spinner most likely.
    // create options prop for card component to disable loading spinner + other configs
    setLoading(false);
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
      position: position,
      alignItems: alignFlexEnd ? "flex-end" : "baseline",
    },
    isInPlayDeckStyle: {
      top: "0%",
      left: "50%",
      transform: [{ translateX: -cardSize!.width / 2 }, { translateY: cardSize!.height / 2 }],
    },
    card: {
      width: cardSize?.width,
      height: cardSize?.height,
      borderWidth: existsInDeck && border ? 2 : undefined,
      borderColor: existsInDeck && border ? defaultColors.border : undefined,
      opacity: existsInDeck && isOpacityControlled ? 0.4 : 1,
    },
    operatorButtonContainer: {
      position: "absolute",
    },
    operatorButton: {
      marginLeft: 20,
      marginBottom: 20,
      backgroundColor: "rgba(0, 0, 0, 0.55)",
      paddingHorizontal: 4,
      borderBottomLeftRadius: 13,
    },
    loadingSpinner: {
      position: "absolute", // To position it over the image
      top: "50%",
      left: "50%",
      transform: [{ translateX: -25 }, { translateY: -25 }], // Adjust this based on the spinner size
    },
  });

  return (
    <Fragment>
      <View style={[styles.imageContainer, isInPlayDeck && styles.isInPlayDeckStyle]}>
        {loading && showLoadingSpinner && (
          <ActivityIndicator style={styles.loadingSpinner} size="large" color="#FFD700" />
        )}
        <Pressable
          onPress={() => {
            if (onCardInPlayPress) {
              onCardInPlayPress();
            } else {
              setIsSelected((oldState) => !oldState);
            }
          }}
        >
          <Image
            style={styles.card}
            source={card.image_uris?.border_crop}
            placeholder={blurhash}
            contentFit="contain"
            onLoadStart={() => setLoading(true)} // Set loading to true when the image starts loading
            onLoadEnd={handleImageLoadEnd} // Handle when the image loading ends
            onError={() => {
              console.log("Error loading image: " + card.image_uris?.normal);
              setLoading(false); // Ensure loading is set to false on error as well
            }}
          />
        </Pressable>
        <Pressable style={styles.operatorButtonContainer} onPress={handleAddRemoveCardToNewDeck}>
          {showAddRemoveOperator && (
            <FontAwesome
              name={displayPlusMinusCardButton}
              size={operatorSize?.fontSize}
              color={!existsInDeck ? defaultColors.green : "red"}
              style={styles.operatorButton}
            />
          )}
        </Pressable>
      </View>
      <SelectedCardModal
        card={card}
        existsInDeck={existsInDeck}
        isSelected={isSelected && !isInPlayDeck}
        setIsSelected={setIsSelected}
        showAddRemoveOperator={showAddRemoveOperator || showAddRemoveOperatorOnSelectedCard}
        addRemoveCardToDeck={handleAddRemoveCardToNewDeck}
        displayPlusMinusCardButton={displayPlusMinusCardButton}
      />
    </Fragment>
  );
};

export default Card;
