import GradientBackground from "@/components/style-elements/GradientBackground";
import DeckBuilder from "@/components/navigation/DeckBuilder";
import { SafeAreaView } from "react-native";

const DeckBuilderScreen = () => {
  return (
    <GradientBackground>
      <SafeAreaView style={{ flex: 1, marginVertical: 20 }}>
        <DeckBuilder />
      </SafeAreaView>
    </GradientBackground>
  );
};

export default DeckBuilderScreen;
