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
      borderWidth: existsInDeck && border ? 2 : undefined,
      borderColor: existsInDeck && border ? defaultColors.border : undefined,
    },
    cardIsSelected: {
      width: 335,
      height: 490,
      opacity: 1,
    },
    operatorButtonContainer: {
      position: "absolute",
    },
    operatorButton: {
      marginLeft: 20,
      marginBottom: 20,
      backgroundColor: "rgba(0, 0, 0, 0.55)",
      paddingHorizontal: 5,
      borderBottomLeftRadius: 20,
    },
  });

  return (
    <CustomModal visible={isSelected} setVisible={setIsSelected} transparentBackground={true}>
      <Pressable onPress={() => setIsSelected(false)}>
        <View style={styles.imageContainer}>
          <Image
            style={[styles.card, styles.cardIsSelected]}
            source={card.image_uris?.border_crop}
            contentFit="contain"
          />
          <Pressable style={styles.operatorButtonContainer} onPress={() => addRemoveCardToDeck()}>
            {showAddRemoveOperator && (
              <FontAwesome
                name={displayPlusMinusCardButton === "plus" ? "plus" : "minus"} // does not work on its own..
                size={45}
                color={!existsInDeck ? defaultColors.green : "red"}
                style={styles.operatorButton}
              />
            )}
          </Pressable>
        </View>
      </Pressable>
    </CustomModal>
  );
};

export default SelectedCardModal;
