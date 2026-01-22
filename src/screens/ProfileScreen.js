import { View, Text, Image, StyleSheet, ScrollView, Alert, ActivityIndicator } from "react-native";
import { useEffect, useState } from "react";
import { getProfile } from "../api/user";
import { logoutApi } from "../api/auth";
import { removeToken } from "../store/authStore";
import { Card, Button } from "react-native-paper";
import { colors, spacing, typography } from "../theme";
import { navigationRef } from "../navigation/AppNavigator";
import { CommonActions } from "@react-navigation/native";

export default function ProfileScreen({ navigation }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  useEffect(() => {
    getProfile()
      .then((res) => {
        const userData = res.data?.data ?? res.data;
        setUser(userData);
        setLoading(false);
      })
      .catch((err) => {
        console.error("❌ Profile API Error:", err);
        setError(err?.response?.data?.message || "Gagal memuat profil");
        setLoading(false);
      });
  }, []);

  const handleLogout = async () => {
    if (isLoggingOut) return;
    
    Alert.alert(
      "Logout",
      "Apakah Anda yakin ingin keluar?",
      [
        {
          text: "Batal",
          style: "cancel",
        },
        {
          text: "Keluar",
          style: "destructive",
          onPress: async () => {
            setIsLoggingOut(true);
            
            try {
              await logoutApi();
            } catch (e) {
              console.warn("Logout API failed, clearing token locally anyway", e);
            }
            
            await removeToken();
            setIsLoggingOut(false);
            
            // Navigate to Login using navigationRef
            if (navigationRef.current) {
              navigationRef.current.dispatch(
                CommonActions.reset({
                  index: 0,
                  routes: [{ name: "Login" }],
                })
              );
            }
          },
        },
      ]
    );
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color={colors.primary[500]} />
        <Text style={styles.loadingText}>Memuat profil...</Text>
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
    >
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.avatarContainer}>
          {user.avatar_url ? (
            <Image source={{ uri: user.avatar_url }} style={styles.avatar} />
          ) : (
            <View style={styles.avatarPlaceholder}>
              <Text style={styles.avatarText}>
                {user.name?.charAt(0)?.toUpperCase() || "U"}
              </Text>
            </View>
          )}
        </View>
        <Text style={styles.name}>{user.name || "Pengguna"}</Text>
        <Text style={styles.email}>{user.email || "-"}</Text>
      </View>

      {/* Info Cards */}
      <View style={styles.cardsSection}>
        <Card style={styles.infoCard} mode="elevated" elevation={2}>
          <View style={styles.infoRow}>
            <View style={styles.infoLeft}>
              <View style={[styles.infoIcon, { backgroundColor: colors.primary[50] }]}>
                <Text style={styles.infoIconText}>🆔</Text>
              </View>
              <View style={styles.infoTextContainer}>
                <Text style={styles.infoLabel}>Member Code</Text>
                <Text style={styles.infoValue}>{user.member_code || "Tidak tersedia"}</Text>
              </View>
            </View>
          </View>
        </Card>

        <Card style={styles.infoCard} mode="elevated" elevation={2}>
          <View style={styles.infoRow}>
            <View style={styles.infoLeft}>
              <View style={[styles.infoIcon, { backgroundColor: colors.secondary[50] }]}>
                <Text style={styles.infoIconText}>💰</Text>
              </View>
              <View style={styles.infoTextContainer}>
                <Text style={styles.infoLabel}>Saldo</Text>
                <Text style={styles.infoValue}>Rp {formatBalance(user.balance)}</Text>
              </View>
            </View>
          </View>
        </Card>
      </View>

      {/* Actions */}
      <View style={styles.actionsSection}>
        <Button
          mode="outlined"
          style={styles.editButton}
          contentStyle={styles.buttonContent}
          onPress={() => navigation.navigate("EditProfile")}
          textColor={colors.primary[600]}
          borderColor={colors.primary[300]}
        >
          Edit Profil
        </Button>

        <Button
          mode="contained"
          style={styles.logoutButton}
          contentStyle={styles.buttonContent}
          onPress={handleLogout}
          disabled={isLoggingOut}
          loading={isLoggingOut}
          buttonColor={colors.error}
          textColor={colors.text.white}
        >
          {isLoggingOut ? "Keluar..." : "Logout"}
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
    alignItems: "center",
    paddingVertical: spacing.xl,
    backgroundColor: colors.primary[500],
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    marginBottom: spacing.lg,
  },
  avatarContainer: {
    marginBottom: spacing.md,
  },
  avatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 4,
    borderColor: colors.text.white,
  },
  avatarPlaceholder: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: colors.primary[300],
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 4,
    borderColor: colors.text.white,
  },
  avatarText: {
    ...typography.h1,
    color: colors.text.white,
  },
  name: {
    ...typography.h3,
    color: colors.text.white,
    fontWeight: "bold",
    marginBottom: spacing.xs,
  },
  email: {
    ...typography.body2,
    color: colors.primary[50],
  },
  cardsSection: {
    paddingHorizontal: spacing.lg,
    marginBottom: spacing.lg,
  },
  infoCard: {
    marginBottom: spacing.md,
    borderRadius: 16,
    padding: spacing.md,
    backgroundColor: colors.background.default,
  },
  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  infoLeft: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  infoIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: "center",
    alignItems: "center",
    marginRight: spacing.md,
  },
  infoIconText: {
    fontSize: 24,
  },
  infoTextContainer: {
    flex: 1,
  },
  infoLabel: {
    ...typography.caption,
    color: colors.text.secondary,
    marginBottom: spacing.xs,
  },
  infoValue: {
    ...typography.body1,
    color: colors.text.primary,
    fontWeight: "600",
  },
  actionsSection: {
    paddingHorizontal: spacing.lg,
    gap: spacing.md,
  },
  editButton: {
    borderRadius: 12,
    borderWidth: 1.5,
  },
  logoutButton: {
    borderRadius: 12,
    elevation: 2,
  },
  buttonContent: {
    paddingVertical: spacing.sm,
  },
});
