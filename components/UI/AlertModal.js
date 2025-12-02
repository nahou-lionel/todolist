import React from "react";
import {
  Modal,
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useTheme } from "../../hooks/useTheme";

/**
 * Composant modal qui remplace Alert natif pour la compatibilité web
 * @param {boolean} visible - Visibilité du modal
 * @param {string} title - Titre de l'alerte
 * @param {string} message - Message de l'alerte
 * @param {Array} buttons - Tableau de boutons {text, onPress, style}
 */
export default function AlertModal({ visible, title, message, buttons = [] }) {
  const { colors, spacing, fontSize, borderRadius, shadows } = useTheme();

  const styles = StyleSheet.create({
    modalOverlay: {
      flex: 1,
      backgroundColor: "rgba(0, 0, 0, 0.5)",
      justifyContent: "center",
      alignItems: "center",
      paddingHorizontal: spacing.xl,
    },
    modalContainer: {
      backgroundColor: "#FFFFFF",
      borderRadius: borderRadius.large,
      width: "100%",
      maxWidth: 400,
      ...shadows.medium,
    },
    modalHeader: {
      paddingHorizontal: spacing.lg,
      paddingTop: spacing.lg,
      paddingBottom: spacing.md,
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
    },
    modalTitle: {
      fontSize: fontSize.large,
      fontWeight: "600",
      color: colors.text,
    },
    modalContent: {
      paddingHorizontal: spacing.lg,
      paddingVertical: spacing.lg,
    },
    message: {
      fontSize: fontSize.regular,
      color: colors.text,
      lineHeight: 22,
    },
    modalActions: {
      flexDirection: "row",
      paddingHorizontal: spacing.lg,
      paddingVertical: spacing.lg,
      borderTopWidth: 1,
      borderTopColor: colors.border,
      gap: spacing.md,
    },
    button: {
      flex: 1,
      paddingVertical: spacing.md,
      borderRadius: borderRadius.medium,
      alignItems: "center",
      justifyContent: "center",
      minHeight: 44,
      backgroundColor: colors.card,
      borderWidth: 1,
      borderColor: colors.border,
    },
    buttonDestructive: {
      backgroundColor: colors.error,
      borderColor: colors.error,
    },
    buttonText: {
      fontSize: fontSize.medium,
      color: colors.text,
      fontWeight: "500",
    },
    buttonTextDestructive: {
      color: "#FFFFFF",
      fontWeight: "600",
    },
  });

  if (!visible) return null;

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="fade"
      onRequestClose={() => {
        // Chercher un bouton cancel et l'exécuter
        const cancelButton = buttons.find((btn) => btn.style === "cancel");
        if (cancelButton && cancelButton.onPress) {
          cancelButton.onPress();
        }
      }}
    >
      <Pressable
        style={styles.modalOverlay}
        onPress={() => {
          const cancelButton = buttons.find((btn) => btn.style === "cancel");
          if (cancelButton && cancelButton.onPress) {
            cancelButton.onPress();
          }
        }}
      >
        <Pressable onPress={(e) => e.stopPropagation()}>
          <View style={styles.modalContainer}>
            {/* En-tête */}
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>{title}</Text>
            </View>

            {/* Contenu */}
            <View style={styles.modalContent}>
              <Text style={styles.message}>{message}</Text>
            </View>

            {/* Boutons d'action */}
            <View style={styles.modalActions}>
              {buttons.map((button, index) => (
                <TouchableOpacity
                  key={index}
                  style={[
                    styles.button,
                    button.style === "destructive" && styles.buttonDestructive,
                  ]}
                  onPress={() => {
                    if (button.onPress) {
                      button.onPress();
                    }
                  }}
                  activeOpacity={0.7}
                >
                  <Text
                    style={[
                      styles.buttonText,
                      button.style === "destructive" &&
                        styles.buttonTextDestructive,
                    ]}
                  >
                    {button.text}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </Pressable>
      </Pressable>
    </Modal>
  );
}
