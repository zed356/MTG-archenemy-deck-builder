import { defaultColors } from "@/constants/Colors";
import { defaultBorderRadius } from "@/constants/styles";
import { FontAwesome } from "@expo/vector-icons";
import { ScryfallCard } from "@scryfall/api-types";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { FlatList, NativeScrollEvent, NativeSyntheticEvent, StyleSheet, View } from "react-native";
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from "react-native-reanimated";
import OnGoingScheme from "../card/OnGoingScheme";

interface OnGoingSchemeDeckProps {
  onGoingSchemes: ScryfallCard.Scheme[];
  removeOnGoingScheme: (card: ScryfallCard.Scheme) => void;
}

const OnGoingSchemeDeck: React.FC<OnGoingSchemeDeckProps> = ({
  onGoingSchemes,
  removeOnGoingScheme,
}) => {
  const [firstItemWidth, setFirstItemWidth] = useState<number>(0);
  const [onGoingSchemeContainerWidth, setOnGoingSchemeContainerWidth] = useState<number>(0);
  const [onGoingSchemeContentWidth, setOnGoingSchemeContentWidth] = useState<number>(0);
  const [scrollPostionX, setScrollPositionX] = useState<number>(0);
  const leftChevronOpacity = useSharedValue(0);
  const rightChevronOpacity = useSharedValue(0);
  const flatListRef = useRef<FlatList<ScryfallCard.Scheme>>(null);

  const updateChevronOpacity = useCallback(() => {
    // if the first item is half visible, show the left chevron
    if (scrollPostionX > firstItemWidth / 3) {
      leftChevronOpacity.value = withTiming(1, { duration: 200 });
    } else {
      leftChevronOpacity.value = withTiming(0, { duration: 200 });
    }
    // if the last item in the view is half visible, show the right chevron
    if (scrollPostionX + onGoingSchemeContainerWidth < onGoingSchemeContentWidth) {
      rightChevronOpacity.value = withTiming(1, { duration: 200 });
    } else {
      rightChevronOpacity.value = withTiming(0, { duration: 200 });
    }
  }, [
    firstItemWidth,
    onGoingSchemeContainerWidth,
    onGoingSchemeContentWidth,
    scrollPostionX,
    leftChevronOpacity,
    rightChevronOpacity,
  ]);

  useEffect(() => {
    updateChevronOpacity();
  }, [scrollPostionX, updateChevronOpacity, onGoingSchemeContentWidth]);

  const animatedLeftChevronStyle = useAnimatedStyle(() => {
    return {
      opacity: leftChevronOpacity.value,
    };
  });

  const animatedRightChevronStyle = useAnimatedStyle(() => {
    return {
      opacity: rightChevronOpacity.value,
    };
  });

  const onScroll = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
    const { contentOffset } = e.nativeEvent;
    setScrollPositionX(contentOffset.x);
  };

  const handleDiscardOnGoingScheme = (item: ScryfallCard.Scheme) => {
    if (
      flatListRef.current &&
      (onGoingSchemes.length - 1) * firstItemWidth - scrollPostionX < onGoingSchemeContainerWidth
    ) {
      flatListRef.current.scrollToOffset({
        animated: true,
        offset: Math.max(0, scrollPostionX - firstItemWidth),
      });
    }
    removeOnGoingScheme(item);
  };

  const flatListRenderItem = ({ item, index }: { item: ScryfallCard.Scheme; index: number }) => {
    return (
      <View
        onLayout={(event) => {
          const width = event.nativeEvent.layout.width;
          if (index === 0) {
            setFirstItemWidth(width);
          }
        }}
      >
        <OnGoingScheme card={item} removeOnGoingScheme={() => handleDiscardOnGoingScheme(item)} />
      </View>
    );
  };

  return (
    <View
      style={styles.onGoingSchemeContainer}
      onLayout={(e) => {
        setOnGoingSchemeContainerWidth(e.nativeEvent.layout.width);
      }}
    >
      <Animated.View style={[styles.arrow, animatedLeftChevronStyle]}>
        <FontAwesome name="chevron-left" size={14} color={"white"} />
      </Animated.View>
      <FlatList
        ref={flatListRef}
        keyExtractor={(item) => item.name}
        horizontal={true}
        data={onGoingSchemes}
        renderItem={flatListRenderItem}
        scrollEventThrottle={16}
        onScroll={onScroll}
        showsHorizontalScrollIndicator={false}
        onContentSizeChange={(w) => {
          setOnGoingSchemeContentWidth(w);
        }}
      />
      <Animated.View style={[styles.arrow, animatedRightChevronStyle]}>
        <FontAwesome name="chevron-right" size={14} color={"white"} />
      </Animated.View>
    </View>
  );
};

export default OnGoingSchemeDeck;

const styles = StyleSheet.create({
  arrow: { marginHorizontal: 5, transform: [{ scaleY: 4 }] },

  onGoingSchemeContainer: {
    borderWidth: 2,
    borderColor: defaultColors.grey,
    borderRadius: defaultBorderRadius,
    width: "96%",
    paddingVertical: 10,
    marginTop: 20,
    overflow: "hidden",
    position: "absolute",
    flexDirection: "row",
    alignSelf: "center",
    alignItems: "center",
  },
});
