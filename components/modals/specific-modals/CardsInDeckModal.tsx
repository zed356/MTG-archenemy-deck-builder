import { SavedDeck } from "@/store/store";
import CustomModal from "../CustomModal";
import { FlatList, StyleSheet, View } from "react-native";
import Card from "@/components/card/Card";
import { ScryfallCard } from "@scryfall/api-types";
import CustomButton from "@/components/button/CustomButton";

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
    </CustomModal>
  );
};

export default CardsInDeckModal;

const styles = StyleSheet.create({
  buttonContainer: { alignItems: "flex-end", width: "100%" },
});
