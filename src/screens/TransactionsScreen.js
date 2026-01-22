import { FlatList, View, Text, StyleSheet } from "react-native";
import { useEffect, useState } from "react";
import { getTransactions } from "../api/user";
import TransactionCard from "../components/TransactionCard";

export default function TransactionsScreen({ navigation }) {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    getTransactions()
      .then((res) => {
        // API mengembalikan bentuk paginasi Laravel: { current_page, data: [...] }
        const list = res.data?.data ?? [];
        setData(list);
        setLoading(false);
      })
      .catch((err) => {
        console.error("❌ Transactions API Error:", err);
        setError(err?.response?.data?.message || "Gagal memuat transaksi");
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <View style={styles.center}>
        <Text>Memuat transaksi...</Text>
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

  return (
    <FlatList
      data={data}
      keyExtractor={(item) => item.id.toString()}
      contentContainerStyle={data.length === 0 && styles.center}
      ListEmptyComponent={
        <Text style={styles.emptyText}>Belum ada transaksi</Text>
      }
      renderItem={({ item }) => (
        <TransactionCard
          data={item}
          onPress={() =>
            navigation.navigate("TransactionDetail", { id: item.id })
          }
        />
      )}
    />
  );
}

const styles = StyleSheet.create({
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  emptyText: {
    fontSize: 14,
    color: "#777",
  },
});
