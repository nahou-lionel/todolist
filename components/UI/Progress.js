import React from "react";
import { StyleSheet, View } from "react-native";
import { useTheme } from "../../hooks/useTheme";

export default function Progress({ percentage }) {
  const { colors } = useTheme();

  const styles = StyleSheet.create({
    container: {
      height: 10,
      width: "100%",
      backgroundColor: colors.border,
      borderRadius: 5,
    },
    content: {
      height: "100%",
      borderRadius: 5,
      width: `${percentage}%`,
      backgroundColor: colors.primary,
    },
  });

  return (
    <View style={styles.container}>
      <View style={styles.content}></View>
    </View>
  );
}
