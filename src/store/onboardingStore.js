import * as SecureStore from "expo-secure-store";
import { Platform } from "react-native";

const ONBOARDING_KEY = "has_seen_onboarding";

export const hasSeenOnboarding = async () => {
  try {
    if (Platform.OS === "web") {
      return localStorage.getItem(ONBOARDING_KEY) === "true";
    } else {
      const value = await SecureStore.getItemAsync(ONBOARDING_KEY);
      return value === "true";
    }
  } catch (error) {
    console.error("Error checking onboarding:", error);
    return false;
  }
};

export const setOnboardingSeen = async () => {
  try {
    if (Platform.OS === "web") {
      localStorage.setItem(ONBOARDING_KEY, "true");
    } else {
      await SecureStore.setItemAsync(ONBOARDING_KEY, "true");
    }
  } catch (error) {
    console.error("Error setting onboarding:", error);
  }
};
