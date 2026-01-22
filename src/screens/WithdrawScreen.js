import { View, Text, StyleSheet, Alert } from "react-native";
import { TextInput, Button, Card } from "react-native-paper";
import { useState } from "react";
import { withdraw } from "../api/user";

export default function WithdrawScreen() {
  const [amount, setAmount] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async () => {
    if (!amount) {
      alert("Masukkan jumlah penarikan");
      return;
    }

    const numericAmount = Number(amount);
    if (Number.isNaN(numericAmount) || numericAmount <= 0) {
      Alert.alert("Error", "Jumlah penarikan harus lebih dari 0");
      return;
    }

    try {
      setLoading(true);
      const res = await withdraw(numericAmount);
      const message =
        res?.data?.message || "Permintaan penarikan berhasil dikirim";

      Alert.alert("Berhasil", message);
      setAmount("");
    } catch (err) {
      console.error("Withdraw error:", err);
      const data = err?.response?.data;
      let msg = data?.message || "Gagal mengajukan penarikan";

      if (data?.errors) {
        const detail = Object.values(data.errors).flat().join("\n");
        msg = `${msg}\n\n${detail}`;
      }

      Alert.alert("Error", msg.toString());
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      {/* Title */}
      <Text style={styles.title}>Tarik Saldo</Text>
      <Text style={styles.subtitle}>
        Masukkan jumlah saldo yang ingin ditarik
      </Text>

      {/* Card */}
      <Card style={styles.card}>
        <TextInput
          label="Jumlah Penarikan"
          keyboardType="numeric"
          value={amount}
          onChangeText={setAmount}
          mode="outlined"
          left={<TextInput.Affix text="Rp" />}
        />

        <Button
          mode="contained"
          onPress={submit}
          loading={loading}
          style={styles.button}
          contentStyle={{ paddingVertical: 8 }}
        >
          Ajukan Penarikan
        </Button>
      </Card>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 6,
  },
  subtitle: {
    fontSize: 14,
    color: "#666",
    marginBottom: 20,
  },
  card: {
    padding: 16,
    borderRadius: 16,
  },
  button: {
    marginTop: 20,
    borderRadius: 12,
  },
});
