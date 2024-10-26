import { defaultColors } from "@/constants/Colors";
import { ScryfallCard } from "@scryfall/api-types";
import { View, Pressable, StyleSheet, Text } from "react-native";
import { Image } from "expo-image";
import CustomModal from "../CustomModal";
import { FontAwesome } from "@expo/vector-icons";

interface InputProps {
  card: ScryfallCard.Scheme;
  isSelected: boolean;
  existsInDeck: boolean;
  border?: boolean;
  setIsSelected: (isSelected: boolean) => void;
  cardSize?: { width: number; height: number };
  operatorSize?: { fontSize: number };
  showAddRemoveOperator: boolean;
  displayPlusMinusCardButton: string;
  addRemoveCardToDeck: () => void;
}

const SelectedCardModal: React.FC<InputProps> = ({
  card,
  isSelected,
  existsInDeck,
  setIsSelected,
  cardSize,
  operatorSize,
  border,
  displayPlusMinusCardButton,
  showAddRemoveOperator,
  addRemoveCardToDeck,
}) => {
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
    },
    cardIsSelected: {
      borderRadius: 20,
      width: 350,
      height: 500,
      opacity: 1,
    },
    plusButton: {
      position: "absolute",
      backgroundColor: "rgba(0, 0, 0, 0.65)",
      borderRadius: 8,
    },
  });

  return (
    <CustomModal visible={isSelected} setVisible={setIsSelected} transparentBackground={true}>
      <Pressable onPress={() => setIsSelected(false)}>
        <View style={styles.imageContainer}>
          <Image
            style={[styles.card, styles.cardIsSelected]}
            source={
              typeof card.image_uris!.normal === "string"
                ? { uri: card.image_uris!.normal }
                : card.image_uris!.normal
            }
            contentFit="contain"
          />
          <Pressable style={styles.plusButton} onPress={() => addRemoveCardToDeck()}>
            {showAddRemoveOperator && (
              <FontAwesome
                name={displayPlusMinusCardButton === "plus" ? "plus" : "minus"} // does not work on its own..
                size={45}
                color={!existsInDeck ? defaultColors.green : "red"}
                style={{ borderRadius: 20 }}
              />
            )}
          </Pressable>
        </View>
      </Pressable>
    </CustomModal>
  );
};

export default SelectedCardModal;
