// hooks/useHaptics.ts
import * as Haptics from "expo-haptics";

/**
 * Centralized haptics hook — reusable across the app.
 * Provides a consistent API for common feedback types.
 */
export function useHaptics() {
  return {
    // Simple taps / selections
    select: () => Haptics.selectionAsync(),

    // Impact feedback — light/medium/heavy taps
    light: () => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light),
    medium: () => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium),
    heavy: () => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy),

    // Notifications
    success: () =>
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success),
    warning: () =>
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning),
    error: () =>
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error),
  };
}
