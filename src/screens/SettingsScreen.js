import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from "react-native";
import { Switch, Divider, RadioButton } from "react-native-paper";
import { useSettings } from "../context/SettingsContext";
import { t } from "../i18n/i18n";
import { spacing } from "../theme";

export default function SettingsScreen({ navigation }) {
    const { theme, language, fontSize, colors, typography, setTheme, setLanguage, setFontSize } = useSettings();
    const isDark = theme === "dark";

    return (
        <View style={[styles.container, { backgroundColor: colors.background.default }]}>
            <ScrollView showsVerticalScrollIndicator={false}>
                {/* Display Section */}
                <View style={[styles.section, { backgroundColor: colors.background.paper }]}>
                    <Text style={[styles.sectionTitle, typography.h6, { color: colors.text.primary }]}>
                        {t("display", language)}
                    </Text>

                    {/* Theme Toggle */}
                    <View style={[styles.settingRow, { borderBottomColor: colors.border.light }]}>
                        <View style={styles.settingInfo}>
                            <Text style={[styles.settingLabel, typography.body1, { color: colors.text.primary }]}>
                                {t("theme", language)}
                            </Text>
                            <Text style={[styles.settingDescription, typography.caption, { color: colors.text.secondary }]}>
                                {isDark ? t("dark", language) : t("light", language)}
                            </Text>
                        </View>
                        <Switch
                            value={isDark}
                            onValueChange={(value) => setTheme(value ? "dark" : "light")}
                            color={colors.primary[500]}
                        />
                    </View>

                    <Divider style={{ backgroundColor: colors.border.light }} />

                    {/* Font Size Selector */}
                    <View style={styles.settingColumn}>
                        <Text style={[styles.settingLabel, typography.body1, { color: colors.text.primary }]}>
                            {t("fontSize", language)}
                        </Text>
                        <RadioButton.Group onValueChange={setFontSize} value={fontSize}>
                            <TouchableOpacity
                                style={styles.radioItem}
                                onPress={() => setFontSize("small")}
                            >
                                <RadioButton.Android value="small" color={colors.primary[500]} />
                                <Text style={[typography.body2, { color: colors.text.primary }]}>
                                    {t("small", language)}
                                </Text>
                            </TouchableOpacity>

                            <TouchableOpacity
                                style={styles.radioItem}
                                onPress={() => setFontSize("medium")}
                            >
                                <RadioButton.Android value="medium" color={colors.primary[500]} />
                                <Text style={[typography.body2, { color: colors.text.primary }]}>
                                    {t("medium", language)}
                                </Text>
                            </TouchableOpacity>

                            <TouchableOpacity
                                style={styles.radioItem}
                                onPress={() => setFontSize("large")}
                            >
                                <RadioButton.Android value="large" color={colors.primary[500]} />
                                <Text style={[typography.body2, { color: colors.text.primary }]}>
                                    {t("large", language)}
                                </Text>
                            </TouchableOpacity>
                        </RadioButton.Group>
                    </View>
                </View>

                {/* Language Section */}
                <View style={[styles.section, { backgroundColor: colors.background.paper }]}>
                    <Text style={[styles.sectionTitle, typography.h6, { color: colors.text.primary }]}>
                        {t("language", language)}
                    </Text>

                    <RadioButton.Group onValueChange={setLanguage} value={language}>
                        <TouchableOpacity
                            style={styles.radioItem}
                            onPress={() => setLanguage("id")}
                        >
                            <RadioButton.Android value="id" color={colors.primary[500]} />
                            <Text style={[typography.body2, { color: colors.text.primary }]}>
                                {t("indonesian", language)}
                            </Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={styles.radioItem}
                            onPress={() => setLanguage("en")}
                        >
                            <RadioButton.Android value="en" color={colors.primary[500]} />
                            <Text style={[typography.body2, { color: colors.text.primary }]}>
                                {t("english", language)}
                            </Text>
                        </TouchableOpacity>
                    </RadioButton.Group>
                </View>
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    section: {
        marginTop: spacing.md,
        marginHorizontal: spacing.md,
        borderRadius: 12,
        padding: spacing.lg,
        elevation: 2,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
    },
    sectionTitle: {
        fontWeight: "bold",
        marginBottom: spacing.md,
    },
    settingRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        paddingVertical: spacing.md,
        borderBottomWidth: 1,
    },
    settingInfo: {
        flex: 1,
    },
    settingLabel: {
        fontWeight: "600",
        marginBottom: spacing.xs,
    },
    settingDescription: {
        marginTop: 2,
    },
    settingColumn: {
        paddingTop: spacing.md,
    },
    radioItem: {
        flexDirection: "row",
        alignItems: "center",
        paddingVertical: spacing.xs,
    },
});
