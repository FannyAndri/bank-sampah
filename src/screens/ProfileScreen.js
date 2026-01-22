import { View, Text, Image, StyleSheet, ScrollView, Alert } from "react-native";
import { useEffect, useState } from "react";
import { getProfile } from "../api/user";
import { logoutApi } from "../api/auth";
import { removeToken } from "../store/authStore";
import { Card, Button } from "react-native-paper";

export default function ProfileScreen() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  useEffect(() => {
    getProfile()
      .then((res) => {
        const userData = res.data?.data ?? res.data;
        setUser(userData);
        setLoading(false);
      })
      .catch((err) => {
        console.error("❌ Profile API Error:", err);
        setError(err?.response?.data?.message || "Gagal memuat profil");
        setLoading(false);
      });
  }, []);

  const handleLogout = async () => {
    // Prevent multiple calls
    if (isLoggingOut) return;
    
    setIsLoggingOut(true);
    
    try {
      // Try to logout via API first (while token still exists)
      await logoutApi();
    } catch (e) {
      // If API fails (e.g., token already invalid, network error, or HTML response),
      // we'll still clear token locally
      console.warn("Logout API failed, clearing token locally anyway", e);
    }
    
    // Always remove token locally, regardless of API response
    await removeToken();
    setIsLoggingOut(false);
    
    Alert.alert("Logout", "Anda telah keluar", [
      {
        text: "OK",
        onPress: () => {
          // AppNavigator will automatically redirect to Login when token is null
        },
      },
    ]);
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <Text>Memuat profil...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.center}>
        <Text style={{ color: "red" }}>{error}</Text>
      </View>
    );
  }

  if (!user) {
    return (
      <View style={styles.center}>
        <Text>Data pengguna tidak ditemukan</Text>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Image
          source={{ uri: user.avatar_url }}
          style={styles.avatar}
        />
        <Text style={styles.name}>{user.name}</Text>
        <Text style={styles.email}>{user.email}</Text>
      </View>

      {/* Info Card */}
      <Card style={styles.card}>
        <View style={styles.row}>
          <Text style={styles.label}>Member Code</Text>
          <Text style={styles.value}>{user.member_code}</Text>
        </View>

        <View style={styles.row}>
          <Text style={styles.label}>Saldo</Text>
          <Text style={styles.value}>Rp {user.balance}</Text>
        </View>
      </Card>

      {/* Action */}
      <Button
        mode="outlined"
        style={styles.button}
        onPress={() => alert("Edit profil belum tersedia")}
      >
        Edit Profil
      </Button>

      <Button
        mode="contained"
        style={[styles.button, { marginTop: 12, backgroundColor: "#E53935" }]}
        onPress={handleLogout}
        disabled={isLoggingOut}
        loading={isLoggingOut}
      >
        {isLoggingOut ? "Keluar..." : "Logout"}
      </Button>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingBottom: 30,
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  header: {
    alignItems: "center",
    paddingVertical: 40,
    backgroundColor: "#4CAF50",
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    marginBottom: 20,
  },
  avatar: {
    width: 110,
    height: 110,
    borderRadius: 55,
    borderWidth: 3,
    borderColor: "#fff",
    marginBottom: 12,
  },
  name: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#fff",
  },
  email: {
    fontSize: 14,
    color: "#E8F5E9",
    marginTop: 4,
  },
  card: {
    marginHorizontal: 20,
    padding: 16,
    borderRadius: 16,
    marginBottom: 24,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 10,
    borderBottomWidth: 0.5,
    borderColor: "#ddd",
  },
  label: {
    fontSize: 14,
    color: "#666",
  },
  value: {
    fontSize: 14,
    fontWeight: "600",
  },
  button: {
    marginHorizontal: 20,
    borderRadius: 12,
  },
});
