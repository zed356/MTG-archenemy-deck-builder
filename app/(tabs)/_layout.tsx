import GradientBackground from "@/components/GradientBackground";
import { defaultColors } from "@/constants/Colors";
import { FontAwesome } from "@expo/vector-icons";
import { Tabs } from "expo-router";

const TabsLayout = () => {
  return (
    <Tabs
      screenOptions={{
        tabBarStyle: {
          borderTopWidth: 0,
        },
        headerTintColor: defaultColors.gold,
        headerBackground() {
          return <GradientBackground reversed={true} />;
        },
        tabBarBackground() {
          return <GradientBackground reversed={false} />;
        },
        tabBarActiveTintColor: defaultColors.gold,
        tabBarInactiveTintColor: defaultColors.grey,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          headerShown: false,
          headerTitle: "Home",
          headerTitleAlign: "center",
          title: "Home",
          tabBarIcon: ({ focused }) => (
            <FontAwesome
              name="home"
              size={30}
              color={focused ? defaultColors.gold : defaultColors.grey}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="deckbuilder/index"
        options={{
          headerShown: false,
          headerTitle: "Builder",
          headerTitleAlign: "center",
          title: "Builder",
          tabBarIcon: ({ focused }) => (
            <FontAwesome
              name="credit-card-alt"
              size={30}
              color={focused ? defaultColors.gold : defaultColors.grey}
            />
          ),
        }}
      />
    </Tabs>
  );
};

export default TabsLayout;
