import { defaultColors } from "@/constants/Colors";
import { globalStyles } from "@/constants/styles";
import { FontAwesome } from "@expo/vector-icons";
import { Pressable, Text, View, StyleSheet } from "react-native";

interface CheckBoxButtonInputs {
  text: string;
  checked: boolean;
  onCheckChange: () => void;
  inactiveColor?: string;
}

const CheckBoxButton: React.FC<CheckBoxButtonInputs> = ({
  text,
  onCheckChange,
  inactiveColor,
  checked,
}) => {
  const icon = checked ? "check-square" : "square";

  const styles = StyleSheet.create({
    container: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
    },
    text: {
      color: checked ? defaultColors.gold : inactiveColor || defaultColors.grey,
      marginRight: 5,
    },
  });

  return (
    <Pressable
      onPress={() => {
        onCheckChange();
      }}
    >
      <View style={styles.container}>
        <Text style={[globalStyles.text, styles.text]}>{text}</Text>
        <FontAwesome
          name={icon}
          size={24}
          color={checked ? defaultColors.gold : inactiveColor}
        />
      </View>
    </Pressable>
  );
};

export default CheckBoxButton;
