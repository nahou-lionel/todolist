import { MaterialIcons } from "@expo/vector-icons";
import React, { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Modal,
  Pressable,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useTheme } from "../../hooks/useTheme";
import { createStyles } from "../../styles/ExportButton.styles";

// Formats d'export disponibles
const EXPORT_FORMATS = [
  {
    id: "json",
    label: "JSON",
    description: "Format structuré, facile à réimporter",
  },
  {
    id: "csv",
    label: "CSV",
    description: "Compatible Excel/Google Sheets",
  },
  {
    id: "text",
    label: "Texte",
    description: "Format simple et universel",
  },
];

export default function ExportButton({ listTitle, todos, onExport }) {
  const { colors, shadows } = useTheme();
  const styles = createStyles(colors, shadows);

  const [modalVisible, setModalVisible] = useState(false);
  const [selectedFormat, setSelectedFormat] = useState(null);
  const [exporting, setExporting] = useState(false);

  const handleOpenModal = () => {
    setModalVisible(true);
    setSelectedFormat(null);
  };

  const handleCloseModal = () => {
    setModalVisible(false);
    setSelectedFormat(null);
  };

  const handleExport = async () => {
    if (!selectedFormat) {
      Alert.alert("Erreur", "Veuillez sélectionner un format");
      return;
    }

    setExporting(true);

    try {
      // Appeler la fonction d'export fournie en props
      // Cette fonction doit être implémentée dans le service d'export
      await onExport(listTitle, todos, selectedFormat);

      // Fermer le modal et réinitialiser
      setModalVisible(false);
      setSelectedFormat(null);

      // Message de succès
      Alert.alert("Succès", "La liste a été exportée avec succès");
    } catch (error) {
      Alert.alert(
        "Erreur",
        error.message || "Une erreur est survenue lors de l'export"
      );
    } finally {
      setExporting(false);
    }
  };

  return (
    <>
      {/* Bouton icône de partage */}
      <TouchableOpacity
        style={styles.exportIconButton}
        onPress={handleOpenModal}
        activeOpacity={0.7}
      >
        <MaterialIcons name="share" size={22} color={colors.primary} />
      </TouchableOpacity>

      {/* Modal de sélection du format */}
      <Modal
        visible={modalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={handleCloseModal}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            {/* En-tête du modal */}
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Exporter la liste</Text>
              <Text style={styles.modalSubtitle}>
                Choisissez le format d'export
              </Text>
            </View>

            {/* Liste des formats */}
            <View style={styles.formatList}>
              {EXPORT_FORMATS.map((format) => (
                <TouchableOpacity
                  key={format.id}
                  style={[
                    styles.formatOption,
                    selectedFormat === format.id && styles.formatOptionSelected,
                  ]}
                  onPress={() => setSelectedFormat(format.id)}
                  activeOpacity={0.7}
                >
                  {/* Contenu */}
                  <View style={styles.formatContent}>
                    <Text style={styles.formatLabel}>{format.label}</Text>
                    <Text style={styles.formatDescription}>
                      {format.description}
                    </Text>
                  </View>

                  {/* Checkbox */}
                  <View
                    style={[
                      styles.formatCheckbox,
                      selectedFormat === format.id &&
                        styles.formatCheckboxSelected,
                    ]}
                  >
                    {selectedFormat === format.id && (
                      <Text style={styles.formatCheckmark}>✓</Text>
                    )}
                  </View>
                </TouchableOpacity>
              ))}
            </View>

            {/* Boutons d'action */}
            <View style={styles.modalActions}>
              <TouchableOpacity
                style={[styles.modalButton, styles.cancelButton]}
                onPress={handleCloseModal}
                disabled={exporting}
                activeOpacity={0.7}
              >
                <Text style={styles.cancelButtonText}>Annuler</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.modalButton, styles.exportButtonConfirm]}
                onPress={handleExport}
                disabled={!selectedFormat || exporting}
                activeOpacity={0.7}
              >
                {exporting ? (
                  <View style={styles.loadingContainer}>
                    <ActivityIndicator size="small" color="#FFFFFF" />
                    <Text style={styles.loadingText}>Export...</Text>
                  </View>
                ) : (
                  <Text style={styles.exportButtonConfirmText}>Exporter</Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </>
  );
}
