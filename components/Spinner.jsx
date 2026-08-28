import { ActivityIndicator, StyleSheet, Text, View } from "react-native"
import { COLORS } from "../constants/theme"

export default function Spinner({ label, size = 'large' }) {
    return (
        <View style={styles.container}>
            <ActivityIndicator size={size} color={COLORS.primary} />
            {label && (
                <Text style={styles.label}>
                    {label}
                </Text>
            )}
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
        justifyContent: 'center',
        gap: 12
    },
    label: {
        color: COLORS.textMuted,
        fontSize: 14,
        fontWeight: '700'
    }
})