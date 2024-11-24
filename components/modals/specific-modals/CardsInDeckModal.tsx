import { SavedDeck } from "@/store/store";
import CustomModal from "../CustomModal";
import { FlatList, StyleSheet, View } from "react-native";
import Card from "@/components/card/Card";
import { ScryfallCard } from "@scryfall/api-types";
import CustomButton from "@/components/button/CustomButton";
import Spacer from "@/components/style-elements/Spacer";

interface CardsInDeckModalProps {
  deck: SavedDeck;
  modalVisible: boolean;
  setModalVisible: (visible: boolean) => void;
  columns?: number;
}

const CardsInDeckModal: React.FC<CardsInDeckModalProps> = ({
  deck,
  modalVisible,
  setModalVisible,
  columns = 1,
}) => {
  const flatListRenderItem = ({ item }: { item: ScryfallCard.Scheme }) => {
    return (
      <Card
        card={item}
        existsInDeck={true}
        isOpacityControlled={false}
        showAddRemoveOperator={false}
        size="normal"
        border={false}
      />
    );
  };

  return (
    <CustomModal visible={modalVisible} setVisible={setModalVisible}>
      <View style={styles.container}>
        <View style={styles.buttonContainer}>
          <CustomButton
            type="negative"
            text="Close"
            onPress={() => {
              setModalVisible(false);
            }}
          />
        </View>
        <FlatList data={deck.cards} renderItem={flatListRenderItem} numColumns={columns} />
      </View>
    </CustomModal>
  );
};

export default CardsInDeckModal;

const styles = StyleSheet.create({
  container: {
    height: "100%",
    alignItems: "flex-end",
  },
  buttonContainer: { width: "100%" },
});
