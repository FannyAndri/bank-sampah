import { View, Text, StyleSheet, ScrollView, Image, Alert, ActivityIndicator, KeyboardAvoidingView, Platform } from "react-native";
import { TextInput, Button } from "react-native-paper";
import { useState } from "react";
import { loginApi } from "../api/auth";
import { saveToken } from "../store/authStore";
import { colors, spacing, typography } from "../theme";

export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const login = async () => {
    if (!email.trim()) {
      Alert.alert("Error", "Email wajib diisi");
      return;
    }
    if (!password) {
      Alert.alert("Error", "Password wajib diisi");
      return;
    }

    setLoading(true);
    try {
      const res = await loginApi(email, password);
      await saveToken(res.data.token);
      navigation.replace("MainTabs");
    } catch (err) {
      console.error("Login error:", err);
      const status = err?.response?.status;
      const data = err?.response?.data;

      let message = "Login gagal. Silakan coba lagi.";

      if (status === 401 || status === 422) {
        message = data?.message || "Email atau password salah";
      } else if (data?.message) {
        message = data.message;
      } else if (err.message) {
        message = err.message;
      }

      Alert.alert("Error", message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.keyboardView}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 20}
    >
      <ScrollView 
        contentContainerStyle={styles.container}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.content}>
        {/* Logo/Header Section */}
        <View style={styles.header}>
          <View style={styles.logoContainer}>
            <View style={styles.logoCircle}>
              <Text style={styles.logoText}>♻️</Text>
            </View>
          </View>
          <Text style={styles.title}>Bank Sampah Digital</Text>
          <Text style={styles.subtitle}>
            Kelola sampahmu, dapatkan manfaatnya
          </Text>
        </View>

        {/* Form Section */}
        <View style={styles.form}>
          <TextInput
            label="Email"
            value={email}
            onChangeText={setEmail}
            mode="outlined"
            keyboardType="email-address"
            autoCapitalize="none"
            style={styles.input}
            contentStyle={styles.inputContent}
            outlineColor={colors.border.light}
            activeOutlineColor={colors.primary[500]}
            left={<TextInput.Icon icon="email" iconColor={colors.primary[500]} />}
          />

          <TextInput
            label="Password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            mode="outlined"
            style={styles.input}
            contentStyle={styles.inputContent}
            outlineColor={colors.border.light}
            activeOutlineColor={colors.primary[500]}
            left={<TextInput.Icon icon="lock" iconColor={colors.primary[500]} />}
          />

          <Button
            mode="contained"
            onPress={login}
            style={styles.loginButton}
            contentStyle={styles.buttonContent}
            loading={loading}
            disabled={loading}
            buttonColor={colors.primary[500]}
            textColor={colors.text.white}
          >
            {loading ? "Masuk..." : "Masuk"}
          </Button>

          <View style={styles.registerSection}>
            <Text style={styles.registerText}>Belum punya akun? </Text>
            <Button
              mode="text"
              onPress={() => navigation.navigate("Register")}
              textColor={colors.primary[600]}
              labelStyle={styles.registerButtonLabel}
            >
              Daftar Sekarang
            </Button>
          </View>
        </View>
      </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  keyboardView: {
    flex: 1,
  },
  container: {
    flexGrow: 1,
    backgroundColor: colors.background.default,
  },
  content: {
    flex: 1,
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.xxl,
    paddingBottom: spacing.xl,
  },
  header: {
    alignItems: "center",
    marginBottom: spacing.xl,
  },
  logoContainer: {
    marginBottom: spacing.md,
  },
  logoCircle: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: colors.primary[50],
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 3,
    borderColor: colors.primary[200],
  },
  logoText: {
    fontSize: 48,
  },
  title: {
    ...typography.h2,
    color: colors.text.primary,
    marginBottom: spacing.sm,
    textAlign: "center",
  },
  subtitle: {
    ...typography.body2,
    color: colors.text.secondary,
    textAlign: "center",
  },
  form: {
    marginTop: spacing.xl,
  },
  input: {
    marginBottom: spacing.md,
    backgroundColor: colors.background.default,
  },
  inputContent: {
    fontSize: 16,
  },
  loginButton: {
    marginTop: spacing.md,
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
  registerSection: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: spacing.lg,
  },
  registerText: {
    ...typography.body2,
    color: colors.text.secondary,
  },
  registerButtonLabel: {
    ...typography.body2,
    fontWeight: "600",
  },
});
