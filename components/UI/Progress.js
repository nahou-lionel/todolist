import React from "react";
import { StyleSheet, View } from "react-native-web";
import { colors } from "../../styles/theme";

export default function Progress({ percentage }) {
  const styles = StyleSheet.create({
    container: {
      height: 10,
      width: "100%",
      backgroundColor: "#e0e0de",
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
