import { defaultColors } from "@/constants/Colors";
import { defaultBorderRadius } from "@/constants/styles";
import { Modal, ModalProps, ScrollView, StyleSheet, View } from "react-native";

interface CustomModalProps extends ModalProps {
  visible: boolean;
  setVisible: (value: boolean) => void;
  children: React.ReactNode;
  scrollEnabled?: boolean;
  transparentBackground?: boolean;
}

const CustomModal: React.FC<CustomModalProps> = ({
  visible,
  setVisible,
  children,
  scrollEnabled,
  transparentBackground,
}) => {
  const styles = StyleSheet.create({
    centeredView: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: "rgba(0,0,0,0.5)", // Optional: adds a backdrop
    },
    modalContainer: {
      width: "97%", // Modal width
      maxHeight: "80%", // Maximum height to prevent overflow
      backgroundColor: !transparentBackground ? defaultColors.grey : "none",
      borderRadius: defaultBorderRadius,
      elevation: 5,
      overflow: "hidden",
    },
    modalView: {
      width: "100%", // Modal width
      alignItems: "center",
    },
    contentContainer: {
      justifyContent: "center",
      alignItems: "center",
      paddingBottom: 20, // Additional padding at the bottom if needed
    },
  });

  const content = scrollEnabled ? (
    <ScrollView
      contentContainerStyle={styles.contentContainer}
      keyboardShouldPersistTaps="handled"
    >
      <View style={styles.modalView}>{children}</View>
    </ScrollView>
  ) : (
    <View style={styles.modalView}>{children}</View>
  );

  return (
    <Modal
      statusBarTranslucent={true}
      animationType="none"
      transparent={true}
      visible={visible}
      onRequestClose={() => {
        setVisible(false);
      }}
    >
      <View style={styles.centeredView}>
        <View style={styles.modalContainer}>{content}</View>
      </View>
    </Modal>
  );
};

export default CustomModal;
