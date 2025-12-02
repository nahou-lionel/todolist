import { MaterialIcons } from "@expo/vector-icons";
import React, { useContext, useState } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { deleteAccount } from "../api/apiService";
import { TokenContext, UsernameContext } from "../Context/Context";
import { useTheme } from "../hooks/useTheme";
import AlertModal from "../components/UI/AlertModal";
import ConfirmationModal from "../components/UI/ConfirmationModal";

export default function SettingsScreen({ navigation }) {
  const { colors, spacing, fontSize, borderRadius, themeMode, setThemeMode } =
    useTheme();
  const [token, setToken] = useContext(TokenContext);
  const [username, setUsername] = useContext(UsernameContext);
  const [isDeleting, setIsDeleting] = useState(false);

  // États pour les modals
  const [logoutModalVisible, setLogoutModalVisible] = useState(false);
  const [deleteAccountModalVisible, setDeleteAccountModalVisible] = useState(false);
  const [confirmDeleteModalVisible, setConfirmDeleteModalVisible] = useState(false);
  const [successModalVisible, setSuccessModalVisible] = useState(false);
  const [errorModalVisible, setErrorModalVisible] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleLogout = () => {
    setLogoutModalVisible(true);
  };

  const confirmLogout = () => {
    setLogoutModalVisible(false);
    setToken(null);
    setUsername(null);
  };

  const handleDeleteAccount = () => {
    setDeleteAccountModalVisible(true);
  };

  const confirmDeleteAccount = () => {
    setDeleteAccountModalVisible(false);
    setConfirmDeleteModalVisible(true);
  };

  const performDeleteAccount = async (inputValue) => {
    if (inputValue !== username) {
      setConfirmDeleteModalVisible(false);
      setErrorMessage("Le nom d'utilisateur ne correspond pas.");
      setErrorModalVisible(true);
      return;
    }

    setIsDeleting(true);
    try {
      await deleteAccount(token);
      setConfirmDeleteModalVisible(false);
      setSuccessModalVisible(true);
    } catch (error) {
      setConfirmDeleteModalVisible(false);
      setErrorMessage(error.message || "Impossible de supprimer le compte");
      setErrorModalVisible(true);
    } finally {
      setIsDeleting(false);
    }
  };

  const handleSuccessClose = () => {
    setSuccessModalVisible(false);
    setToken(null);
    setUsername(null);
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },
    content: {
      flex: 1,
      paddingHorizontal: spacing.xl,
      paddingTop: spacing.xxl,
    },
    title: {
      fontSize: fontSize.title,
      fontWeight: "300",
      color: colors.text,
      marginBottom: spacing.xl,
      letterSpacing: 1,
    },
    section: {
      marginBottom: spacing.xl,
    },
    sectionTitle: {
      fontSize: fontSize.medium,
      fontWeight: "600",
      color: colors.textSecondary,
      marginBottom: spacing.md,
      textTransform: "uppercase",
      letterSpacing: 1,
    },
    card: {
      backgroundColor: colors.card,
      borderRadius: borderRadius.medium,
      padding: spacing.lg,
      borderWidth: 1,
      borderColor: colors.border,
    },
    row: {
      flexDirection: "row",
      alignItems: "center",
      paddingVertical: spacing.sm,
    },
    rowLabel: {
      flex: 1,
      fontSize: fontSize.regular,
      color: colors.text,
    },
    rowValue: {
      fontSize: fontSize.regular,
      color: colors.textSecondary,
      fontWeight: "500",
    },
    button: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: colors.card,
      borderRadius: borderRadius.medium,
      padding: spacing.lg,
      borderWidth: 1,
      borderColor: colors.border,
      marginBottom: spacing.md,
    },
    buttonDanger: {
      borderColor: colors.error,
    },
    buttonText: {
      fontSize: fontSize.medium,
      color: colors.text,
      fontWeight: "500",
      marginLeft: spacing.sm,
    },
    buttonTextDanger: {
      color: colors.error,
    },
    themeButton: {
      flexDirection: "row",
      alignItems: "center",
      backgroundColor: colors.card,
      borderRadius: borderRadius.medium,
      padding: spacing.lg,
      borderWidth: 1,
      borderColor: colors.border,
      marginBottom: spacing.md,
    },
    themeButtonActive: {
      borderColor: colors.primary,
      backgroundColor: colors.card,
    },
    themeButtonText: {
      flex: 1,
      fontSize: fontSize.medium,
      color: colors.text,
      fontWeight: "500",
      marginLeft: spacing.md,
    },
    themeButtonTextActive: {
      color: colors.primary,
    },
    checkIcon: {
      marginLeft: spacing.sm,
    },
  });

  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Paramètres</Text>

        {/* Section Profil */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Profil</Text>
          <View style={styles.card}>
            <View style={styles.row}>
              <Text style={styles.rowLabel}>Utilisateur</Text>
              <Text style={styles.rowValue}>{username}</Text>
            </View>
          </View>
        </View>

        {/* Section Apparence */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Apparence</Text>

          <TouchableOpacity
            style={[
              styles.themeButton,
              themeMode === "light" && styles.themeButtonActive,
            ]}
            onPress={() => setThemeMode("light")}
            activeOpacity={0.7}
          >
            <MaterialIcons
              name="light-mode"
              size={24}
              color={themeMode === "light" ? colors.primary : colors.text}
            />
            <Text
              style={[
                styles.themeButtonText,
                themeMode === "light" && styles.themeButtonTextActive,
              ]}
            >
              Mode Clair
            </Text>
            {themeMode === "light" && (
              <MaterialIcons
                name="check"
                size={20}
                color={colors.primary}
                style={styles.checkIcon}
              />
            )}
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.themeButton,
              themeMode === "dark" && styles.themeButtonActive,
            ]}
            onPress={() => setThemeMode("dark")}
            activeOpacity={0.7}
          >
            <MaterialIcons
              name="dark-mode"
              size={24}
              color={themeMode === "dark" ? colors.primary : colors.text}
            />
            <Text
              style={[
                styles.themeButtonText,
                themeMode === "dark" && styles.themeButtonTextActive,
              ]}
            >
              Mode Sombre
            </Text>
            {themeMode === "dark" && (
              <MaterialIcons
                name="check"
                size={20}
                color={colors.primary}
                style={styles.checkIcon}
              />
            )}
          </TouchableOpacity>
        </View>

        {/* Section Actions */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Actions</Text>

          <TouchableOpacity
            style={styles.button}
            onPress={handleLogout}
            activeOpacity={0.7}
          >
            <MaterialIcons name="logout" size={24} color={colors.text} />
            <Text style={styles.buttonText}>Déconnexion</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.button, styles.buttonDanger]}
            onPress={handleDeleteAccount}
            activeOpacity={0.7}
            disabled={isDeleting}
          >
            <MaterialIcons
              name="delete-forever"
              size={24}
              color={colors.error}
            />
            <Text style={[styles.buttonText, styles.buttonTextDanger]}>
              {isDeleting ? "Suppression..." : "Supprimer le compte"}
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Modal de déconnexion */}
      <AlertModal
        visible={logoutModalVisible}
        title="Déconnexion"
        message="Êtes-vous sûr de vouloir vous déconnecter ?"
        buttons={[
          {
            text: "Annuler",
            style: "cancel",
            onPress: () => setLogoutModalVisible(false),
          },
          {
            text: "Déconnexion",
            style: "destructive",
            onPress: confirmLogout,
          },
        ]}
      />

      {/* Modal de suppression de compte */}
      <AlertModal
        visible={deleteAccountModalVisible}
        title="Supprimer le compte"
        message={`Êtes-vous sûr de vouloir supprimer votre compte "${username}" ? Cette action est irréversible et supprimera toutes vos listes et tâches.`}
        buttons={[
          {
            text: "Annuler",
            style: "cancel",
            onPress: () => setDeleteAccountModalVisible(false),
          },
          {
            text: "Supprimer",
            style: "destructive",
            onPress: confirmDeleteAccount,
          },
        ]}
      />

      {/* Modal de confirmation avec saisie */}
      <ConfirmationModal
        visible={confirmDeleteModalVisible}
        onClose={() => setConfirmDeleteModalVisible(false)}
        onConfirm={performDeleteAccount}
        title="Confirmation"
        message={`Tapez votre nom d'utilisateur "${username}" pour confirmer la suppression :`}
        placeholder={username}
        expectedValue={username}
        confirmText="Supprimer définitivement"
        loading={isDeleting}
      />

      {/* Modal de succès */}
      <AlertModal
        visible={successModalVisible}
        title="Compte supprimé"
        message="Votre compte a été supprimé avec succès."
        buttons={[
          {
            text: "OK",
            onPress: handleSuccessClose,
          },
        ]}
      />

      {/* Modal d'erreur */}
      <AlertModal
        visible={errorModalVisible}
        title="Erreur"
        message={errorMessage}
        buttons={[
          {
            text: "OK",
            onPress: () => setErrorModalVisible(false),
          },
        ]}
      />
    </ScrollView>
  );
}
