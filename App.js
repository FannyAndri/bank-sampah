import { NavigationContainer } from "@react-navigation/native";
import AppNavigator, { navigationRef } from "./src/navigation/AppNavigator";
import { Provider as PaperProvider } from "react-native-paper";

export default function App() {
  return (
    <PaperProvider>
      <NavigationContainer ref={navigationRef}>
        <AppNavigator />
      </NavigationContainer>
    </PaperProvider>
  );
}
