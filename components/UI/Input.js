import React from 'react'
import { View, TextInput, TouchableOpacity, Text, ActivityIndicator, StyleSheet } from 'react-native'
import { colors, spacing, fontSize, borderRadius } from '../../styles/theme'

export default function Input({
  value,
  onChangeText,
  onSubmit,
  placeholder = '',
  submitLabel = 'Envoyer',
  disabled = false,
  loading = false,
  style
}) {
  return (
    <View style={[styles.container, style]}>
      <TextInput
        style={styles.input}
        placeholder={placeholder}
        value={value}
        onChangeText={onChangeText}
        editable={!disabled && !loading}
        onSubmitEditing={onSubmit}
        returnKeyType="done"
      />
      <TouchableOpacity
        style={[styles.button, (disabled || loading) && styles.buttonDisabled]}
        onPress={onSubmit}
        disabled={disabled || loading}
      >
        {loading ? (
          <ActivityIndicator size="small" color="#fff" />
        ) : (
          <Text style={styles.buttonText}>{submitLabel}</Text>
        )}
      </TouchableOpacity>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  input: {
    flex: 1,
    height: 48,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: borderRadius.medium,
    paddingHorizontal: spacing.md,
    fontSize: fontSize.regular,
    color: colors.text,
    backgroundColor: colors.background,
  },
  button: {
    height: 48,
    paddingHorizontal: spacing.xl,
    backgroundColor: colors.primary,
    borderRadius: borderRadius.medium,
    justifyContent: 'center',
    alignItems: 'center',
    minWidth: 80,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: fontSize.regular,
    fontWeight: '500',
  },
})
