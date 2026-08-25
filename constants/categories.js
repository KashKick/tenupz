import {
    Brain,
    Clapperboard,
    FlaskConical,
    Gamepad2,
    Globe2,
    History,
    Music2,
    PawPrint,
    Pizza,
    Popcorn,
    Trophy,
    Volleyball,
} from "lucide-react-native";

import { COLORS } from "./theme";

export const CATEGORIES = [
    {
        id: "movies",
        name: "Movies",
        icon: Clapperboard,
        color: COLORS.coral,
    },
    {
        id: "gaming",
        name: "Gaming",
        icon: Gamepad2,
        color: COLORS.purple,
    },
    {
        id: "geography",
        name: "Geography",
        icon: Globe2,
        color: COLORS.blue,
    },
    {
        id: "music",
        name: "Music",
        icon: Music2,
        color: COLORS.warning,
    },
    {
        id: "sports",
        name: "Sports",
        icon: Volleyball,
        color: COLORS.green,
    },
    {
        id: "90s",
        name: "90s",
        icon: Popcorn,
        color: COLORS.coral,
    },
    {
        id: "general-knowledge",
        name: "General Knowledge",
        icon: Brain,
        color: COLORS.primary,
    },
    {
        id: "science",
        name: "Science",
        icon: FlaskConical,
        color: COLORS.blue,
    },
    {
        id: "history",
        name: "History",
        icon: History,
        color: COLORS.warning,
    },
    {
        id: "food",
        name: "Food",
        icon: Pizza,
        color: COLORS.coral,
    },
    {
        id: "animals",
        name: "Animals",
        icon: PawPrint,
        color: COLORS.green,
    },
    {
        id: "pop-culture",
        name: "Pop Culture",
        icon: Trophy,
        color: COLORS.purple,
    },
];