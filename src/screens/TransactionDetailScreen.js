import { View, Text, StyleSheet, ScrollView, ActivityIndicator } from "react-native";
import { useEffect, useState } from "react";
import { getTransactionDetail } from "../api/user";
import { Card } from "react-native-paper";
import { colors, spacing, typography } from "../theme";

export default function TransactionDetailScreen({ route }) {
  const { id } = route.params;
  const [trx, setTrx] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    getTransactionDetail(id)
      .then((res) => {
        setTrx(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Transaction detail error:", err);
        setError(err?.response?.data?.message || "Gagal memuat detail transaksi");
        setLoading(false);
      });
  }, [id]);

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color={colors.primary[500]} />
        <Text style={styles.loadingText}>Memuat detail transaksi...</Text>
      </View>
    );
  }

  if (error || !trx) {
    return (
      <View style={styles.center}>
        <Text style={styles.errorText}>
          {error || "Data transaksi tidak ditemukan"}
        </Text>
      </View>
    );
  }

  const formatDate = (dateString) => {
    if (!dateString) return "-";
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString("id-ID", {
        day: "numeric",
        month: "long",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch {
      return dateString;
    }
  };

  const formatCurrency = (amount) => {
    return Number(amount || 0).toLocaleString("id-ID");
  };

  return (
    <ScrollView 
      contentContainerStyle={styles.container}
      showsVerticalScrollIndicator={false}
    >
      {/* Header Card */}
      <Card style={styles.headerCard} mode="elevated" elevation={4}>
        <View style={styles.headerContent}>
          <View style={styles.headerIcon}>
            <Text style={styles.headerIconText}>♻️</Text>
          </View>
          <View style={styles.headerText}>
            <Text style={styles.headerTitle}>Detail Transaksi</Text>
            <Text style={styles.headerCode}>{trx.transaction_code}</Text>
          </View>
        </View>
      </Card>

      {/* Transaction Info */}
      <Card style={styles.infoCard} mode="elevated" elevation={2}>
        <View style={styles.infoSection}>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Tanggal</Text>
            <Text style={styles.infoValue}>{formatDate(trx.created_at)}</Text>
          </View>
          {trx.cashier_name && (
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Kasir</Text>
              <Text style={styles.infoValue}>{trx.cashier_name}</Text>
            </View>
          )}
          <View style={[styles.infoRow, styles.totalRow]}>
            <Text style={styles.totalLabel}>Total</Text>
            <Text style={styles.totalValue}>Rp {formatCurrency(trx.total_amount)}</Text>
          </View>
        </View>
      </Card>

      {/* Items List */}
      {trx.items && trx.items.length > 0 && (
        <Card style={styles.itemsCard} mode="elevated" elevation={2}>
          <Text style={styles.itemsTitle}>Item Transaksi</Text>
          {trx.items.map((item, index) => (
            <View key={index} style={styles.itemRow}>
              <View style={styles.itemLeft}>
                <View style={styles.itemIcon}>
                  <Text style={styles.itemIconText}>📦</Text>
                </View>
                <View style={styles.itemInfo}>
                  <Text style={styles.itemName}>{item.waste_type_name}</Text>
                  <Text style={styles.itemDetail}>
                    {item.weight} kg × Rp {formatCurrency(item.price_per_kg)}
                  </Text>
                </View>
              </View>
              <Text style={styles.itemSubtotal}>
                Rp {formatCurrency(item.subtotal)}
              </Text>
            </View>
          ))}
        </Card>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: colors.background.paper,
    padding: spacing.lg,
    paddingBottom: spacing.xl,
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
  headerCard: {
    borderRadius: 20,
    backgroundColor: colors.primary[500],
    marginBottom: spacing.lg,
    overflow: "hidden",
  },
  headerContent: {
    flexDirection: "row",
    alignItems: "center",
    padding: spacing.lg,
  },
  headerIcon: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    justifyContent: "center",
    alignItems: "center",
    marginRight: spacing.md,
  },
  headerIconText: {
    fontSize: 32,
  },
  headerText: {
    flex: 1,
  },
  headerTitle: {
    ...typography.body2,
    color: colors.primary[50],
    marginBottom: spacing.xs,
  },
  headerCode: {
    ...typography.h4,
    color: colors.text.white,
    fontWeight: "bold",
  },
  infoCard: {
    borderRadius: 16,
    padding: spacing.lg,
    marginBottom: spacing.lg,
    backgroundColor: colors.background.default,
  },
  infoSection: {
    gap: spacing.md,
  },
  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: colors.border.light,
  },
  infoLabel: {
    ...typography.body2,
    color: colors.text.secondary,
  },
  infoValue: {
    ...typography.body1,
    color: colors.text.primary,
    fontWeight: "500",
  },
  totalRow: {
    borderBottomWidth: 0,
    marginTop: spacing.xs,
    paddingTop: spacing.md,
    borderTopWidth: 2,
    borderTopColor: colors.primary[200],
  },
  totalLabel: {
    ...typography.h6,
    color: colors.text.primary,
    fontWeight: "600",
  },
  totalValue: {
    ...typography.h4,
    color: colors.primary[600],
    fontWeight: "bold",
  },
  itemsCard: {
    borderRadius: 16,
    padding: spacing.lg,
    backgroundColor: colors.background.default,
  },
  itemsTitle: {
    ...typography.h6,
    color: colors.text.primary,
    marginBottom: spacing.md,
    fontWeight: "600",
  },
  itemRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.border.light,
  },
  itemLeft: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
    marginRight: spacing.md,
  },
  itemIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.primary[50],
    justifyContent: "center",
    alignItems: "center",
    marginRight: spacing.md,
  },
  itemIconText: {
    fontSize: 20,
  },
  itemInfo: {
    flex: 1,
  },
  itemName: {
    ...typography.body1,
    color: colors.text.primary,
    fontWeight: "600",
    marginBottom: spacing.xs,
  },
  itemDetail: {
    ...typography.caption,
    color: colors.text.secondary,
  },
  itemSubtotal: {
    ...typography.body1,
    color: colors.primary[600],
    fontWeight: "bold",
  },
});
