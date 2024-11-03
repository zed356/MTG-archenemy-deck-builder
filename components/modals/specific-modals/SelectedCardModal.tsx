import CustomButton from "@/components/button/CustomButton";
import { defaultColors } from "@/constants/Colors";
import { FontAwesome } from "@expo/vector-icons";
import { ScryfallCard } from "@scryfall/api-types";
import { Image } from "expo-image";
import { Pressable, StyleSheet, View } from "react-native";
import CustomModal from "../CustomModal";

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
  displayDiscardButtonInsteadOfOperator?: boolean;
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
  displayDiscardButtonInsteadOfOperator,
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
      paddingLeft: 5,
      borderBottomLeftRadius: 20,
    },
  });

  return (
    <CustomModal
      visible={isSelected}
      setVisible={setIsSelected}
      transparentBackground={true}
    >
      <Pressable onPress={() => setIsSelected(false)}>
        <View style={styles.imageContainer}>
          <Image
            style={[styles.card, styles.cardIsSelected]}
            source={card.image_uris?.border_crop}
            contentFit="contain"
          />
          <Pressable
            style={styles.operatorButtonContainer}
            onPress={() => addRemoveCardToDeck()}
          >
            {showAddRemoveOperator &&
              !displayDiscardButtonInsteadOfOperator && (
                <FontAwesome
                  name={
                    displayPlusMinusCardButton === "plus" ? "plus" : "minus"
                  } // does not work on its own..
                  size={45}
                  color={!existsInDeck ? defaultColors.green : "red"}
                  style={styles.operatorButton}
                />
              )}
          </Pressable>
        </View>
        {displayDiscardButtonInsteadOfOperator && (
          <CustomButton
            type="negative"
            text="Discard"
            onPress={() => addRemoveCardToDeck()}
          />
        )}
      </Pressable>
    </CustomModal>
  );
};

export default SelectedCardModal;
