import { View, Text, StyleSheet, ScrollView, Platform, Share, Alert } from "react-native";
import { useEffect, useState } from "react";
import { getProfile } from "../api/user";
import QRCode from "react-native-qrcode-svg";
import { Button, Card } from "react-native-paper";
import { colors, spacing, typography } from "../theme";
import { ActivityIndicator } from "react-native";

export default function QRCodeScreen() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getProfile()
      .then((res) => {
        const userData = res.data?.data ?? res.data;
        setUser(userData);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Profile error:", err);
        setLoading(false);
      });
  }, []);

  const handleShare = async () => {
    if (!user?.member_code) {
      Alert.alert("Error", "Member Code tidak tersedia");
      return;
    }

    try {
      await Share.share({
        message: `Member Code saya: ${user.member_code}\nBank Sampah Digital`,
        title: "Share Member Code",
      });
    } catch (error) {
      console.error("Share error:", error);
    }
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color={colors.primary[500]} />
        <Text style={styles.loadingText}>Memuat QR Code...</Text>
      </View>
    );
  }

  if (!user?.member_code) {
    return (
      <View style={styles.center}>
        <Text style={styles.errorText}>Member Code tidak tersedia</Text>
        <Text style={styles.errorSubtext}>
          Silakan hubungi admin untuk mendapatkan Member Code
        </Text>
      </View>
    );
  }

  return (
    <ScrollView 
      contentContainerStyle={styles.container}
      showsVerticalScrollIndicator={false}
    >
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>QR Code Member</Text>
        <Text style={styles.subtitle}>
          Tunjukkan QR code ini ke kasir untuk transaksi cepat
        </Text>
      </View>

      {/* QR Code Card */}
      <Card style={styles.qrCard} mode="elevated" elevation={4}>
        <View style={styles.qrCardContent}>
          {Platform.OS !== "web" ? (
            <View style={styles.qrWrapper}>
              <QRCode 
                value={String(user.member_code)} 
                size={280}
                color={colors.primary[700]}
                backgroundColor={colors.background.default}
              />
            </View>
          ) : (
            <View style={styles.qrPlaceholder}>
              <Text style={styles.qrPlaceholderText}>
                QR Code hanya tersedia di aplikasi mobile
              </Text>
            </View>
          )}
          
          <View style={styles.memberCodeContainer}>
            <Text style={styles.memberCodeLabel}>Member Code</Text>
            <Text style={styles.memberCode}>{user.member_code}</Text>
          </View>
        </View>
      </Card>

      {/* Info Card */}
      <Card style={styles.infoCard} mode="elevated" elevation={2}>
        <View style={styles.infoCardContent}>
          <Text style={styles.infoTitle}>📱 Cara Menggunakan</Text>
          <View style={styles.infoList}>
            <View style={styles.infoItem}>
              <Text style={styles.infoNumber}>1</Text>
              <Text style={styles.infoText}>
                Tunjukkan QR code ini ke kasir Bank Sampah
              </Text>
            </View>
            <View style={styles.infoItem}>
              <Text style={styles.infoNumber}>2</Text>
              <Text style={styles.infoText}>
                Kasir akan memindai QR code Anda
              </Text>
            </View>
            <View style={styles.infoItem}>
              <Text style={styles.infoNumber}>3</Text>
              <Text style={styles.infoText}>
                Transaksi akan diproses dan saldo ditambahkan
              </Text>
            </View>
          </View>
        </View>
      </Card>

      {/* Share Button */}
      <View style={styles.actionsSection}>
        <Button
          mode="outlined"
          onPress={handleShare}
          style={styles.shareButton}
          contentStyle={styles.buttonContent}
          textColor={colors.primary[600]}
          borderColor={colors.primary[300]}
          icon="share-variant"
        >
          Bagikan Member Code
        </Button>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: colors.background.paper,
    paddingBottom: spacing.xl,
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: colors.background.paper,
    padding: spacing.lg,
  },
  loadingText: {
    ...typography.body2,
    color: colors.text.secondary,
    marginTop: spacing.md,
  },
  errorText: {
    ...typography.h5,
    color: colors.error,
    textAlign: "center",
    marginBottom: spacing.xs,
  },
  errorSubtext: {
    ...typography.body2,
    color: colors.text.secondary,
    textAlign: "center",
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
  qrCard: {
    marginHorizontal: spacing.lg,
    marginTop: -spacing.lg,
    borderRadius: 24,
    backgroundColor: colors.background.default,
    overflow: "hidden",
  },
  qrCardContent: {
    padding: spacing.xl,
    alignItems: "center",
  },
  qrWrapper: {
    padding: spacing.lg,
    backgroundColor: colors.background.default,
    borderRadius: 20,
    borderWidth: 4,
    borderColor: colors.primary[200],
    marginBottom: spacing.lg,
    shadowColor: colors.primary[500],
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 8,
  },
  qrPlaceholder: {
    padding: spacing.xxl,
    backgroundColor: colors.gray[100],
    borderRadius: 12,
    marginBottom: spacing.lg,
  },
  qrPlaceholderText: {
    ...typography.body2,
    color: colors.text.secondary,
    textAlign: "center",
  },
  memberCodeContainer: {
    alignItems: "center",
    paddingTop: spacing.md,
    borderTopWidth: 2,
    borderTopColor: colors.border.light,
    width: "100%",
  },
  memberCodeLabel: {
    ...typography.caption,
    color: colors.text.secondary,
    marginBottom: spacing.xs,
    textTransform: "uppercase",
    letterSpacing: 1,
  },
  memberCode: {
    ...typography.h4,
    color: colors.primary[600],
    fontWeight: "bold",
    letterSpacing: 2,
  },
  infoCard: {
    marginHorizontal: spacing.lg,
    marginTop: spacing.lg,
    borderRadius: 16,
    backgroundColor: colors.background.default,
  },
  infoCardContent: {
    padding: spacing.lg,
  },
  infoTitle: {
    ...typography.h6,
    color: colors.text.primary,
    fontWeight: "600",
    marginBottom: spacing.md,
  },
  infoList: {
    gap: spacing.md,
  },
  infoItem: {
    flexDirection: "row",
    alignItems: "flex-start",
  },
  infoNumber: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: colors.primary[500],
    color: colors.text.white,
    ...typography.body2,
    fontWeight: "bold",
    textAlign: "center",
    lineHeight: 28,
    marginRight: spacing.md,
  },
  infoText: {
    ...typography.body2,
    color: colors.text.secondary,
    flex: 1,
    lineHeight: 22,
  },
  actionsSection: {
    paddingHorizontal: spacing.lg,
    marginTop: spacing.lg,
  },
  shareButton: {
    borderRadius: 12,
    borderWidth: 1.5,
  },
  buttonContent: {
    paddingVertical: spacing.sm,
  },
});
