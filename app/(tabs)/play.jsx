import { StyleSheet, View, Text } from "react-native";

export default function PlayScreen() {
    return (
        <View style={styles.container}>
            <Text style={styles.title}>
                Play
            </Text>

            <Text style={styles.text}>
                For You and quiz categories will live here.
            </Text>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#ffffff",
        padding: 24
    },
    title: {
        fontSize: 32,
        fontWeight: '800'
    },
    text: {
        marginTop: 12,
        fontSize: 16
    },
})