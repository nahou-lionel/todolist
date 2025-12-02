export const createStyles = (colors, shadows) => ({
  // Conteneur de l'aperçu d'image
  imagePreviewContainer: {
    position: "relative",
    width: "100%",
    height: 200,
    borderRadius: 12,
    overflow: "hidden",
    marginBottom: 16,
    backgroundColor: colors.border,
  },

  // Image d'aperçu
  imagePreview: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },

  // Bouton de suppression (X)
  removeButton: {
    position: "absolute",
    top: 8,
    right: 8,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "rgba(0, 0, 0, 0.6)",
    justifyContent: "center",
    alignItems: "center",
  },

  removeButtonText: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "600",
  },
});
