import React from "react";
import { View, Text, StyleSheet } from "react-native";
const API_BASE = "http:// 10.147.21.191:5000/api"; // <-- change if needed


export default function MockTestScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>📘 Mock Test Screen Coming Soon!</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "#fff" },
  text: { fontSize: 18, fontWeight: "bold", color: "#333" },
});
