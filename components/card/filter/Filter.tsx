import { defaultColors } from "@/constants/Colors";
import { defaultBorderRadius } from "@/constants/styles";
import { FontAwesome } from "@expo/vector-icons";
import { ScryfallCard } from "@scryfall/api-types";
import { useEffect, useMemo, useState } from "react";
import { StyleSheet, View } from "react-native";
import CheckBoxButton from "../../button/CheckBoxButton";
import CustomButton from "../../button/CustomButton";
import Spacer from "../../style-elements/Spacer";
import FilterTextInput from "./FilterTextInput";

interface FilterProps {
  cards: ScryfallCard.Scheme[];
  setFilteredCards: (cards: ScryfallCard.Scheme[]) => void;
  filterIconActiveColor?: string;
  filterIconInactiveColor?: string;
}

interface ICheckBoxFilter {
  showSchemes: boolean;
  showOngoingSchemes: boolean;
}

const Filter: React.FC<FilterProps> = ({
  cards,
  setFilteredCards,
  filterIconActiveColor,
  filterIconInactiveColor,
}) => {
  const [cardNameFilter, setCardNameFilter] = useState<string>("");
  const [cardOracleTextFilter, setCardOracleTextFilter] = useState<string>("");
  const [checkBoxFilter, setCheckBoxFilter] = useState<ICheckBoxFilter>({
    showSchemes: true,
    showOngoingSchemes: true,
  });
  const [filtersAreShown, setFiltersAreShown] = useState<boolean>(false);

  const filteredCards = useMemo(() => {
    return cards.filter((card) => {
      if (!checkBoxFilter.showSchemes && card.type_line === "Scheme") {
        return false;
      }

      if (!checkBoxFilter.showOngoingSchemes && card.type_line === "Ongoing Scheme") {
        return false;
      }

      if (
        cardNameFilter.length !== 0 &&
        !card.name.toLowerCase().includes(cardNameFilter.trim().toLowerCase())
      ) {
        return false;
      }

      if (
        cardOracleTextFilter.length !== 0 &&
        !card.oracle_text.toLowerCase().includes(cardOracleTextFilter.trim().toLowerCase())
      ) {
        return false;
      }

      return true;
    });
  }, [cards, cardNameFilter, cardOracleTextFilter, checkBoxFilter]);

  useEffect(() => {
    setFilteredCards(filteredCards);
  }, [filteredCards, setFilteredCards]);

  const content = filtersAreShown ? (
    <>
      <View style={styles.filterWrapper}>
        <FilterTextInput
          textInputName="Search name"
          textInputOnChange={setCardNameFilter}
          textInputValue={cardNameFilter}
        />
        <FilterTextInput
          textInputName="Search description"
          textInputOnChange={setCardOracleTextFilter}
          textInputValue={cardOracleTextFilter}
        />
      </View>
      <View style={styles.checkBoxButtonContainer}>
        <CheckBoxButton
          text="Ongoing schemes"
          checked={checkBoxFilter.showOngoingSchemes}
          onCheckChange={() =>
            setCheckBoxFilter((prev) => ({
              ...prev,
              showOngoingSchemes: !prev.showOngoingSchemes,
            }))
          }
          inactiveColor={filterIconInactiveColor || defaultColors.grey}
        />
        <CheckBoxButton
          text="Schemes"
          checked={checkBoxFilter.showSchemes}
          onCheckChange={() =>
            setCheckBoxFilter((prev) => ({
              ...prev,
              showSchemes: !prev.showSchemes,
            }))
          }
          inactiveColor={filterIconInactiveColor || defaultColors.grey}
        />
      </View>
    </>
  ) : null;

  return (
    <>
      <View style={styles.container}>
        <Spacer />
        {filtersAreShown && (
          <>
            <CustomButton
              type="neutral"
              text="Reset filters"
              onPress={() => {
                setCardNameFilter("");
                setCardOracleTextFilter("");
                setCheckBoxFilter({
                  showSchemes: true,
                  showOngoingSchemes: true,
                });
              }}
            />
          </>
        )}
        <FontAwesome
          name="filter"
          size={35}
          style={{ alignSelf: "flex-end", paddingHorizontal: 15 }}
          onPress={() => setFiltersAreShown((prev) => !prev)}
          color={
            filtersAreShown
              ? filterIconActiveColor || defaultColors.gold
              : filterIconInactiveColor || defaultColors.grey
          }
        />
      </View>
      {content}
    </>
  );
};

export default Filter;

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  filterWrapper: {
    alignItems: "center",
    padding: 10,
  },
  inputContainer: {
    flex: 1,
    width: "96%",
    position: "relative",
  },
  textInput: {
    flex: 1,
    borderWidth: 1,
    borderRadius: defaultBorderRadius,
    borderColor: defaultColors.gold,
    backgroundColor: "#590080",
    padding: 10,
    marginRight: 10,
    color: defaultColors.gold,
    marginVertical: 5,
    fontFamily: "Beleren",
  },
  clearFilterIcon: {
    color: defaultColors.red,
    fontSize: 20,
    // padding: 20,
    // position: "absolute",
    // right: 15,
    // top: 15,
  },
  pressableWrapper: {
    position: "absolute",
    right: 10, // Keeps the position of the icon intact
    top: 10, // Keeps the position of the icon intact
    // padding: 15, // Larger clickable area
    justifyContent: "center", // Vertically centers the icon inside the pressable
    alignItems: "center", // Horizontally centers the icon inside the pressable
  },
  checkBoxButtonContainer: {
    flexDirection: "row",
    justifyContent: "space-evenly",
    marginVertical: 10,
    width: "100%", // odd, but nice styling if only this element has 100%
  },
});
