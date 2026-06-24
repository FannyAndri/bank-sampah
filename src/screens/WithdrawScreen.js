import { View, Text, StyleSheet, ScrollView, Alert, ActivityIndicator, KeyboardAvoidingView, Platform } from "react-native";
import { TextInput, Button, Card } from "react-native-paper";
import { useState, useMemo } from "react";
import { withdraw } from "../api/user";
import { spacing } from "../theme";
import { useSettings } from "../context/SettingsContext";

export default function WithdrawScreen() {
  const [amount, setAmount] = useState("");
  const [loading, setLoading] = useState(false);

  const { colors, typography } = useSettings();
  const styles = useMemo(() => createStyles(colors, typography), [colors, typography]);

  const submit = async () => {
    if (!amount) {
      Alert.alert("Error", "Masukkan jumlah penarikan");
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

      Alert.alert("Berhasil", message, [
        {
          text: "OK",
          onPress: () => setAmount(""),
        },
      ]);
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

  const formatCurrency = (value) => {
    if (!value) return "";
    const num = Number(value.replace(/\D/g, ""));
    return num.toLocaleString("id-ID");
  };

  const handleAmountChange = (text) => {
    const numericValue = text.replace(/\D/g, "");
    setAmount(numericValue);
  };

  return (
    <KeyboardAvoidingView
      style={styles.keyboardView}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={Platform.OS === "ios" ? 90 : 20}
    >
      <ScrollView
        contentContainerStyle={styles.container}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerIcon}>
            <Text style={styles.headerIconText}>💸</Text>
          </View>
          <Text style={styles.title}>Tarik Saldo</Text>
          <Text style={styles.subtitle}>
            Masukkan jumlah saldo yang ingin ditarik
          </Text>
        </View>

        {/* Form Card */}
        <Card style={styles.card} mode="elevated" elevation={2}>
          <View style={styles.cardContent}>
            <View style={styles.inputSection}>
              <Text style={styles.inputLabel}>Jumlah Penarikan</Text>
              <View style={styles.inputContainer}>
                <Text style={styles.currencyPrefix}>Rp</Text>
                <TextInput
                  value={amount ? formatCurrency(amount) : ""}
                  onChangeText={handleAmountChange}
                  keyboardType="numeric"
                  mode="outlined"
                  placeholder="0"
                  style={styles.input}
                  contentStyle={styles.inputContent}
                  outlineColor={colors.border.light}
                  activeOutlineColor={colors.primary[500]}
                  left={<TextInput.Icon icon="cash" iconColor={colors.primary[500]} />}
                  theme={{ colors: { background: colors.background.default, text: colors.text.primary, placeholder: colors.text.secondary } }}
                />
              </View>
              <Text style={styles.inputHint}>
                Minimal penarikan: Rp 10.000
              </Text>
            </View>

            <View style={styles.infoBox}>
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Biaya Admin</Text>
                <Text style={styles.infoValue}>Gratis</Text>
              </View>
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Waktu Proses</Text>
                <Text style={styles.infoValue}>1-3 Hari Kerja</Text>
              </View>
            </View>

            <Button
              mode="contained"
              onPress={submit}
              loading={loading}
              disabled={loading || !amount}
              style={styles.submitButton}
              contentStyle={styles.buttonContent}
              buttonColor={colors.primary[500]}
              textColor={colors.text.white}
            >
              {loading ? "Mengajukan..." : "Ajukan Penarikan"}
            </Button>
          </View>
        </Card>

        {/* Info Section */}
        <Card style={styles.infoCard} mode="elevated" elevation={1}>
          <View style={styles.infoCardContent}>
            <Text style={styles.infoCardTitle}>ℹ️ Informasi</Text>
            <Text style={styles.infoCardText}>
              • Penarikan akan diproses dalam 1-3 hari kerja{'\n'}
              • Saldo akan ditransfer ke rekening yang terdaftar{'\n'}
              • Pastikan data rekening Anda sudah lengkap
            </Text>
          </View>
        </Card>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const createStyles = (colors, typography) => StyleSheet.create({
  keyboardView: {
    flex: 1,
  },
  container: {
    flexGrow: 1,
    backgroundColor: colors.background.paper,
    paddingBottom: spacing.xl,
  },
  header: {
    alignItems: "center",
    paddingTop: spacing.xl,
    paddingBottom: spacing.lg,
    paddingHorizontal: spacing.lg,
    backgroundColor: colors.primary[500],
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
  },
  headerIcon: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: spacing.md,
  },
  headerIconText: {
    fontSize: 40,
  },
  title: {
    ...typography.h3,
    color: colors.text.white,
    fontWeight: "bold",
    marginBottom: spacing.xs,
    textAlign: "center",
  },
  subtitle: {
    ...typography.body2,
    color: colors.primary[50],
    textAlign: "center",
  },
  card: {
    marginHorizontal: spacing.lg,
    marginTop: -spacing.lg,
    borderRadius: 20,
    backgroundColor: colors.background.default,
  },
  cardContent: {
    padding: spacing.lg,
  },
  inputSection: {
    marginBottom: spacing.lg,
  },
  inputLabel: {
    ...typography.body2,
    color: colors.text.primary,
    fontWeight: "600",
    marginBottom: spacing.sm,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  currencyPrefix: {
    ...typography.h5,
    color: colors.text.primary,
    marginRight: spacing.sm,
    fontWeight: "600",
  },
  input: {
    flex: 1,
    backgroundColor: colors.background.default,
  },
  inputContent: {
    fontSize: 18,
    fontWeight: "600",
  },
  inputHint: {
    ...typography.caption,
    color: colors.text.secondary,
    marginTop: spacing.xs,
  },
  infoBox: {
    backgroundColor: colors.primary[50],
    borderRadius: 12,
    padding: spacing.md,
    marginBottom: spacing.lg,
  },
  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: spacing.xs,
  },
  infoLabel: {
    ...typography.body2,
    color: colors.text.secondary,
  },
  infoValue: {
    ...typography.body2,
    color: colors.primary[700],
    fontWeight: "600",
  },
  submitButton: {
    borderRadius: 12,
    elevation: 2,
    shadowColor: colors.primary[500],
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  buttonContent: {
    paddingVertical: spacing.sm,
  },
  infoCard: {
    marginHorizontal: spacing.lg,
    marginTop: spacing.lg,
    borderRadius: 16,
    backgroundColor: colors.background.default,
  },
  infoCardContent: {
    padding: spacing.md,
  },
  infoCardTitle: {
    ...typography.body1,
    color: colors.text.primary,
    fontWeight: "600",
    marginBottom: spacing.sm,
  },
  infoCardText: {
    ...typography.body2,
    color: colors.text.secondary,
    lineHeight: 22,
  },
});
