// app/screens/HomeScreen.js
import React from "react";
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from "react-native";
import { useRouter } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import Animated, { FadeInUp, BounceIn } from "react-native-reanimated";
import { signOut } from "firebase/auth";
import { auth } from "../../firebase";  // adjust path if needed

export default function HomeScreen() {
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await signOut(auth);
      router.replace("/login"); // ✅ redirect directly to login
    } catch (error) {
      console.error("Logout Error:", error);
    }
  };

  const modules = [
    {
      key: "citizen",
      title: "Citizen",
      description: "Learn your rights, responsibilities, and how to participate effectively.",
      route: "/screens/CitizenLearning",
      colors: ["#4CAF50", "#81C784"],
      icon: "🧑‍⚖️",
    },
    {
      key: "institute",
      title: "Institute",
      description: "Explore institutional roles, governance, and organizational learning paths.",
      route: "/screens/InstituteDashboard",
      colors: ["#FF9800", "#FFB74D"],
      icon: "🏛️",
    },
  ];

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* ✅ Header Row with Logout */}
      <View style={styles.headerRow}>
        <View style={styles.headerLeft}>
          <Text style={styles.logo}>⚖️</Text>
          <Text style={styles.title}>ConstitutionWise</Text>
        </View>

        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>
      </View>

      {/* Subtitle */}
      <Text style={styles.subtitle}>
        Know your rights, learn the law — choose your learning path
      </Text>

      {/* Cards */}
      {modules.map((module, index) => (
        <Animated.View
          key={module.key}
          entering={FadeInUp.delay(index * 200)}
          style={{ width: "100%", marginBottom: 20 }}
        >
          <LinearGradient colors={module.colors} style={styles.card}>
            <Text style={styles.icon}>{module.icon}</Text>
            <Text style={styles.cardTitle}>{module.title}</Text>
            <Text style={styles.cardDesc}>{module.description}</Text>
            <TouchableOpacity
              style={styles.button}
              onPress={() => router.push(module.route)}
            >
              <Animated.Text entering={BounceIn} style={styles.buttonText}>
                Start Learning
              </Animated.Text>
            </TouchableOpacity>
          </LinearGradient>
        </Animated.View>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20, alignItems: "center" },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
    marginBottom: 15,
  },
  headerLeft: { flexDirection: "row", alignItems: "center" },
  logo: { fontSize: 40, marginRight: 8 },
  title: { fontSize: 24, fontWeight: "bold", color: "#333" },
  subtitle: {
    fontSize: 16,
    color: "#555",
    textAlign: "center",
    marginBottom: 25,
    paddingHorizontal: 10,
  },
  logoutButton: {
    backgroundColor: "#e53935",
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 10,
  },
  logoutText: { color: "#fff", fontSize: 14, fontWeight: "bold" },
  card: {
    borderRadius: 20,
    padding: 25,
    shadowColor: "#000",
    shadowOpacity: 0.25,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 5 },
    elevation: 8,
    alignItems: "center",
  },
  icon: { fontSize: 40, marginBottom: 15 },
  cardTitle: { fontSize: 24, fontWeight: "bold", color: "#fff", marginBottom: 10 },
  cardDesc: { fontSize: 16, color: "#fff", marginBottom: 20, textAlign: "center" },
  button: {
    backgroundColor: "#fff",
    padding: 14,
    borderRadius: 12,
    alignItems: "center",
    width: "80%",
  },
  buttonText: { color: "#333", fontSize: 16, fontWeight: "bold" },
});
