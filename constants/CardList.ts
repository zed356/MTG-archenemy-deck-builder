import { ICard } from "@/types/types";

export const cardListTemp: ICard[] = [
  {
    name: "A Display of My Dark Power",
    multiverse_id: 212578,
    img: "./../../assets/images/cardsTemp/a-display-of-my-dark-power.jpeg",
  },
  {
    name: "All in Good Time",
    multiverse_id: 212648,
    img: "./../../assets/images/cardsTemp/all-in-good-time.webp",
  },
  {
    name: "All Shall Smolder in My Wake",
    multiverse_id: 212617,
    img: "./../../assets/images/cardsTemp/all-shall-smolder-in-my-wake.bmp",
  },
  {
    name: "Approach My Molten Realm",
    multiverse_id: 212591,
    img: "./../../assets/images/cardsTemp/approach-my-molten-realm.png",
  },
  {
    name: "Approach My Molten Realm",
    multiverse_id: 212591,
    img: "https://picsum.photos/seed/696/3000/2000",
  },
  {
    name: "Approach My Molten Realm",
    multiverse_id: 212591,
    img: "https://gatherer.wizards.com/Handlers/Image.ashx?multiverseid=212591&type=card",
  },
];

export const cardList: ICard[] = [
  {
    name: "A Display of My Dark Power",
    multiverse_id: 212578,
    img: require("./../assets/images/cardsTemp/a-display-of-my-dark-power.jpeg"), // Local image
  },
  {
    name: "All in Good Time",
    multiverse_id: 212648,
    img: require("./../assets/images/cardsTemp/all-in-good-time.webp"), // Local image
  },
  {
    name: "All Shall Smolder in My Wake",
    multiverse_id: 212617,
    img: require("./../assets/images/cardsTemp/all-shall-smolder-in-my-wake.bmp"), // Local image
  },
  {
    name: "Approach My Molten Realm",
    multiverse_id: 212591,
    img: require("./../assets/images/cardsTemp/approach-my-molten-realm.png"), // Local image
  },
];
