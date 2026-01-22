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

  const register = async () => {
    try {
      if (password !== passwordConfirm) {
        Alert.alert("Error", "Password dan konfirmasi tidak sama");
        return;
      }
      const res = await registerApi(name, email, password, passwordConfirm);
      await saveToken(res.data.token);
      navigation.replace("Dashboard");
    } catch (err) {
      console.log("Register error:", err);
      console.log("Register error response:", err?.response);
      console.log("Validation details:", err?.response?.data); // Log data detail

      const status = err?.response?.status;
      const data = err?.response?.data;

      let msg = data?.message || "Register gagal";

      // Handle Laravel style validation errors
      if (data?.errors) {
        const errorMessages = Object.values(data.errors).flat().join("\n");
        msg = `${msg}\n\n${errorMessages}`;
      } else if (data && !data.message) {
        msg = JSON.stringify(data);
      }

      Alert.alert(status ? `Error ${status}` : "Error", msg.toString());
    }
  };

  return (
    <View style={{ padding: 24, flex: 1, justifyContent: "center" }}>
      <Text style={{ fontSize: 28, marginBottom: 20 }}>Daftar Akun</Text>
      <TextInput label="Nama" value={name} onChangeText={setName} />
      <TextInput label="Email" value={email} onChangeText={setEmail} />
      <TextInput label="Password" secureTextEntry value={password} onChangeText={setPassword} />
      <TextInput label="Konfirmasi Password" secureTextEntry value={passwordConfirm} onChangeText={setPasswordConfirm} />
      <Button mode="contained" onPress={register} style={{ marginTop: 16 }}>
        Daftar
      </Button>
      <Button mode="text" onPress={() => navigation.navigate("Login")} style={{ marginTop: 8 }}>
        Sudah punya akun? Login
      </Button>
    </View>
  );
}
