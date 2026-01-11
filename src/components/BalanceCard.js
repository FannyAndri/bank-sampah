import { View, Text } from "react-native";

export default function BalanceCard({ balance }) {
  return (
    <View
      style={{
        backgroundColor: "#2ECC71",
        padding: 20,
        borderRadius: 12,
        marginVertical: 16,
      }}
    >
      <Text style={{ color: "white", fontSize: 16 }}>Saldo Aktif</Text>
      <Text style={{ color: "white", fontSize: 26, fontWeight: "bold" }}>
        Rp {balance}
      </Text>
    </View>
  );
}
