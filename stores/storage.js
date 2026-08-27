import { Platform } from "react-native";

let storage;

if (Platform.OS === "web") {
    storage = {
        getItem: async (name) => {
            return localStorage.getItem(name);
        },

        setItem: async (name, value) => {
            localStorage.setItem(name, value);
        },

        removeItem: async (name) => {
            localStorage.removeItem(name);
        },
    };
} else {
    const SQLiteStorage = require("expo-sqlite/kv-store").default;
    storage = SQLiteStorage;
}

export default storage;