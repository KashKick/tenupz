import { StyleSheet, Text, View } from "react-native";

export default function ProfileScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>
        Profile
      </Text>

      <Text style={styles.text}>
        XP, streaks, stats and achievements will live here.
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ffffff",
    padding: 24,
  },

  title: {
    fontSize: 32,
    fontWeight: "800",
  },

  text: {
    marginTop: 12,
    fontSize: 16,
  },
});