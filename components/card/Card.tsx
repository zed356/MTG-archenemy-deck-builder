import { useNewDeckStore } from "@/store/store";
import { defaultColors } from "@/constants/Colors";
import { ScryfallCard } from "@scryfall/api-types";
import { Image } from "expo-image";
import { Fragment, useState } from "react";
import { ActivityIndicator, Modal, Pressable, StyleSheet, Text, View } from "react-native";

interface InputProps {
  card: ScryfallCard.Scheme;
  size: "small" | "normal" | "large";
  border?: boolean;
  isOpacityControlled?: boolean;
}

const Card: React.FC<InputProps> = ({ card, size, border = true, isOpacityControlled }) => {
  const [loading, setLoading] = useState(false);
  const [isSelected, setIsSelected] = useState(false);
  const { cardsInNewDeck, addCardToNewDeck, removeCardFromNewDeck } = useNewDeckStore();

  const existsInNewDeck = cardsInNewDeck.find((el) => el.name === card.name);
  const displayPlusMinusCardButton = !existsInNewDeck ? "+" : "-";

  let cardSize;
  let operatorSize;
  if (size == "small") {
    cardSize = { width: 100, height: 150 };
    operatorSize = { fontSize: 50 };
  } else if (size == "normal") {
    cardSize = { width: 160, height: 230 };
    operatorSize = { fontSize: 50 };
  } else if (size == "large") {
    cardSize = { width: 350, height: 500 };
    operatorSize = { fontSize: 80 };
  }

  const handleImageLoadEnd = () => {
    // TODO: creates a 'bump' effect when adding a card to the newDeck.
    // Due to loading spinner most likely.
    // create options prop for card component to disable loading spinner + other configs
    // setLoading(false);
  };

  const handleAddRemoveCardToNewDeck = () => {
    if (existsInNewDeck) {
      removeCardFromNewDeck(card);
      setIsSelected(false);
    } else if (!existsInNewDeck) {
      addCardToNewDeck(card);
      setIsSelected(false);
    }
  };

  const styles = StyleSheet.create({
    card: {
      width: cardSize?.width,
      height: cardSize?.height,
      borderRadius: 11,
      marginBottom: 5,
      borderWidth: existsInNewDeck && border ? 2 : 2,
      borderColor: existsInNewDeck && border ? defaultColors.border : undefined,
      opacity: existsInNewDeck && isOpacityControlled ? 0.25 : 1,
      // backgroundColor: "rgba(22, 22, 1, 10)", // Optional: Add a semi-transparent background
    },
    containerIsSelected: {
      top: "25%",
      left: "25%",
      backgroundColor: "rgba(128, 0, 128, 0.5)",
    },
    cardIsSelected: {
      borderRadius: 20,
      width: 350,
      height: 500,
      opacity: 1,
    },
    modalContainer: {
      flex: 1, // Make the modal take the full screen
      justifyContent: "center", // Center vertically
      alignItems: "center", // Center horizontally
      backgroundColor: "rgba(0, 0, 0, 0.5)", // Optional: Add a semi-transparent background
    },
    plusButton: {
      position: "absolute",
      // top: "50%", // Vertically centered
      right: 5,
      top: 5, // Pushed to the far right
      transform: [{ translateY: -42.5 }], // Half of font size (85 / 2)
    },
    operatorText: {
      position: "relative",
      fontSize: operatorSize?.fontSize,
      width: 30,
      textAlign: "center",
      color: !existsInNewDeck ? defaultColors.green : "red",
    },
  });

  return (
    <Fragment>
      <Pressable onPress={() => setIsSelected((oldState) => !oldState)}>
        {loading && <ActivityIndicator size="large" color="#FFD700" />}
        <View>
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
          <Pressable
            style={[styles.plusButton, { top: 25 }]}
            onPress={handleAddRemoveCardToNewDeck}
          >
            <Text style={styles.operatorText}>{displayPlusMinusCardButton}</Text>
          </Pressable>
        </View>
      </Pressable>
      <Modal visible={isSelected} animationType="slide" transparent={true}>
        <View style={styles.modalContainer}>
          <Pressable onPress={() => setIsSelected((oldState) => !oldState)}>
            {loading && <ActivityIndicator size="large" color="#FFD700" />}
            <View>
              <Image
                style={[styles.card, styles.cardIsSelected]}
                source={
                  typeof card.image_uris!.normal === "string"
                    ? { uri: card.image_uris!.normal }
                    : card.image_uris!.normal
                }
                contentFit="contain"
                onError={() => {
                  console.log("Error loading image: " + card.image_uris!.normal);
                }}
                onLoadEnd={handleImageLoadEnd}
              />
              <Pressable style={styles.plusButton} onPress={handleAddRemoveCardToNewDeck}>
                <Text style={[styles.operatorText, { fontSize: 85, right: 20, width: 30 }]}>
                  {displayPlusMinusCardButton}
                </Text>
              </Pressable>
            </View>
          </Pressable>
        </View>
      </Modal>
    </Fragment>
  );
};

export default Card;
