import { View, Text, StyleSheet, ScrollView, Platform, ActivityIndicator, TouchableOpacity, Image, RefreshControl } from "react-native";
import { useEffect, useState } from "react";
import { getProfile } from "../api/user";
import QRCode from "react-native-qrcode-svg";
import { Button, Card } from "react-native-paper";
import { colors, spacing, typography } from "../theme";

export default function DashboardScreen({ navigation }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(null);

  const loadProfile = async () => {
    try {
      const res = await getProfile();
      const userData = res.data?.data ?? res.data;
      setUser(userData);
      setError(null);
    } catch (err) {
      console.error("❌ Profile API Error:", err);
      setError(err?.response?.data?.message || "Gagal memuat profil");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadProfile();
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    loadProfile();
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color={colors.primary[500]} />
        <Text style={styles.loadingText}>Memuat dashboard...</Text>
      </View>
    );
  }

  if (error && !user) {
    return (
      <View style={styles.center}>
        <Text style={styles.errorText}>{error}</Text>
        <Button
          mode="contained"
          onPress={loadProfile}
          style={{ marginTop: spacing.md }}
          buttonColor={colors.primary[500]}
        >
          Coba Lagi
        </Button>
      </View>
    );
  }

  if (!user) {
    return (
      <View style={styles.center}>
        <Text style={styles.errorText}>Data pengguna tidak ditemukan</Text>
      </View>
    );
  }

  const formatBalance = (balance) => {
    return Number(balance || 0).toLocaleString("id-ID", {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    });
  };

  return (
    <ScrollView 
      contentContainerStyle={styles.container}
      showsVerticalScrollIndicator={false}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={colors.primary[500]} />
      }
    >
      {/* Header Section */}
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <View style={styles.greetingSection}>
            <Text style={styles.greeting}>Selamat Datang,</Text>
            <Text style={styles.name}>{user.name || "Pengguna"}</Text>
          </View>
          <TouchableOpacity 
            onPress={() => navigation.navigate("Profile")}
            style={styles.avatarButton}
          >
            {user.avatar_url ? (
              <Image source={{ uri: user.avatar_url }} style={styles.headerAvatar} />
            ) : (
              <View style={styles.headerAvatarPlaceholder}>
                <Text style={styles.headerAvatarText}>
                  {user.name?.charAt(0)?.toUpperCase() || "U"}
                </Text>
              </View>
            )}
          </TouchableOpacity>
        </View>
      </View>

      {/* Balance Card */}
      <Card style={styles.balanceCard} mode="elevated" elevation={4}>
        <View style={styles.balanceContent}>
          <View style={styles.balanceHeader}>
            <View>
              <Text style={styles.balanceLabel}>Saldo Anda</Text>
              <Text style={styles.balanceValue}>Rp {formatBalance(user.balance)}</Text>
            </View>
            <View style={styles.balanceIcon}>
              <Text style={styles.balanceIconText}>💰</Text>
            </View>
          </View>
          <View style={styles.balanceActions}>
            <Button
              mode="outlined"
              onPress={() => navigation.navigate("TukarSampah")}
              style={styles.balanceButton}
              textColor={colors.text.white}
              borderColor="rgba(255, 255, 255, 0.3)"
              labelStyle={styles.balanceButtonLabel}
            >
              Tukar Sampah
            </Button>
            <Button
              mode="contained"
              onPress={() => navigation.navigate("Withdraw")}
              style={styles.balanceButton}
              buttonColor={colors.text.white}
              textColor={colors.primary[600]}
              labelStyle={styles.balanceButtonLabel}
            >
              Tarik Saldo
            </Button>
          </View>
        </View>
      </Card>

      {/* Stats Cards */}
      <View style={styles.statsSection}>
        <Card style={styles.statCard} mode="elevated" elevation={2}>
          <View style={styles.statContent}>
            <View style={[styles.statIcon, { backgroundColor: colors.primary[50] }]}>
              <Text style={styles.statIconText}>♻️</Text>
            </View>
            <View style={styles.statText}>
              <Text style={styles.statValue}>-</Text>
              <Text style={styles.statLabel}>Transaksi</Text>
            </View>
          </View>
        </Card>

        <Card style={styles.statCard} mode="elevated" elevation={2}>
          <View style={styles.statContent}>
            <View style={[styles.statIcon, { backgroundColor: colors.secondary[50] }]}>
              <Text style={styles.statIconText}>📦</Text>
            </View>
            <View style={styles.statText}>
              <Text style={styles.statValue}>-</Text>
              <Text style={styles.statLabel}>Sampah</Text>
            </View>
          </View>
        </Card>

        <Card style={styles.statCard} mode="elevated" elevation={2}>
          <View style={styles.statContent}>
            <View style={[styles.statIcon, { backgroundColor: colors.primary[100] }]}>
              <Text style={styles.statIconText}>🌱</Text>
            </View>
            <View style={styles.statText}>
              <Text style={styles.statValue}>-</Text>
              <Text style={styles.statLabel}>Poin</Text>
            </View>
          </View>
        </Card>
      </View>

      {/* QR Code Card */}
      {user.member_code && (
        <Card 
          style={styles.qrCard} 
          mode="elevated" 
          elevation={2}
          onPress={() => navigation.navigate("QRCode")}
        >
          <View style={styles.qrCardHeader}>
            <View>
              <Text style={styles.qrTitle}>QR Code Member</Text>
              <Text style={styles.qrSubtitle}>Ketuk untuk melihat detail</Text>
            </View>
            <View style={styles.qrIconContainer}>
              <Text style={styles.qrIconText}>📱</Text>
            </View>
          </View>
          <View style={styles.qrContainer}>
            {Platform.OS !== "web" ? (
              <View style={styles.qrWrapper}>
                <QRCode 
                  value={String(user.member_code)} 
                  size={160}
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
          </View>
          <View style={styles.memberCodeContainer}>
            <Text style={styles.memberCodeLabel}>Member Code</Text>
            <Text style={styles.memberCode}>{user.member_code}</Text>
          </View>
        </Card>
      )}

      {/* Quick Actions */}
      <View style={styles.actionsSection}>
        <Text style={styles.sectionTitle}>Layanan Cepat</Text>
        <View style={styles.actionsGrid}>
          <Card 
            style={styles.actionCard}
            mode="elevated"
            elevation={2}
            onPress={() => navigation.navigate("TukarSampah")}
          >
            <View style={styles.actionContent}>
              <View style={[styles.actionIcon, { backgroundColor: colors.primary[50] }]}>
                <Text style={styles.actionIconText}>♻️</Text>
              </View>
              <Text style={styles.actionLabel}>Tukar</Text>
              <Text style={styles.actionSubtext}>Sampah</Text>
            </View>
          </Card>

          <Card 
            style={styles.actionCard}
            mode="elevated"
            elevation={2}
            onPress={() => navigation.navigate("Transactions")}
          >
            <View style={styles.actionContent}>
              <View style={[styles.actionIcon, { backgroundColor: colors.secondary[50] }]}>
                <Text style={styles.actionIconText}>📋</Text>
              </View>
              <Text style={styles.actionLabel}>Riwayat</Text>
              <Text style={styles.actionSubtext}>Transaksi</Text>
            </View>
          </Card>

          <Card 
            style={styles.actionCard}
            mode="elevated"
            elevation={2}
            onPress={() => navigation.navigate("Withdraw")}
          >
            <View style={styles.actionContent}>
              <View style={[styles.actionIcon, { backgroundColor: colors.primary[100] }]}>
                <Text style={styles.actionIconText}>💸</Text>
              </View>
              <Text style={styles.actionLabel}>Tarik</Text>
              <Text style={styles.actionSubtext}>Saldo</Text>
            </View>
          </Card>

          <Card 
            style={styles.actionCard}
            mode="elevated"
            elevation={2}
            onPress={() => navigation.navigate("QRCode")}
          >
            <View style={styles.actionContent}>
              <View style={[styles.actionIcon, { backgroundColor: colors.secondary[100] }]}>
                <Text style={styles.actionIconText}>📱</Text>
              </View>
              <Text style={styles.actionLabel}>QR Code</Text>
              <Text style={styles.actionSubtext}>Member</Text>
            </View>
          </Card>
        </View>
      </View>

      {/* Info Section */}
      <Card style={styles.infoCard} mode="elevated" elevation={1}>
        <View style={styles.infoCardContent}>
          <Text style={styles.infoCardTitle}>💡 Tips Daur Ulang</Text>
          <Text style={styles.infoCardText}>
            • Pisahkan sampah sesuai jenisnya{'\n'}
            • Cuci bersih sebelum menukar{'\n'}
            • Bawa sampah ke lokasi Bank Sampah terdekat{'\n'}
            • Dapatkan saldo langsung setelah transaksi
          </Text>
        </View>
      </Card>
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
  headerTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginTop: spacing.md,
  },
  greetingSection: {
    flex: 1,
  },
  greeting: {
    ...typography.body2,
    color: colors.primary[50],
    marginBottom: spacing.xs,
  },
  name: {
    ...typography.h2,
    color: colors.text.white,
    fontWeight: "bold",
  },
  avatarButton: {
    marginLeft: spacing.md,
  },
  headerAvatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
    borderWidth: 3,
    borderColor: colors.text.white,
  },
  headerAvatarPlaceholder: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: colors.primary[300],
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 3,
    borderColor: colors.text.white,
  },
  headerAvatarText: {
    ...typography.h5,
    color: colors.text.white,
  },
  balanceCard: {
    marginHorizontal: spacing.lg,
    marginTop: -spacing.lg,
    marginBottom: spacing.lg,
    borderRadius: 20,
    backgroundColor: colors.primary[500],
    overflow: "hidden",
  },
  balanceContent: {
    padding: spacing.lg,
  },
  balanceHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: spacing.lg,
  },
  balanceLabel: {
    ...typography.body2,
    color: colors.primary[50],
    fontWeight: "500",
    marginBottom: spacing.xs,
  },
  balanceValue: {
    ...typography.h1,
    color: colors.text.white,
    fontWeight: "bold",
  },
  balanceIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    justifyContent: "center",
    alignItems: "center",
  },
  balanceIconText: {
    fontSize: 28,
  },
  balanceActions: {
    flexDirection: "row",
    gap: spacing.sm,
  },
  balanceButton: {
    flex: 1,
    borderRadius: 10,
  },
  balanceButtonLabel: {
    ...typography.body2,
    fontWeight: "600",
  },
  statsSection: {
    flexDirection: "row",
    paddingHorizontal: spacing.lg,
    marginBottom: spacing.lg,
    gap: spacing.md,
  },
  statCard: {
    flex: 1,
    borderRadius: 16,
    padding: spacing.md,
    backgroundColor: colors.background.default,
  },
  statContent: {
    alignItems: "center",
  },
  statIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: spacing.sm,
  },
  statIconText: {
    fontSize: 24,
  },
  statText: {
    alignItems: "center",
  },
  statValue: {
    ...typography.h5,
    color: colors.text.primary,
    fontWeight: "bold",
    marginBottom: spacing.xs,
  },
  statLabel: {
    ...typography.caption,
    color: colors.text.secondary,
  },
  qrCard: {
    marginHorizontal: spacing.lg,
    marginBottom: spacing.lg,
    borderRadius: 20,
    padding: spacing.lg,
    backgroundColor: colors.background.default,
  },
  qrCardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: spacing.md,
  },
  qrTitle: {
    ...typography.h5,
    color: colors.text.primary,
    marginBottom: spacing.xs,
  },
  qrSubtitle: {
    ...typography.caption,
    color: colors.text.secondary,
  },
  qrIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: colors.primary[50],
    justifyContent: "center",
    alignItems: "center",
  },
  qrIconText: {
    fontSize: 24,
  },
  qrContainer: {
    alignItems: "center",
    marginVertical: spacing.md,
  },
  qrWrapper: {
    padding: spacing.md,
    backgroundColor: colors.background.default,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: colors.primary[200],
  },
  qrPlaceholder: {
    padding: spacing.xl,
    backgroundColor: colors.gray[100],
    borderRadius: 12,
  },
  qrPlaceholderText: {
    ...typography.body2,
    color: colors.text.secondary,
    textAlign: "center",
  },
  memberCodeContainer: {
    alignItems: "center",
    marginTop: spacing.md,
    paddingTop: spacing.md,
    borderTopWidth: 1,
    borderTopColor: colors.border.light,
  },
  memberCodeLabel: {
    ...typography.caption,
    color: colors.text.secondary,
    marginBottom: spacing.xs,
  },
  memberCode: {
    ...typography.h6,
    color: colors.primary[600],
    fontWeight: "bold",
    letterSpacing: 1,
  },
  actionsSection: {
    paddingHorizontal: spacing.lg,
    marginBottom: spacing.lg,
  },
  sectionTitle: {
    ...typography.h5,
    color: colors.text.primary,
    marginBottom: spacing.md,
    fontWeight: "600",
  },
  actionsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing.md,
  },
  actionCard: {
    width: "47%",
    borderRadius: 16,
    padding: spacing.md,
    backgroundColor: colors.background.default,
  },
  actionContent: {
    alignItems: "center",
  },
  actionIcon: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: spacing.sm,
  },
  actionIconText: {
    fontSize: 28,
  },
  actionLabel: {
    ...typography.body2,
    color: colors.text.primary,
    fontWeight: "600",
    marginBottom: spacing.xs,
  },
  actionSubtext: {
    ...typography.caption,
    color: colors.text.secondary,
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
