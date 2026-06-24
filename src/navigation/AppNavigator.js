import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { useEffect, useState } from "react";
import { View, ActivityIndicator, Platform } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Icon } from "react-native-paper";
import { getToken } from "../store/authStore";
import { hasSeenOnboarding, setOnboardingSeen } from "../store/onboardingStore";
// import { colors } from "../theme"; // Removed unused import
import { useSettings } from "../context/SettingsContext";

// Auth Screens
import OnboardingScreen from "../screens/OnboardingScreen";
import LoginScreen from "../screens/LoginScreen";
import RegisterScreen from "../screens/RegisterScreen";

// Main Screens
import DashboardScreen from "../screens/DashboardScreen";
import TukarSampahScreen from "../screens/TukarSampahScreen";
import TransactionsScreen from "../screens/TransactionsScreen";
import ProfileScreen from "../screens/ProfileScreen";

// Detail Screens
import TransactionDetailScreen from "../screens/TransactionDetailScreen";
import EditProfileScreen from "../screens/EditProfileScreen";
import QRCodeScreen from "../screens/QRCodeScreen";
import WithdrawScreen from "../screens/WithdrawScreen";
import SettingsScreen from "../screens/SettingsScreen";

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

export const navigationRef = { current: null };

// Tab Navigator untuk main screens
function MainTabs() {
  const insets = useSafeAreaInsets();
  const { colors } = useSettings();

  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.primary[600],
        tabBarInactiveTintColor: colors.text.secondary,
        tabBarStyle: {
          backgroundColor: colors.background.default,
          borderTopWidth: 1,
          borderTopColor: colors.border.light,
          height: Platform.OS === "ios" ? 65 + insets.bottom : 70 + (insets.bottom > 0 ? insets.bottom : 0),
          paddingBottom: insets.bottom > 0 ? insets.bottom : (Platform.OS === "ios" ? 0 : 12),
          paddingTop: 12,
          elevation: 20,
          shadowColor: colors.gray[900],
          shadowOffset: { width: 0, height: -4 },
          shadowOpacity: 0.1,
          shadowRadius: 10,
        },
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: "600",
          marginTop: -4,
        },
        tabBarIconStyle: {
          marginTop: 4,
        },
      }}
    >
      <Tab.Screen
        name="Home"
        component={DashboardScreen}
        options={{
          tabBarLabel: "Beranda",
          tabBarIcon: ({ color, size }) => (
            <Icon source="home" size={24} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="TukarSampah"
        component={TukarSampahScreen}
        options={{
          tabBarLabel: "Tukar Sampah",
          tabBarIcon: ({ color, size }) => (
            <Icon source="recycle" size={24} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Transactions"
        component={TransactionsScreen}
        options={{
          tabBarLabel: "Riwayat",
          tabBarIcon: ({ color, size }) => (
            <Icon source="history" size={24} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          tabBarLabel: "Profil",
          tabBarIcon: ({ color, size }) => (
            <Icon source="account" size={24} color={color} />
          ),
        }}
      />
    </Tab.Navigator>
  );
}

export default function AppNavigator() {
  const [initialRoute, setInitialRoute] = useState(null);
  const [showOnboarding, setShowOnboarding] = useState(false);
  const { colors } = useSettings();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const seenOnboarding = await hasSeenOnboarding();
        if (!seenOnboarding) {
          setShowOnboarding(true);
          setInitialRoute("Onboarding");
        } else {
          const token = await getToken();
          if (token) {
            console.log("Token found, redirecting to MainTabs");
            setInitialRoute("MainTabs");
          } else {
            console.log("No token found, redirecting to Login");
            setInitialRoute("Login");
          }
        }
      } catch (error) {
        console.error("Auth check failed", error);
        setInitialRoute("Login");
      }
    };
    checkAuth();
  }, []);

  const handleOnboardingComplete = async () => {
    await setOnboardingSeen();
    const token = await getToken();
    if (token) {
      setInitialRoute("MainTabs");
    } else {
      setInitialRoute("Login");
    }
    setShowOnboarding(false);
  };

  if (!initialRoute) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color={colors.primary[500]} />
      </View>
    );
  }

  if (showOnboarding && initialRoute === "Onboarding") {
    return <OnboardingScreen onComplete={handleOnboardingComplete} />;
  }

  return (
    <Stack.Navigator
      initialRouteName={initialRoute}
      screenOptions={{
        headerStyle: {
          backgroundColor: colors.primary[500],
        },
        headerTintColor: colors.text.white,
        headerTitleStyle: {
          fontWeight: "bold",
        },
      }}
    >
      {/* Onboarding */}
      <Stack.Screen
        name="Onboarding"
        options={{ headerShown: false }}
      >
        {() => <OnboardingScreen onComplete={handleOnboardingComplete} />}
      </Stack.Screen>

      {/* Auth Stack */}
      <Stack.Screen
        name="Login"
        component={LoginScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Register"
        component={RegisterScreen}
        options={{ headerShown: false }}
      />

      {/* Main Tabs */}
      <Stack.Screen
        name="MainTabs"
        component={MainTabs}
        options={{ headerShown: false }}
      />

      {/* Detail Screens */}
      <Stack.Screen
        name="TransactionDetail"
        component={TransactionDetailScreen}
        options={{
          title: "Detail Transaksi",
          headerShown: true,
        }}
      />
      <Stack.Screen
        name="EditProfile"
        component={EditProfileScreen}
        options={{
          title: "Edit Profil",
          headerShown: true,
        }}
      />
      <Stack.Screen
        name="QRCode"
        component={QRCodeScreen}
        options={{
          title: "QR Code Member",
          headerShown: true,
        }}
      />
      <Stack.Screen
        name="Withdraw"
        component={WithdrawScreen}
        options={{
          title: "Tarik Saldo",
          headerShown: true,
        }}
      />
      <Stack.Screen
        name="Settings"
        component={SettingsScreen}
        options={{
          title: "Pengaturan",
          headerShown: true,
        }}
      />
    </Stack.Navigator>
  );
}
