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

  // Bouton pour ajouter une image (version compacte)
  addButtonCompact: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.card,
  },

  addButtonDisabled: {
    opacity: 0.5,
  },

  addButtonIcon: {
    fontSize: 20,
    marginRight: 8,
  },

  addButtonTextCompact: {
    fontSize: 14,
    color: colors.text,
    fontWeight: "500",
  },
});
