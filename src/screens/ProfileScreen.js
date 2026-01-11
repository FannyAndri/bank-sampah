import { View, Text, Image, StyleSheet, ScrollView } from "react-native";
import { useEffect, useState } from "react";
import { getProfile } from "../api/user";
import { Card, Button } from "react-native-paper";

export default function ProfileScreen() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    getProfile().then((res) => setUser(res.data));
  }, []);

  if (!user) {
    return (
      <View style={styles.center}>
        <Text>Memuat profil...</Text>
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
