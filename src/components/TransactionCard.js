import { View, Text, TouchableOpacity, StyleSheet } from "react-native";

export default function TransactionCard({ data, onPress }) {
  if (!data) return null;

  const code = data.transaction_code || "-";
  const total = Number(data.total_amount || 0).toLocaleString("id-ID");

  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.7}>
      <View style={styles.card}>
        <View style={styles.row}>
          <Text style={styles.code}>{code}</Text>
          <Text style={styles.amount}>Rp {total}</Text>
        </View>

        {data.created_at && (
          <Text style={styles.meta}>{data.created_at}</Text>
        )}
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 0.5,
    borderBottomColor: "#ddd",
    backgroundColor: "#fff",
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  code: {
    fontSize: 14,
    fontWeight: "600",
    color: "#333",
  },
  amount: {
    fontSize: 14,
    fontWeight: "700",
    color: "#4CAF50",
  },
  meta: {
    marginTop: 4,
    fontSize: 12,
    color: "#888",
  },
});
