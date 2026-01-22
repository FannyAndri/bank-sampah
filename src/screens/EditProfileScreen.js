import { View, Text, StyleSheet, ScrollView, Alert, ActivityIndicator, Image, KeyboardAvoidingView, Platform } from "react-native";
import { useEffect, useState } from "react";
import { getProfile, updateProfile } from "../api/user";
import { TextInput, Button, Card } from "react-native-paper";
import { colors, spacing, typography } from "../theme";

export default function EditProfileScreen({ navigation }) {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [user, setUser] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone_number: "",
    address: "",
  });

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      const res = await getProfile();
      const userData = res.data?.data ?? res.data;
      setUser(userData);
      setFormData({
        name: userData.name || "",
        email: userData.email || "",
        phone_number: userData.phone_number || "",
        address: userData.address || "",
      });
      setLoading(false);
    } catch (err) {
      console.error("Profile error:", err);
      Alert.alert("Error", "Gagal memuat profil");
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!formData.name.trim()) {
      Alert.alert("Error", "Nama wajib diisi");
      return;
    }

    if (!formData.email.trim()) {
      Alert.alert("Error", "Email wajib diisi");
      return;
    }

    setSaving(true);
    try {
      await updateProfile(formData);
      
      Alert.alert(
        "Berhasil",
        "Profil berhasil diperbarui",
        [
          {
            text: "OK",
            onPress: () => {
              // Reload profile data
              loadProfile();
              navigation.goBack();
            },
          },
        ]
      );
    } catch (err) {
      console.error("Update error:", err);
      const errorMessage = err?.response?.data?.message || "Gagal memperbarui profil";
      
      // Handle validation errors
      if (err?.response?.data?.errors) {
        const errors = err.response.data.errors;
        const errorList = Object.values(errors).flat().join("\n");
        Alert.alert("Error", `${errorMessage}\n\n${errorList}`);
      } else {
        Alert.alert("Error", errorMessage);
      }
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color={colors.primary[500]} />
        <Text style={styles.loadingText}>Memuat profil...</Text>
      </View>
    );
  }

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
        <View style={styles.avatarContainer}>
          {user?.avatar_url ? (
            <Image source={{ uri: user.avatar_url }} style={styles.avatar} />
          ) : (
            <View style={styles.avatarPlaceholder}>
              <Text style={styles.avatarText}>
                {formData.name?.charAt(0)?.toUpperCase() || "U"}
              </Text>
            </View>
          )}
        </View>
        <Button
          mode="text"
          onPress={() => Alert.alert("Info", "Fitur upload foto akan segera tersedia")}
          textColor={colors.primary[600]}
          style={styles.changePhotoButton}
        >
          Ubah Foto
        </Button>
      </View>

      {/* Form Card */}
      <Card style={styles.formCard} mode="elevated" elevation={2}>
        <View style={styles.formContent}>
          <TextInput
            label="Nama Lengkap"
            value={formData.name}
            onChangeText={(text) => setFormData({ ...formData, name: text })}
            mode="outlined"
            style={styles.input}
            contentStyle={styles.inputContent}
            outlineColor={colors.border.light}
            activeOutlineColor={colors.primary[500]}
            left={<TextInput.Icon icon="account" iconColor={colors.primary[500]} />}
          />

          <TextInput
            label="Email"
            value={formData.email}
            onChangeText={(text) => setFormData({ ...formData, email: text })}
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
            label="Nomor Telepon"
            value={formData.phone_number}
            onChangeText={(text) => setFormData({ ...formData, phone_number: text })}
            mode="outlined"
            keyboardType="phone-pad"
            style={styles.input}
            contentStyle={styles.inputContent}
            outlineColor={colors.border.light}
            activeOutlineColor={colors.primary[500]}
            left={<TextInput.Icon icon="phone" iconColor={colors.primary[500]} />}
          />

          <TextInput
            label="Alamat"
            value={formData.address}
            onChangeText={(text) => setFormData({ ...formData, address: text })}
            mode="outlined"
            multiline
            numberOfLines={4}
            style={styles.input}
            contentStyle={styles.inputContent}
            outlineColor={colors.border.light}
            activeOutlineColor={colors.primary[500]}
            left={<TextInput.Icon icon="map-marker" iconColor={colors.primary[500]} />}
          />

          <Button
            mode="contained"
            onPress={handleSave}
            loading={saving}
            disabled={saving}
            style={styles.saveButton}
            contentStyle={styles.buttonContent}
            buttonColor={colors.primary[500]}
            textColor={colors.text.white}
          >
            {saving ? "Menyimpan..." : "Simpan Perubahan"}
          </Button>
        </View>
      </Card>
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
  header: {
    alignItems: "center",
    paddingTop: spacing.xl,
    paddingBottom: spacing.lg,
    paddingHorizontal: spacing.lg,
    backgroundColor: colors.primary[500],
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
  },
  avatarContainer: {
    marginBottom: spacing.sm,
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
  changePhotoButton: {
    marginTop: spacing.xs,
  },
  formCard: {
    marginHorizontal: spacing.lg,
    marginTop: -spacing.lg,
    borderRadius: 20,
    backgroundColor: colors.background.default,
  },
  formContent: {
    padding: spacing.lg,
  },
  input: {
    marginBottom: spacing.md,
    backgroundColor: colors.background.default,
  },
  inputContent: {
    fontSize: 16,
  },
  saveButton: {
    marginTop: spacing.md,
    borderRadius: 12,
    elevation: 2,
  },
  buttonContent: {
    paddingVertical: spacing.sm,
  },
});
