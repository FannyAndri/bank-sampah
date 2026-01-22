import { View, Text, StyleSheet } from "react-native";
import { useSettings } from "../context/SettingsContext";
import { useMemo } from "react";
import { spacing } from "../theme";

export default function BalanceCard({ balance }) {
  const { colors, typography } = useSettings();
  const styles = useMemo(() => createStyles(colors, typography), [colors, typography]);

  return (
    <View style={styles.card}>
      <Text style={styles.label}>Saldo Aktif</Text>
      <Text style={styles.balance}>
        Rp {balance}
      </Text>
    </View>
  );
}

const createStyles = (colors, typography) => StyleSheet.create({
  card: {
    backgroundColor: colors.primary[500],
    padding: spacing.lg,
    borderRadius: 12,
    marginVertical: spacing.md,
    elevation: 4,
    shadowColor: colors.gray[900],
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  label: {
    ...typography.body1,
    color: colors.text.white,
  },
  balance: {
    ...typography.h4,
    color: colors.text.white,
    fontWeight: "bold",
    marginTop: spacing.xs,
  },
});
