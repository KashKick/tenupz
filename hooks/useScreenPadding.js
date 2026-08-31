import { useSafeAreaInsets } from "react-native-safe-area-context"

export function useScreenPadding({ top, bottom } = {}) {
    const insets = useSafeAreaInsets()
    const padding = {}

    if (top !== undefined) {
        padding.paddingTop = insets.top + top
    }

    if (bottom !== undefined) {
        padding.paddingBottom = insets.bottom + bottom
    }

    return padding
}
