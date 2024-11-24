import { globalStyles } from "@/constants/styles";
import { cardShuffler } from "@/helpers/cardShuffler";
import { SavedDeck, useGameScreenDeckStore } from "@/store/store";
import { ScryfallCard } from "@scryfall/api-types";
import { useCallback, useEffect, useState } from "react";
import { LayoutChangeEvent, NativeSyntheticEvent, StyleSheet, Text, View } from "react-native";
import ShatterButton from "../button/ShatterButton";
import CardInPlayDeck from "../card/CardInPlayDeck";
import OnGoingSchemeDeck from "../decks/OnGoingSchemeDeck";
import PulseWrapper from "../style-elements/PulseWrapper";
import TabsIcon from "../style-elements/TabsIcon";
import Spacer from "../style-elements/Spacer";
import DiscardedCardPile from "../decks/DiscardedCardPile";

const GAME_STATES = {
  DECK_SELECTION: "DECK_SELECTION",
  GAME_START: "GAME_START",
};

interface GameControllerProps {}

const GameController: React.FC<GameControllerProps> = () => {
  const [gameState, setGameState] = useState(GAME_STATES.DECK_SELECTION);
  const [selectedDeck, setSelectedDeck] = useState<SavedDeck | null>(null);
  const [shuffledDeck, setShuffledDeck] = useState<SavedDeck | null>(null);
  const [onGoingSchemes, setOnGoingSchemes] = useState<ScryfallCard.Scheme[]>([]);
  const [discardedCards, setDiscardedCards] = useState<ScryfallCard.Scheme[]>([]);
  const { gameScreenDeck } = useGameScreenDeckStore();
  const [discardPileLayout, setDiscardPileLayout] = useState({
    x: 0,
    y: 0,
    width: 0,
    height: 0,
  });

  const handleDeckSelected = useCallback((deck: SavedDeck) => {
    setGameState(GAME_STATES.GAME_START);
    setSelectedDeck(deck);
    handleShuffleDeck(deck);
  }, []);

  useEffect(() => {
    if (gameScreenDeck) {
      handleDeckSelected(gameScreenDeck);
    }
  }, [gameScreenDeck, handleDeckSelected]);

  const handleShuffleDeck = (deck: SavedDeck) => {
    if (deck) {
      setShuffledDeck(cardShuffler(deck));
    }
  };

  const handleRemoveCardFromShuffledDeck = (card: ScryfallCard.Scheme, discardCard: boolean) => {
    if (shuffledDeck) {
      const newShuffledDeck = shuffledDeck.cards.filter((deckCard) => deckCard.name !== card.name);
      setShuffledDeck((prevShuffledDeck) =>
        prevShuffledDeck ? { ...prevShuffledDeck, cards: newShuffledDeck } : null
      );
      if (discardCard) {
        setDiscardedCards((prevDiscardedCards) => [...prevDiscardedCards, card]);
      }
    }
  };

  const handleAddOnGoingScheme = (card: ScryfallCard.Scheme) => {
    setOnGoingSchemes([...onGoingSchemes, card]);
  };

  const handleRemoveOnGoingScheme = (card: ScryfallCard.Scheme) => {
    const newOnGoingSchemes = onGoingSchemes.filter((scheme) => scheme.name !== card.name);
    setOnGoingSchemes(newOnGoingSchemes);
    setDiscardedCards((prevDiscardedCards) => [...prevDiscardedCards, card]);
  };

  const handleResetGame = () => {
    if (discardedCards.length > 0 && selectedDeck) {
      const newDeck: SavedDeck = {
        deckName: selectedDeck.deckName,
        cards: [...discardedCards],
      };
      handleShuffleDeck(newDeck);
    }
    // clear discarded cards after reshuffle
    setDiscardedCards([]);
  };

  const handleDiscardPileLayout = (e: LayoutChangeEvent) => {
    const { x, y, width, height } = e.nativeEvent.layout;
    setDiscardPileLayout({ x, y, width, height }); // more explicit
  };

  const playDeckContent = (
    <View>
      {onGoingSchemes.length > 0 && (
        <OnGoingSchemeDeck
          onGoingSchemes={onGoingSchemes}
          removeOnGoingScheme={handleRemoveOnGoingScheme}
        />
      )}
      {shuffledDeck && shuffledDeck.cards.length > 0 ? (
        <View style={styles.playDeckContainer}>
          {shuffledDeck.cards.map((card: ScryfallCard.Scheme) => (
            <CardInPlayDeck
              key={card.name}
              card={card}
              addToOnGoingSchemes={handleAddOnGoingScheme}
              removeCardFromDeck={handleRemoveCardFromShuffledDeck}
              discardPileLayout={discardPileLayout}
            />
          ))}
          <View style={styles.cardCountInShuffledDeckContainer}>
            <Spacer width={30} />
            <PulseWrapper pulseEffectOnValueChange={shuffledDeck.cards.length}>
              <Text style={[globalStyles.text, styles.cardCountText]}>
                {shuffledDeck.cards.length}
              </Text>
            </PulseWrapper>
            <View onLayout={handleDiscardPileLayout}>
              {<DiscardedCardPile cards={discardedCards} isVisible={discardedCards.length > 0} />}
            </View>
          </View>
        </View>
      ) : (
        <ShatterButton buttonName={"Reshuffle"} onPlayPress={handleResetGame} />
      )}
    </View>
  );

  return <View style={styles.container}>{gameState === "GAME_START" && playDeckContent}</View>;
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    // alignItems: "center",
  },

  playDeckContainer: {
    position: "relative",
    height: "100%",
  },
  cardCountInShuffledDeckContainer: {
    flex: 1,
    flexDirection: "row",
    alignItems: "flex-end",
    justifyContent: "space-around",
    marginBottom: 5,
  },
  cardCountText: {
    fontSize: 25,
    color: "white",
  },
});

export default GameController;
