import CustomButton from "@/components/button/CustomButton";
import { defaultColors } from "@/constants/Colors";
import { Modal, Text, StyleSheet, View } from "react-native";

interface InputProps {
  isVisible: boolean;
  text: string;
  onConfirm: () => void;
  onCancel: () => void;
}

const ConfirmationModal: React.FC<InputProps> = ({ isVisible, text, onConfirm, onCancel }) => {
  return (
    <Modal visible={isVisible} transparent={true} animationType="fade">
      <View style={styles.centeredView}>
        <View style={styles.modalContainer}>
          <Text style={styles.text}>{text}</Text>
          <View style={styles.buttonContainer}>
            <CustomButton type="positive" text="CONFIRM" onPress={onConfirm} />
            <CustomButton type="negative" text="CANCEL" onPress={onCancel} />
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default ConfirmationModal;

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.1)",
  },
  modalContainer: {
    maxHeight: 200,
    flex: 1,
    width: "90%",
    alignSelf: "center",
    alignItems: "center",
    justifyContent: "flex-end",
    backgroundColor: defaultColors.grey,
    borderRadius: 20,
  },
  buttonContainer: {
    flex: 0.5,
    flexDirection: "row",
    alignItems: "center",
    margin: 10,
  },
  text: {
    fontSize: 18,
    textAlign: "center",
  },
});
