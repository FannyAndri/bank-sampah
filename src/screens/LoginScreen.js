import { View, Text } from "react-native";
import { TextInput, Button } from "react-native-paper";
import { useState } from "react";
import { loginApi } from "../api/auth";
import { saveToken } from "../store/authStore";

export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const login = async () => {
    const res = await loginApi(email, password);
    await saveToken(res.data.token);
    navigation.replace("Dashboard");
  };

  return (
    <View style={{ padding: 24, flex: 1, justifyContent: "center" }}>
      <Text style={{ fontSize: 28, marginBottom: 20 }}>Bank Sampah Digital</Text>
      <TextInput label="Email" value={email} onChangeText={setEmail} />
      <TextInput label="Password" secureTextEntry value={password} onChangeText={setPassword} />
      <Button mode="contained" onPress={login} style={{ marginTop: 16 }}>
        Login
      </Button>
      <Button mode="text" onPress={() => navigation.navigate("Register")} style={{ marginTop: 8 }}>
        Buat akun baru
      </Button>
    </View>
  );
}
