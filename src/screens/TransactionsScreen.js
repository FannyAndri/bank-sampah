import { FlatList, View, Text, StyleSheet, ActivityIndicator } from "react-native";
import { useEffect, useState } from "react";
import { getTransactions } from "../api/user";
import TransactionCard from "../components/TransactionCard";
import { colors, spacing, typography } from "../theme";

export default function TransactionsScreen({ navigation }) {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    getTransactions()
      .then((res) => {
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
        <ActivityIndicator size="large" color={colors.primary[500]} />
        <Text style={styles.loadingText}>Memuat transaksi...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.center}>
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Riwayat Transaksi</Text>
        <Text style={styles.subtitle}>
          {data.length} transaksi ditemukan
        </Text>
      </View>
      <FlatList
        data={data}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={[
          styles.listContent,
          data.length === 0 && styles.emptyContainer,
        ]}
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Text style={styles.emptyIcon}>📋</Text>
            <Text style={styles.emptyText}>Belum ada transaksi</Text>
            <Text style={styles.emptySubtext}>
              Transaksi Anda akan muncul di sini
            </Text>
          </View>
        }
        renderItem={({ item }) => (
          <TransactionCard
            data={item}
            onPress={() =>
              navigation.navigate("TransactionDetail", { id: item.id })
            }
          />
        )}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.paper,
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: colors.background.paper,
  },
  loadingText: {
    ...typography.body2,
    color: colors.text.secondary,
    marginTop: spacing.md,
  },
  errorText: {
    ...typography.body1,
    color: colors.error,
    textAlign: "center",
  },
  header: {
    backgroundColor: colors.primary[500],
    paddingTop: spacing.xl,
    paddingBottom: spacing.lg,
    paddingHorizontal: spacing.lg,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
  },
  title: {
    ...typography.h3,
    color: colors.text.white,
    fontWeight: "bold",
    marginBottom: spacing.xs,
  },
  subtitle: {
    ...typography.body2,
    color: colors.primary[50],
  },
  listContent: {
    paddingVertical: spacing.md,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: spacing.xl,
  },
  emptyState: {
    alignItems: "center",
    paddingVertical: spacing.xxl,
  },
  emptyIcon: {
    fontSize: 64,
    marginBottom: spacing.md,
  },
  emptyText: {
    ...typography.h5,
    color: colors.text.primary,
    marginBottom: spacing.xs,
  },
  emptySubtext: {
    ...typography.body2,
    color: colors.text.secondary,
    textAlign: "center",
  },
});
