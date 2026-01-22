import { View, Text, Alert } from "react-native";
import { TextInput, Button } from "react-native-paper";
import { useState } from "react";
import { registerApi } from "../api/auth";
import { saveToken } from "../store/authStore";

export default function RegisterScreen({ navigation }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const [loading, setLoading] = useState(false);

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
      Alert.alert("Error", "Nama wajib diisi");
      return;
    }
    if (!email.trim()) {
      Alert.alert("Error", "Email wajib diisi");
      return;
    }
    if (!password) {
      Alert.alert("Error", "Password wajib diisi");
      return;
    }
    if (password.length < 8) {
      Alert.alert("Error", "Password minimal 8 karakter");
      return;
    }
    if (password !== passwordConfirm) {
      Alert.alert("Error", "Password dan konfirmasi tidak sama");
      return;
    }

    setLoading(true);
    try {
      const res = await registerApi(name, email, password, passwordConfirm);
      await saveToken(res.data.token);
      navigation.replace("Dashboard");
    } catch (err) {
      console.log("Register error:", err);
      console.log("Register error response:", err?.response);
      console.log("Validation details:", err?.response?.data);

      const status = err?.response?.status;
      const data = err?.response?.data;

      let title = "Error";
      let message = "Registrasi gagal. Silakan coba lagi.";

      // Handle validation errors (422)
      if (status === 422 && data?.errors) {
        title = "Validasi Error";
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
      } else if (data?.message) {
        message = data.message;
      } else if (err.message) {
        message = err.message;
      }

      Alert.alert(title, message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={{ padding: 24, flex: 1, justifyContent: "center" }}>
      <Text style={{ fontSize: 28, marginBottom: 20 }}>Daftar Akun</Text>
      <TextInput label="Nama" value={name} onChangeText={setName} />
      <TextInput label="Email" value={email} onChangeText={setEmail} />
      <TextInput label="Password" secureTextEntry value={password} onChangeText={setPassword} />
      <TextInput label="Konfirmasi Password" secureTextEntry value={passwordConfirm} onChangeText={setPasswordConfirm} />
      <Button
        mode="contained"
        onPress={register}
        style={{ marginTop: 16 }}
        loading={loading}
        disabled={loading}
      >
        {loading ? "Mendaftar..." : "Daftar"}
      </Button>
      <Button mode="text" onPress={() => navigation.navigate("Login")} style={{ marginTop: 8 }}>
        Sudah punya akun? Login
      </Button>
    </View>
  );
}
