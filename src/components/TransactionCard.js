import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { colors, spacing, typography } from "../theme";

export default function TransactionCard({ data, onPress }) {
  if (!data) return null;

  const code = data.transaction_code || "-";
  const total = Number(data.total_amount || 0).toLocaleString("id-ID");
  
  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return "";
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString("id-ID", {
        day: "numeric",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch {
      return dateString;
    }
  };

  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.7}>
      <View style={styles.card}>
        <View style={styles.content}>
          <View style={styles.leftSection}>
            <View style={styles.iconContainer}>
              <Text style={styles.iconText}>♻️</Text>
            </View>
            <View style={styles.textContainer}>
              <Text style={styles.code} numberOfLines={1}>{code}</Text>
              {data.created_at && (
                <Text style={styles.date}>{formatDate(data.created_at)}</Text>
              )}
            </View>
          </View>
          <View style={styles.rightSection}>
            <Text style={styles.amount}>Rp {total}</Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.background.default,
    marginHorizontal: spacing.lg,
    marginVertical: spacing.xs,
    borderRadius: 12,
    padding: spacing.md,
    elevation: 2,
    shadowColor: colors.gray[900],
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    borderLeftWidth: 4,
    borderLeftColor: colors.primary[500],
  },
  content: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  leftSection: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
    marginRight: spacing.md,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: colors.primary[50],
    justifyContent: "center",
    alignItems: "center",
    marginRight: spacing.md,
  },
  iconText: {
    fontSize: 24,
  },
  textContainer: {
    flex: 1,
  },
  code: {
    ...typography.body1,
    fontWeight: "600",
    color: colors.text.primary,
    marginBottom: spacing.xs,
  },
  date: {
    ...typography.caption,
    color: colors.text.secondary,
  },
  rightSection: {
    alignItems: "flex-end",
  },
  amount: {
    ...typography.h6,
    fontWeight: "bold",
    color: colors.primary[600],
  },
});
