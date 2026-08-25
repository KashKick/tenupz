import { StyleSheet, Text, View } from "react-native";

export default function RewardsScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>
        Rewards
      </Text>

      <Text style={styles.text}>
        Active, completed and recommended challenges will live here.
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