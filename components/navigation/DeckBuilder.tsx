import { defaultColors } from "@/constants/Colors";
import { globalStyles } from "@/constants/styles";
import { MINIMUM_CARDS_IN_NEW_DECK } from "@/constants/values";
import { useCardStore, useNewDeckStore } from "@/store/store";
import { FontAwesome } from "@expo/vector-icons";
import { ScryfallCard } from "@scryfall/api-types";
import { useRef, useState } from "react";
import {
  FlatList,
  LayoutChangeEvent,
  NativeScrollEvent,
  NativeSyntheticEvent,
  StyleSheet,
  Text,
  View,
} from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from "react-native-reanimated";
import Card from "../card/Card";
import Filter from "../card/filter/Filter";
import NewDeck from "../decks/NewDeck";
import ErrorModal from "../modals/specific-modals/ErrorModal";
import PulseWrapper from "../style-elements/PulseWrapper";

const DeckBuilder: React.FC = () => {
  const { cardsInNewDeck, addCardToNewDeck, removeCardFromNewDeck } = useNewDeckStore();
  const { cardsInStore, error } = useCardStore();
  const [displayedCards, setDisplayedCards] = useState<ScryfallCard.Scheme[]>([]);
  const [currentScrollPositionY, setCurrentScrollPositionY] = useState(0);
  const [upArrowToTopOfScreenWidth, setUpArrowToTopOfScreenWidth] = useState(0);
  const [initialNewDeckContainerHeight, setInitialNewDeckContainerHeight] = useState(0);
  const cardFlatListRef = useRef<FlatList<ScryfallCard.Scheme>>(null);
  const arrowToTopOfScreenOpacity = useSharedValue(1);

  const arrowToTopOfScreenAnimatedStyle = useAnimatedStyle(() => {
    return {
      opacity: arrowToTopOfScreenOpacity.value,
    };
  });

  if (error) {
    return <ErrorModal errorMessage={error} />;
  }

  const handleOnScroll = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
    setCurrentScrollPositionY(e.nativeEvent.contentOffset.y);
  };

  const handleScrollToTopOfScreen = () => {
    arrowToTopOfScreenOpacity.value = withRepeat(withTiming(0.5, { duration: 100 }), 2, true);
    if (cardFlatListRef.current) {
      cardFlatListRef.current.scrollToOffset({ offset: 0, animated: true });
    }
  };

  const handleNewDeckLayout = (layout: LayoutChangeEvent) => {
    const { height } = layout.nativeEvent.layout;
    // Set the initial height of the new deck container for use when it is empty and need to deduct its height from the scroll position
    if (initialNewDeckContainerHeight === 0) {
      setInitialNewDeckContainerHeight(height);
    }

    if (cardFlatListRef.current) {
      if (height === 0) {
        // If the new deck container is empty, deduct its 'first' height after appearing, from the scroll position
        cardFlatListRef.current.scrollToOffset({
          offset: currentScrollPositionY - initialNewDeckContainerHeight,
          animated: true,
        });
      } else {
        cardFlatListRef.current.scrollToOffset({
          offset: currentScrollPositionY + height,
          animated: true,
        });
      }
    }
  };

  const renderItem = ({ item }: { item: ScryfallCard.Scheme }) => (
    <View style={styles.cardWrapper}>
      <Card
        card={item}
        size={"normal"}
        isOpacityControlled={true}
        showAddRemoveOperator={true}
        addToDeck={() => addCardToNewDeck(item)}
        removeFromDeck={() => removeCardFromNewDeck(item)}
        existsInDeck={cardsInNewDeck.some((card) => card.name === item.name)} // Check if the card exists in the new deck
        showLoadingSpinner={true}
      />
    </View>
  );

  const headerComponent = (
    <>
      <NewDeck onLayoutChange={handleNewDeckLayout} />
      <Filter cards={cardsInStore} setFilteredCards={setDisplayedCards} />
    </>
  );

  const styles = StyleSheet.create({
    text: {
      color: cardsInNewDeck.length < MINIMUM_CARDS_IN_NEW_DECK ? defaultColors.red : "#42b883",
      fontSize: 18,
      margin: 0,
      paddingBottom: 5,
    },
    scrollContainer: { flex: 1, marginVertical: 30, position: "relative" },
    container: {
      flex: 1,
      justifyContent: "space-evenly",
      marginTop: 10,
    },
    cardWrapper: {
      flex: 1,
      marginVertical: 10,
      marginHorizontal: 5, // Add some horizontal margin for spacing
      alignItems: "center", // Center the columns
    },
    columnWrapper: {
      justifyContent: "space-between", // Optional: to evenly space columns
    },
    arrowUpToTopOfScreenContainer: {
      position: "absolute",
      color: defaultColors.grey,
      transform: [{ scaleY: 1.2 }, { translateX: -upArrowToTopOfScreenWidth / 2 }],
      top: "90%",
      left: "50%",
    },
  });

  return (
    <View style={styles.scrollContainer}>
      <PulseWrapper pulseEffectOnValueChange={cardsInNewDeck.length}>
        <Text style={[globalStyles.text, styles.text]}>
          {cardsInNewDeck.length}/{MINIMUM_CARDS_IN_NEW_DECK}
        </Text>
      </PulseWrapper>
      <FlatList
        ref={cardFlatListRef}
        ListHeaderComponent={headerComponent}
        data={displayedCards}
        renderItem={renderItem}
        keyExtractor={(item) => item.name} // Assuming `name` is unique
        numColumns={2} // This sets the number of columns to 2
        initialNumToRender={4} // Reduce the number of items to render initially
        windowSize={21}
        maxToRenderPerBatch={6}
        contentContainerStyle={{ flexGrow: 1 }}
        keyboardShouldPersistTaps="handled"
        onScroll={handleOnScroll}
        scrollEventThrottle={16}
      />
      {currentScrollPositionY > 500 && (
        <Animated.View
          style={[arrowToTopOfScreenAnimatedStyle, styles.arrowUpToTopOfScreenContainer]}
          onLayout={(event) => setUpArrowToTopOfScreenWidth(event.nativeEvent.layout.width)}
        >
          <FontAwesome
            name="arrow-up"
            size={24}
            color={defaultColors.grey}
            onPress={handleScrollToTopOfScreen}
          />
        </Animated.View>
      )}
    </View>
  );
};

export default DeckBuilder;
