import { View, Text, Alert } from "react-native";
import { TextInput, Button } from "react-native-paper";
import { useState } from "react";
import { loginApi } from "../api/auth";
import { saveToken } from "../store/authStore";

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
      navigation.replace("Dashboard");
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
    <View style={{ padding: 24, flex: 1, justifyContent: "center" }}>
      <Text style={{ fontSize: 28, marginBottom: 20 }}>Bank Sampah Digital</Text>
      <TextInput label="Email" value={email} onChangeText={setEmail} />
      <TextInput label="Password" secureTextEntry value={password} onChangeText={setPassword} />
      <Button
        mode="contained"
        onPress={login}
        style={{ marginTop: 16 }}
        loading={loading}
        disabled={loading}
      >
        {loading ? "Masuk..." : "Login"}
      </Button>
      <Button mode="text" onPress={() => navigation.navigate("Register")} style={{ marginTop: 8 }}>
        Buat akun baru
      </Button>
    </View>
  );
}
