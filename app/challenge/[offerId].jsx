import { useLocalSearchParams } from "expo-router";
import { StyleSheet, Text, View } from "react-native";

export default function ChallengeScreen() {
  const { offerId } = useLocalSearchParams();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>
        Challenge
      </Text>

      <Text>
        Offer ID: {offerId}
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
    marginBottom: 12,
  },
});