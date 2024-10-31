import { useState } from "react";
import { View, TextInput, StyleSheet } from "react-native";
import CustomButton from "../button/CustomButton";
import { defaultColors } from "@/constants/Colors";

interface FilterProps {
  setFilter: (filter: string) => void;
}

const Filter: React.FC<FilterProps> = ({ setFilter }) => {
  const [search, setSearch] = useState<string>("");

  return (
    <View style={styles.filterWrapper}>
      <TextInput
        style={styles.textInput}
        // value={search}
        onChangeText={(text) => setFilter(text)}
        placeholder="Search name"
        placeholderTextColor={defaultColors.grey}
      />
      <CustomButton text="Filter" onPress={() => {}} type="positive" />
    </View>
  );
};

export default Filter;

const styles = StyleSheet.create({
  filterWrapper: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 10,
  },
  textInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: defaultColors.gold,
    backgroundColor: "#590080",
    padding: 10,
    marginRight: 10,
    color: defaultColors.gold,
  },
});
