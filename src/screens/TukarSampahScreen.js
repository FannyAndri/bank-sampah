import { View, Text, StyleSheet, ScrollView, Alert, ActivityIndicator, KeyboardAvoidingView, Platform } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useState, useMemo } from "react";
import { TextInput, Button, Card } from "react-native-paper";
import { spacing } from "../theme";
import { useSettings } from "../context/SettingsContext";

export default function TukarSampahScreen({ navigation }) {
  const [memberCode, setMemberCode] = useState("");
  const [loading, setLoading] = useState(false);
  const insets = useSafeAreaInsets();
  const { colors, typography } = useSettings();
  const styles = useMemo(() => createStyles(colors, typography, insets), [colors, typography, insets]);

  const handleScanQR = () => {
    Alert.alert(
      "Scan QR Code",
      "Fitur scan QR code akan segera tersedia. Untuk saat ini, silakan masukkan Member Code secara manual.",
      [{ text: "OK" }]
    );
  };

  const handleSubmit = async () => {
    if (!memberCode.trim()) {
      Alert.alert("Error", "Masukkan Member Code terlebih dahulu");
      return;
    }

    Alert.alert(
      "Info",
      "Fitur ini memerlukan integrasi dengan sistem kasir. Silakan hubungi kasir untuk melakukan transaksi.",
      [{ text: "OK" }]
    );
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
            <Text style={styles.headerIconText}>♻️</Text>
          </View>
          <Text style={styles.title}>Tukar Sampah</Text>
          <Text style={styles.subtitle}>
            Lakukan transaksi penukaran sampah dengan kasir
          </Text>
        </View>

        {/* Instructions Card */}
        <Card style={styles.instructionCard} mode="elevated" elevation={2}>
          <View style={styles.instructionContent}>
            <Text style={styles.instructionTitle}>📋 Cara Menggunakan</Text>
            <Text style={styles.instructionText}>
              1. Tunjukkan QR Code Member Anda ke kasir{'\n'}
              2. Atau masukkan Member Code Anda{'\n'}
              3. Kasir akan memproses transaksi sampah Anda{'\n'}
              4. Saldo akan otomatis ditambahkan ke akun
            </Text>
          </View>
        </Card>

        {/* QR Code Section */}
        <Card style={styles.qrCard} mode="elevated" elevation={2}>
          <View style={styles.qrCardContent}>
            <Text style={styles.qrCardTitle}>QR Code Member</Text>
            <Text style={styles.qrCardSubtitle}>
              Tunjukkan QR code ini ke kasir untuk transaksi cepat
            </Text>
            <Button
              mode="contained"
              onPress={() => navigation.navigate("QRCode")}
              style={styles.qrButton}
              contentStyle={styles.qrButtonContent}
              buttonColor={colors.primary[500]}
              textColor={colors.text.white}
              icon="qrcode"
            >
              Lihat QR Code
            </Button>
          </View>
        </Card>

        {/* Manual Input Section */}
        <Card style={styles.inputCard} mode="elevated" elevation={2}>
          <View style={styles.inputCardContent}>
            <Text style={styles.inputCardTitle}>Atau Masukkan Manual</Text>
            <TextInput
              label="Member Code"
              value={memberCode}
              onChangeText={setMemberCode}
              mode="outlined"
              placeholder="Masukkan Member Code"
              style={styles.input}
              contentStyle={styles.inputContent}
              outlineColor={colors.border.light}
              activeOutlineColor={colors.primary[500]}
              left={<TextInput.Icon icon="account" iconColor={colors.primary[500]} />}
              theme={{ colors: { background: colors.background.default, text: colors.text.primary } }}
            />
            <Button
              mode="contained"
              onPress={handleSubmit}
              loading={loading}
              disabled={loading || !memberCode.trim()}
              style={styles.submitButton}
              contentStyle={styles.buttonContent}
              buttonColor={colors.primary[500]}
              textColor={colors.text.white}
            >
              {loading ? "Memproses..." : "Lanjutkan"}
            </Button>
          </View>
        </Card>

        {/* Info Section */}
        <Card style={styles.infoCard} mode="elevated" elevation={1}>
          <View style={styles.infoCardContent}>
            <Text style={styles.infoCardTitle}>ℹ️ Informasi</Text>
            <Text style={styles.infoCardText}>
              • Transaksi harus dilakukan di lokasi Bank Sampah{'\n'}
              • Pastikan Member Code Anda sudah terdaftar{'\n'}
              • Saldo akan langsung masuk setelah transaksi selesai
            </Text>
          </View>
        </Card>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const createStyles = (colors, typography, insets) => StyleSheet.create({
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
    paddingTop: insets.top + spacing.sm,
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
  instructionCard: {
    marginHorizontal: spacing.lg,
    marginTop: -spacing.lg,
    borderRadius: 16,
    backgroundColor: colors.secondary[50], // Check if this exists in palette or needs fallback
    marginBottom: spacing.lg,
  },
  instructionContent: {
    padding: spacing.md,
  },
  instructionTitle: {
    ...typography.h6,
    color: colors.text.primary,
    fontWeight: "600",
    marginBottom: spacing.sm,
  },
  instructionText: {
    ...typography.body2,
    color: colors.text.secondary,
    lineHeight: 22,
  },
  qrCard: {
    marginHorizontal: spacing.lg,
    marginBottom: spacing.lg,
    borderRadius: 16,
    backgroundColor: colors.background.default,
  },
  qrCardContent: {
    padding: spacing.lg,
    alignItems: "center",
  },
  qrCardTitle: {
    ...typography.h5,
    color: colors.text.primary,
    fontWeight: "600",
    marginBottom: spacing.xs,
  },
  qrCardSubtitle: {
    ...typography.body2,
    color: colors.text.secondary,
    textAlign: "center",
    marginBottom: spacing.md,
  },
  qrButton: {
    borderRadius: 12,
    elevation: 2,
  },
  qrButtonContent: {
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.lg,
  },
  inputCard: {
    marginHorizontal: spacing.lg,
    marginBottom: spacing.lg,
    borderRadius: 16,
    backgroundColor: colors.background.default,
  },
  inputCardContent: {
    padding: spacing.lg,
  },
  inputCardTitle: {
    ...typography.h6,
    color: colors.text.primary,
    fontWeight: "600",
    marginBottom: spacing.md,
  },
  input: {
    marginBottom: spacing.md,
    backgroundColor: colors.background.default,
  },
  inputContent: {
    fontSize: 16,
    color: colors.text.primary,
  },
  submitButton: {
    borderRadius: 12,
    elevation: 2,
  },
  buttonContent: {
    paddingVertical: spacing.sm,
  },
  infoCard: {
    marginHorizontal: spacing.lg,
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
