import { defaultColors } from "@/constants/Colors";
import { globalStyles } from "@/constants/styles";
import { removeDeckFromStorage, updateDeckInStorage } from "@/helpers/savedDeckManager";
import { SavedDeck, useSavedDeckStore } from "@/store/store";
import { FontAwesome, FontAwesome6 } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";
import { useCallback, useEffect, useReducer, useState } from "react";
import {
  FlatList,
  NativeScrollEvent,
  NativeSyntheticEvent,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from "react-native-reanimated";
import CustomButton from "../button/CustomButton";
import ConfirmationModal from "../modals/specific-modals/ConfirmationModal";
import SavedDeckModal from "../modals/specific-modals/SavedDeckModal";
import BlurredBackground from "../style-elements/BlurredBackground";
import Spacer from "../style-elements/Spacer";
import TabsIcon from "../style-elements/TabsIcon";

interface SavedDecksProps {
  onDeckSelectedForPlay: (deck: SavedDeck) => void;
}

// Define the types for state and actions
type State = {
  modalVisible: boolean;
  selectedDeck: SavedDeck | null;
};

type Action = { type: "OPEN_MODAL"; payload: SavedDeck } | { type: "CLOSE_MODAL" };

// Reducer function
const reducer = (state: State, action: Action): State => {
  switch (action.type) {
    case "OPEN_MODAL":
      return { ...state, modalVisible: true, selectedDeck: action.payload };
    case "CLOSE_MODAL":
      return { ...state, modalVisible: false, selectedDeck: null };
    default:
      return state;
  }
};

const SavedDecks: React.FC<SavedDecksProps> = ({ onDeckSelectedForPlay }) => {
  const { savedDecksInState, removeDeckFromState, updateDeckInState, clearDecks } =
    useSavedDeckStore();
  const [clearDecksConfirmationModalIsVisible, setClearDecksConfirmationModalIsVisible] =
    useState(false);
  const [deckToDelete, setDeckToDelete] = useState<SavedDeck | null>(null);
  const [state, dispatch] = useReducer(reducer, { modalVisible: false, selectedDeck: null });
  const [scrollPositionY, setScrollPositionY] = useState<number>(0);
  const [firstItemHeight, setFirstItemHeight] = useState<number>(0);
  const [lastItemHeight, setLastItemHeight] = useState<number>(0);
  const scrollUpArrowOpacity = useSharedValue(0);
  const scrollDownArrowOpacity = useSharedValue(0);
  const [savedDeckContainerHeight, setSavedDeckContainerHeight] = useState<number>(0);
  const [savedDeckContentHeight, setSavedDeckContentHeight] = useState<number>(0);

  const scrollUpArrowAnimatedStyle = useAnimatedStyle(() => {
    return {
      opacity: scrollUpArrowOpacity.value,
    };
  });

  const scrollDownArrowAnimatedStyle = useAnimatedStyle(() => {
    return {
      opacity: scrollDownArrowOpacity.value,
    };
  });

  const handleClearDecks = () => {
    AsyncStorage.removeItem("saved-decks");
    clearDecks();
  };

  const handleDeckListModal = (deck: SavedDeck) => {
    dispatch({ type: "OPEN_MODAL", payload: deck });
  };

  const handleDeleteDeck = (deck: SavedDeck) => {
    removeDeckFromState(deck);
    removeDeckFromStorage(deck);
  };

  const handleUpdateDeck = (deck: SavedDeck, newDeckName?: string) => {
    updateDeckInState(deck, newDeckName);
    updateDeckInStorage(deck, newDeckName);
  };

  const flatListRenderItem = ({ item, index }: { item: SavedDeck; index: number }) => {
    return (
      <View
        style={styles.deckContainer}
        onLayout={(event) => {
          const { height } = event.nativeEvent.layout; // Get the height of the item
          if (index === 0) {
            setFirstItemHeight(Math.trunc(height)); // Set height of the first item
          }

          if (index === savedDecksInState.length - 1) {
            setLastItemHeight(Math.trunc(height)); // Set height of the last item
          }
        }}
      >
        <View style={{ width: "100%", paddingHorizontal: 1, overflow: "hidden" }}>
          <BlurredBackground>
            <View style={styles.deck}>
              <Pressable
                onPress={() => {
                  handleDeckListModal(item);
                }}
              >
                <View style={{ flexDirection: "row", alignItems: "center" }}>
                  <Text style={[globalStyles.text, styles.deckText]}>{item.deckName}</Text>
                  <View style={{ marginHorizontal: 4 }}>
                    <TabsIcon
                      source={require("../../assets/tab-icons/cards-icon.svg")}
                      focused={true}
                    />
                  </View>
                  <Text style={[globalStyles.text, styles.deckText]}>{item.cards.length}</Text>
                </View>
              </Pressable>
            </View>

            <FontAwesome6
              name="trash-alt"
              size={24}
              color={defaultColors.red}
              onPress={() => {
                setDeckToDelete(item);
              }}
            />

            <ConfirmationModal
              isVisible={deckToDelete != null}
              text={`Are you sure you want to delete ${deckToDelete?.deckName}?`}
              onConfirm={() => {
                if (deckToDelete) {
                  handleDeleteDeck(deckToDelete);
                  setDeckToDelete(null);
                }
              }}
              onCancel={() => {
                setDeckToDelete(null);
              }}
              backgroundColor="rgba(0,0,0,0.1)"
            />
          </BlurredBackground>
        </View>
      </View>
    );
  };

  const onScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const { contentOffset } = event.nativeEvent;
    setScrollPositionY(contentOffset.y);
  };

  const updateChevronOpacity = useCallback(() => {
    if (scrollPositionY > firstItemHeight / 2) {
      scrollUpArrowOpacity.value = withTiming(1, { duration: 200 });
    } else {
      scrollUpArrowOpacity.value = withTiming(0, { duration: 200 });
    }

    if (scrollPositionY + savedDeckContainerHeight < savedDeckContentHeight - lastItemHeight / 2) {
      scrollDownArrowOpacity.value = withTiming(1, { duration: 200 });
    } else {
      scrollDownArrowOpacity.value = withTiming(0, { duration: 200 });
    }
  }, [
    scrollPositionY,
    firstItemHeight,
    lastItemHeight,
    savedDeckContainerHeight,
    savedDeckContentHeight,
    scrollUpArrowOpacity,
    scrollDownArrowOpacity,
  ]);

  useEffect(() => {
    updateChevronOpacity();
  }, [savedDecksInState, updateChevronOpacity]);

  const deckContent =
    savedDecksInState.length > 0 ? (
      <>
        <Animated.View style={scrollUpArrowAnimatedStyle}>
          <FontAwesome
            style={styles.scrollChevronIcon}
            name="chevron-up"
            size={14}
            color={"white"}
          />
        </Animated.View>

        <FlatList
          data={savedDecksInState}
          renderItem={flatListRenderItem}
          onScroll={onScroll}
          scrollEventThrottle={16}
          onContentSizeChange={(width, height) => setSavedDeckContentHeight(height)}
        />

        <Animated.View style={scrollDownArrowAnimatedStyle}>
          <FontAwesome
            style={styles.scrollChevronIcon}
            name="chevron-down"
            size={14}
            color={"white"}
          />
        </Animated.View>
      </>
    ) : (
      // <Link href="/(tabs)/deckbuilder">
      <Pressable onPress={() => router.push("/(tabs)/deckbuilder")}>
        <Text style={[globalStyles.text, styles.emptyDeckText]}>Create a new deck</Text>
      </Pressable>
      // </Link>
    );

  return (
    <View style={styles.container}>
      {state.selectedDeck && (
        <SavedDeckModal
          modalVisible={state.modalVisible}
          setVisible={() => dispatch({ type: "CLOSE_MODAL" })}
          deck={state.selectedDeck}
          updateDeck={handleUpdateDeck}
          selectDeckForPlay={onDeckSelectedForPlay}
        />
      )}
      <View
        style={styles.allDecksContainer}
        onLayout={(e) => setSavedDeckContainerHeight(e.nativeEvent.layout.height)}
      >
        {deckContent}
      </View>
      <Spacer height={50} />
      {savedDecksInState.length > 0 && true && (
        <CustomButton
          text="Clear decks"
          type="negative"
          onPress={() => setClearDecksConfirmationModalIsVisible(true)}
        />
      )}
      <ConfirmationModal
        isVisible={clearDecksConfirmationModalIsVisible}
        text="Are you sure you want to clear all decks?"
        onConfirm={() => {
          setClearDecksConfirmationModalIsVisible(false);
          handleClearDecks();
        }}
        onCancel={() => setClearDecksConfirmationModalIsVisible(false)}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  scrollChevronIcon: {
    transform: [{ scaleX: 5 }],
    marginVertical: 10,
  },
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "flex-end",
    marginBottom: 60,
  },
  allDecksContainer: {
    width: "96%",
    flex: 0.5,
    justifyContent: "center",
    alignItems: "center",
  },
  deckContainer: {
    flex: 0.25,
    marginVertical: 5,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 2,
  },
  deck: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginHorizontal: 20,
  },
  deckText: {
    color: defaultColors.gold,
    fontSize: 20,
  },
  paginationContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "70%",
    marginTop: 10,
  },
  emptyDeckText: {
    color: defaultColors.gold,
    fontSize: 25,
  },
});

export default SavedDecks;
