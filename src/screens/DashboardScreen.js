import { View, Text, StyleSheet, ScrollView, Platform } from "react-native";
import { useEffect, useState } from "react";
import { getProfile } from "../api/user";
import QRCode from "react-native-qrcode-svg";
import { Button, Card } from "react-native-paper";

export default function DashboardScreen({ navigation }) {
  const [user, setUser] = useState(null);

  useEffect(() => {
    getProfile().then((res) => setUser(res.data?.data ?? res.data));
  }, []);

  if (!user) {
    return (
      <View style={styles.center}>
        <Text>Memuat dashboard...</Text>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* Header */}
      <Text style={styles.greeting}>Halo,</Text>
      <Text style={styles.name}>{user.name}</Text>

      {/* Saldo Card */}
      <Card style={styles.balanceCard}>
        <Text style={styles.balanceLabel}>Saldo Anda</Text>
        <Text style={styles.balanceValue}>Rp {user.balance}</Text>
      </Card>

      {/* QR Code Card */}
      <Card style={styles.qrCard}>
        <Text style={styles.qrTitle}>QR Member</Text>
        {Platform.OS !== "web" ? (
          <QRCode value={String(user.member_code ?? "")} size={160} />
        ) : (
          <Text style={{ margin: 20 }}>QR Code hanya tersedia di aplikasi mobile</Text>
        )}
        <Text style={styles.memberCode}>{user.member_code}</Text>
      </Card>

      {/* Menu */}
      <View style={styles.menu}>
        <Button
          mode="contained"
          style={styles.button}
          onPress={() => navigation.navigate("Transactions")}
        >
          Riwayat Transaksi
        </Button>

        <Button
          mode="contained"
          style={styles.button}
          onPress={() => navigation.navigate("Withdraw")}
        >
          Tarik Saldo
        </Button>

        <Button
          mode="outlined"
          style={styles.button}
          onPress={() => navigation.navigate("Profile")}
        >
          Profil
        </Button>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  greeting: {
    fontSize: 18,
    color: "#666",
  },
  name: {
    fontSize: 26,
    fontWeight: "bold",
    marginBottom: 20,
  },
  balanceCard: {
    padding: 20,
    borderRadius: 16,
    backgroundColor: "#4CAF50",
    marginBottom: 20,
  },
  balanceLabel: {
    color: "#E8F5E9",
    fontSize: 14,
  },
  balanceValue: {
    color: "#FFFFFF",
    fontSize: 28,
    fontWeight: "bold",
    marginTop: 6,
  },
  qrCard: {
    alignItems: "center",
    padding: 20,
    borderRadius: 16,
    marginBottom: 24,
  },
  qrTitle: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 12,
  },
  memberCode: {
    marginTop: 10,
    fontSize: 12,
    color: "#777",
  },
  menu: {
    gap: 12,
  },
  button: {
    borderRadius: 12,
    paddingVertical: 6,
  },
});
