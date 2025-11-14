// app/screens/login.js
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from "expo-router";
import { useState } from "react";
import { Alert, Image, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";

// ⚠️ IMPORTANT: Update this constant with your computer's local IP address and Express port.
// Example: 'http://10.44.114.8:5000'
const BASE_URL = 'http://10.250.96.8:5000';

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert("Error", "Please enter email and password");
      return;
    }

    try {
      const response = await fetch(`${BASE_URL}/api/users/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          password,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        // HTTP status 200: Login successful
        console.log("✅ User logged in:", data.user);
        // Store token in AsyncStorage
        await AsyncStorage.setItem('token', data.token);
        await AsyncStorage.setItem('user', JSON.stringify(data.user));
        Alert.alert("Success", "Login successful!");
        // Navigate to the home screen
        router.replace("/screens/HomeScreen");
      } else {
        // Server returned an error (e.g., status 401 Unauthorized)
        console.log("❌ Login failed response:", data.message);
        Alert.alert("Login failed", data.message || "An error occurred on the server.");
      }

    } catch (error) {
      // Network error (e.g., server is not running, IP address is wrong)
      console.error("❌ Network Error:", error.message);
      Alert.alert(
        "Connection Error",
        `Could not connect to the backend. Please ensure your Express server is running at ${BASE_URL}.`
      );
    }
  };

  return (
    <View style={styles.container}>
      {/* App Logo */}
      <Image source={require("../assets/logo.png")} style={styles.logo} />

      <Text style={styles.title}>Welcome Back!</Text>
      
      <TextInput
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        style={styles.input}
        keyboardType="email-address"
      />
      <TextInput
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        style={styles.input}
      />

      <TouchableOpacity style={styles.button} onPress={handleLogin}>
        <Text style={styles.buttonText}>Login</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.linkButton}
        onPress={() => router.replace("/screens/signup")}
      >
        <Text style={styles.linkText}>Don't have an account? Sign Up</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f0f8ff",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  logo: {
    width: 120,
    height: 120,
    marginBottom: 20,
    borderRadius: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 20,
    color: "#333",
  },
  input: {
    width: "100%",
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 10,
    padding: 12,
    marginBottom: 15,
    backgroundColor: "#fff",
  },
  button: {
    width: "100%",
    backgroundColor: "#4CAF50",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
    marginBottom: 10,
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
  linkButton: {
    marginTop: 5,
  },
  linkText: {
    color: "#4CAF50",
    fontSize: 16,
  },
});
