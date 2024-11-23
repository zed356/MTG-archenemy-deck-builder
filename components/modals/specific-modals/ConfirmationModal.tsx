import CustomButton from "@/components/button/CustomButton";
import Spacer from "@/components/style-elements/Spacer";
import { defaultColors } from "@/constants/Colors";
import { StyleSheet, Text, View } from "react-native";
import CustomModal from "../CustomModal";

interface InputProps {
  isVisible: boolean;
  text: string;
  onConfirm: () => void;
  onCancel: () => void;
  backgroundColor?: string;
}

const ConfirmationModal: React.FC<InputProps> = ({
  isVisible,
  text,
  onConfirm,
  onCancel,
  backgroundColor,
}) => {
  return (
    <CustomModal visible={isVisible} setVisible={() => {}} backgroundColor={backgroundColor}>
      <View style={styles.container}>
        <Text style={styles.text}>{text}</Text>
        <View style={styles.buttonContainer}>
          <CustomButton type="positive" text="CONFIRM" onPress={onConfirm} />
          <Spacer width={20} />
          <CustomButton type="negative" text="CANCEL" onPress={onCancel} />
        </View>
      </View>
    </CustomModal>
  );
};

export default ConfirmationModal;

const styles = StyleSheet.create({
  container: { justifyContent: "center", alignItems: "center", padding: 20 },
  buttonContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  text: {
    fontSize: 18,
    textAlign: "center",
    fontFamily: "Beleren",
    color: defaultColors.grey,
    marginBottom: 10,
  },
});
