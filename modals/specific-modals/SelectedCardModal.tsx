import { defaultColors } from "@/constants/Colors";
import { ScryfallCard } from "@scryfall/api-types";
import { Modal, View, Pressable, StyleSheet, Text } from "react-native";
import { Image } from "expo-image";
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
    card: {
      width: cardSize?.width,
      height: cardSize?.height,
      borderRadius: 11,
      marginBottom: 5,
      borderWidth: existsInDeck && border ? 2 : undefined,
      borderColor: existsInDeck && border ? defaultColors.border : undefined,
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
      // backgroundColor: "rgba(0, 0, 0, 0.5)", // Optional: Add a semi-transparent background
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
      color: !existsInDeck ? defaultColors.green : "red",
    },
  });

  return (
    // <Modal visible={isSelected} animationType="slide" transparent={true}>
    //   <View style={styles.modalContainer}>
    //     <Pressable onPress={() => setIsSelected(false)}>
    //       {/* {loading && <ActivityIndicator size="large" color="#FFD700" />} */}
    //       <View>
    //         <Image
    //           style={[styles.card, styles.cardIsSelected]}
    //           source={
    //             typeof card.image_uris!.normal === "string"
    //               ? { uri: card.image_uris!.normal }
    //               : card.image_uris!.normal
    //           }
    //           contentFit="contain"
    //         />
    //         <Pressable style={styles.plusButton} onPress={() => addRemoveCardToDeck()}>
    //           {showAddRemoveOperator && (
    //             <Text style={[styles.operatorText, { fontSize: 85, right: 20, width: 30 }]}>
    //               {displayPlusMinusCardButton}
    //             </Text>
    //           )}
    //         </Pressable>
    //       </View>
    //     </Pressable>
    //   </View>
    // </Modal>
    <CustomModal visible={isSelected} setVisible={setIsSelected} transparentBackground={true}>
      <Pressable onPress={() => setIsSelected(false)}>
        <View>
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
              <Text style={[styles.operatorText, { fontSize: 85, right: 20, width: 30 }]}>
                {displayPlusMinusCardButton}
              </Text>
            )}
          </Pressable>
        </View>
      </Pressable>
    </CustomModal>
  );
};

export default SelectedCardModal;
