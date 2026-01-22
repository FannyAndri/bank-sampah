import { View, Text, StyleSheet, ScrollView, Alert, KeyboardAvoidingView, Platform } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { TextInput, Button } from "react-native-paper";
import { useState, useMemo } from "react";
import { registerApi } from "../api/auth";
import { saveToken } from "../store/authStore";
import { spacing } from "../theme";
import { useSettings } from "../context/SettingsContext";

export default function RegisterScreen({ navigation }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showPasswordConfirm, setShowPasswordConfirm] = useState(false);
  const insets = useSafeAreaInsets();
  const { colors, typography } = useSettings();
  const styles = useMemo(() => createStyles(colors, typography, insets), [colors, typography, insets]);

  // Helper function to translate Laravel validation keys to user-friendly messages
  const translateValidationError = (key, field) => {
    const translations = {
      "validation.required": `${field} wajib diisi`,
      "validation.email": `${field} harus berupa email yang valid`,
      "validation.unique": `${field} sudah terdaftar`,
      "validation.min.string": `${field} minimal 8 karakter`,
      "validation.confirmed": "Konfirmasi password tidak cocok",
      "validation.same": "Password dan konfirmasi password harus sama",
    };

    // Try to find translation
    if (translations[key]) {
      return translations[key];
    }

    // If key contains the field name, use it
    if (key.includes("unique")) {
      return `${field} sudah digunakan`;
    }
    if (key.includes("required")) {
      return `${field} wajib diisi`;
    }
    if (key.includes("email")) {
      return `${field} harus berupa email yang valid`;
    }

    // Fallback: return the key itself
    return key;
  };

  const register = async () => {
    // Client-side validation
    if (!name.trim()) {
      Alert.alert(
        "Nama Kosong",
        "Silakan masukkan nama lengkap Anda terlebih dahulu.",
        [{ text: "OK", style: "default" }]
      );
      return;
    }
    if (!email.trim()) {
      Alert.alert(
        "Email Kosong",
        "Silakan masukkan email Anda terlebih dahulu.",
        [{ text: "OK", style: "default" }]
      );
      return;
    }
    if (!password) {
      Alert.alert(
        "Password Kosong",
        "Silakan masukkan password Anda terlebih dahulu.",
        [{ text: "OK", style: "default" }]
      );
      return;
    }
    if (password.length < 8) {
      Alert.alert(
        "Password Terlalu Pendek",
        "Password harus minimal 8 karakter. Silakan gunakan password yang lebih panjang untuk keamanan akun Anda.",
        [{ text: "OK", style: "default" }]
      );
      return;
    }
    if (password !== passwordConfirm) {
      Alert.alert(
        "Password Tidak Cocok",
        "Password dan konfirmasi password tidak sama. Silakan periksa kembali.",
        [{ text: "OK", style: "default" }]
      );
      return;
    }

    setLoading(true);
    try {
      const res = await registerApi(name, email, password, passwordConfirm);
      await saveToken(res.data.data.token);
      navigation.replace("MainTabs");
    } catch (err) {
      console.log("Register error:", err);
      console.log("Register error response:", err?.response);
      console.log("Validation details:", err?.response?.data);

      const status = err?.response?.status;
      const data = err?.response?.data;

      let title = "Registrasi Gagal";
      let message = "Terjadi kesalahan saat mendaftar. Silakan coba lagi.";

      // Handle validation errors (422)
      if (status === 422 && data?.errors) {
        title = "Data Tidak Valid";
        const fieldNames = {
          name: "Nama",
          email: "Email",
          password: "Password",
          password_confirmation: "Konfirmasi Password",
        };

        const errorList = [];
        Object.keys(data.errors).forEach((field) => {
          const fieldName = fieldNames[field] || field;
          const errors = data.errors[field];
          errors.forEach((errorKey) => {
            const translatedMsg = translateValidationError(errorKey, fieldName);
            errorList.push(`• ${translatedMsg}`);
          });
        });

        message = errorList.length > 0 ? errorList.join("\n") : data.message || message;
      } else if (status === 409) {
        title = "Email Sudah Terdaftar";
        message = "Email yang Anda masukkan sudah terdaftar. Silakan gunakan email lain atau login dengan akun yang sudah ada.";
      } else if (data?.message) {
        message = data.message;
      } else if (err.message) {
        message = err.message;
      }

      Alert.alert(
        title,
        message,
        [{ text: "OK", style: "cancel" }]
      );
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
          {/* Header */}
          <View style={styles.header}>
            <View style={styles.logoContainer}>
              <View style={styles.logoCircle}>
                <Text style={styles.logoText}>♻️</Text>
              </View>
            </View>
            <Text style={styles.title}>Daftar Akun</Text>
            <Text style={styles.subtitle}>
              Bergabunglah dengan komunitas Bank Sampah Digital
            </Text>
          </View>

          {/* Form */}
          <View style={styles.form}>
            <TextInput
              label="Nama Lengkap"
              value={name}
              onChangeText={setName}
              mode="outlined"
              style={styles.input}
              contentStyle={styles.inputContent}
              outlineColor={colors.border.light}
              activeOutlineColor={colors.primary[500]}
              left={<TextInput.Icon icon="account" iconColor={colors.primary[500]} />}
            />

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
              secureTextEntry={!showPassword}
              mode="outlined"
              style={styles.input}
              contentStyle={styles.inputContent}
              outlineColor={colors.border.light}
              activeOutlineColor={colors.primary[500]}
              left={<TextInput.Icon icon="lock" iconColor={colors.primary[500]} />}
              right={<TextInput.Icon icon={showPassword ? "eye-off" : "eye"} onPress={() => setShowPassword(!showPassword)} />}
            />

            <TextInput
              label="Konfirmasi Password"
              value={passwordConfirm}
              onChangeText={setPasswordConfirm}
              secureTextEntry={!showPasswordConfirm}
              mode="outlined"
              style={styles.input}
              contentStyle={styles.inputContent}
              outlineColor={colors.border.light}
              activeOutlineColor={colors.primary[500]}
              left={<TextInput.Icon icon="lock-check" iconColor={colors.primary[500]} />}
              right={<TextInput.Icon icon={showPasswordConfirm ? "eye-off" : "eye"} onPress={() => setShowPasswordConfirm(!showPasswordConfirm)} />}
            />

            <Button
              mode="contained"
              onPress={register}
              style={styles.registerButton}
              contentStyle={styles.buttonContent}
              loading={loading}
              disabled={loading}
              buttonColor={colors.primary[500]}
              textColor={colors.text.white}
            >
              {loading ? "Mendaftar..." : "Daftar"}
            </Button>

            <View style={styles.loginSection}>
              <Text style={styles.loginText}>Sudah punya akun? </Text>
              <Button
                mode="text"
                onPress={() => navigation.navigate("Login")}
                textColor={colors.primary[600]}
                labelStyle={styles.loginButtonLabel}
              >
                Masuk
              </Button>
            </View>
          </View>
        </View>
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
    backgroundColor: colors.background.default,
  },
  content: {
    flex: 1,
    paddingHorizontal: spacing.lg,
    paddingTop: insets.top + spacing.xl,
    paddingBottom: insets.bottom + spacing.xl,
  },
  header: {
    alignItems: "center",
    marginBottom: spacing.xl,
  },
  logoContainer: {
    marginBottom: spacing.md,
  },
  logoCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: colors.primary[50],
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 3,
    borderColor: colors.primary[200],
  },
  logoText: {
    fontSize: 40,
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
    marginTop: spacing.lg,
  },
  input: {
    marginBottom: spacing.md,
    backgroundColor: colors.background.default,
  },
  inputContent: {
    fontSize: 16,
  },
  registerButton: {
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
  loginSection: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: spacing.lg,
  },
  loginText: {
    ...typography.body2,
    color: colors.text.secondary,
  },
  loginButtonLabel: {
    ...typography.body2,
    fontWeight: "600",
  },
});
