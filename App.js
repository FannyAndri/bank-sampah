import { NavigationContainer } from "@react-navigation/native";
import AppNavigator, { navigationRef } from "./src/navigation/AppNavigator";
import { Provider as PaperProvider } from "react-native-paper";
import { SettingsProvider } from "./src/context/SettingsContext";
import { SafeAreaProvider } from "react-native-safe-area-context";

export default function App() {
  return (
    <SafeAreaProvider>
      <SettingsProvider>
        <PaperProvider>
          <NavigationContainer ref={navigationRef}>
            <AppNavigator />
          </NavigationContainer>
        </PaperProvider>
      </SettingsProvider>
    </SafeAreaProvider>
  );
}
