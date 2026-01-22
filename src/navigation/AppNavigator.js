import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { useEffect, useState } from "react";
import { View, ActivityIndicator } from "react-native";
import { getToken } from "../store/authStore";
import LoginScreen from "../screens/LoginScreen";
import RegisterScreen from "../screens/RegisterScreen";
import DashboardScreen from "../screens/DashboardScreen";
import ProfileScreen from "../screens/ProfileScreen";
import TransactionsScreen from "../screens/TransactionsScreen";
import TransactionDetailScreen from "../screens/TransactionDetailScreen";
import WithdrawScreen from "../screens/WithdrawScreen";

const Stack = createNativeStackNavigator();

export default function AppNavigator() {
  const [initialRoute, setInitialRoute] = useState(null);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const token = await getToken();
        if (token) {
          console.log("Token found, redirecting to Dashboard");
          setInitialRoute("Dashboard");
        } else {
          console.log("No token found, redirecting to Login");
          setInitialRoute("Login");
        }
      } catch (error) {
        console.error("Auth check failed", error);
        setInitialRoute("Login");
      }
    };
    checkAuth();
  }, []);

  if (!initialRoute) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <Stack.Navigator initialRouteName={initialRoute}>
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Register" component={RegisterScreen} />
      <Stack.Screen name="Dashboard" component={DashboardScreen} />
      <Stack.Screen name="Profile" component={ProfileScreen} />
      <Stack.Screen name="Transactions" component={TransactionsScreen} />
      <Stack.Screen
        name="TransactionDetail"
        component={TransactionDetailScreen}
      />
      <Stack.Screen name="Withdraw" component={WithdrawScreen} />
    </Stack.Navigator>
  );
}
