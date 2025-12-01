import { MaterialIcons } from "@expo/vector-icons";
import React, { useState } from "react";
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Modal,
  Platform,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useTheme } from "../../hooks/useTheme";
import { useImagePicker } from "../../hooks/useImagePicker";
import { createStyles } from "../../styles/AddTodoModal.styles";
import ImagePickerButton from "./ImagePickerButton";

/**
 * Modal pour ajouter une nouvelle tâche
 * @param {boolean} visible - Visibilité du modal
 * @param {Function} onClose - Callback pour fermer le modal
 * @param {Function} onSubmit - Callback pour soumettre la tâche (content, imageUri)
 * @param {boolean} loading - État de chargement
 */
export default function AddTodoModal({ visible, onClose, onSubmit, loading }) {
  const { colors, shadows } = useTheme();
  const styles = createStyles(colors, shadows);

  const [todoContent, setTodoContent] = useState("");
  const { pickImage, selectedImage, clearImage, isLoading: imageLoading } =
    useImagePicker();

  const handleSubmit = () => {
    if (todoContent.trim()) {
      onSubmit(todoContent.trim(), selectedImage);
      setTodoContent("");
      clearImage();
    }
  };

  const handleClose = () => {
    setTodoContent("");
    clearImage();
    onClose();
  };

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="slide"
      onRequestClose={handleClose}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.modalOverlay}
      >
        <View style={styles.modalContainer}>
          {/* En-tête */}
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Nouvelle tâche</Text>
            <TouchableOpacity onPress={handleClose} disabled={loading}>
              <MaterialIcons name="close" size={24} color={colors.text} />
            </TouchableOpacity>
          </View>

          {/* Contenu scrollable */}
          <ScrollView style={styles.modalContent}>
            {/* Input texte */}
            <Text style={styles.label}>Description</Text>
            <View style={styles.inputRow}>
              <TextInput
                style={styles.input}
                value={todoContent}
                onChangeText={setTodoContent}
                placeholder="Qu'avez-vous à faire ?"
                placeholderTextColor={colors.placeholder}
                multiline
                numberOfLines={3}
                autoFocus
                editable={!loading}
              />

              {/* Icône trombone à côté de l'input */}
              <TouchableOpacity
                style={styles.attachmentButton}
                onPress={pickImage}
                disabled={loading || imageLoading}
              >
                <MaterialIcons
                  name="attach-file"
                  size={22}
                  color={selectedImage ? colors.primary : colors.textSecondary}
                />
              </TouchableOpacity>
            </View>

            {/* Aperçu de l'image sélectionnée */}
            {selectedImage && (
              <ImagePickerButton
                imageUri={selectedImage}
                onPickImage={pickImage}
                onRemoveImage={clearImage}
                disabled={loading}
                loading={imageLoading}
              />
            )}
          </ScrollView>

          {/* Boutons d'action */}
          <View style={styles.modalActions}>
            <TouchableOpacity
              style={[styles.modalButton, styles.cancelButton]}
              onPress={handleClose}
              disabled={loading}
            >
              <Text style={styles.cancelButtonText}>Annuler</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.modalButton,
                styles.submitButton,
                (!todoContent.trim() || loading) && styles.submitButtonDisabled,
              ]}
              onPress={handleSubmit}
              disabled={!todoContent.trim() || loading}
            >
              {loading ? (
                <ActivityIndicator size="small" color="#FFFFFF" />
              ) : (
                <Text style={styles.submitButtonText}>Ajouter</Text>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}
