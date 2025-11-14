import { useRouter } from "expo-router";
import { useState } from "react";
import {
  Alert,
  Image, // Although not used, keeping in case you decide to switch
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from "react-native";

// ⚠️ IMPORTANT: Update this constant with your computer's local IP address and Express port.
// Example: 'http://10.44.114.8:3000'
const BASE_URL = 'http://10.250.96.8:5000';

export default function Signup() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  const handleSignup = async () => {
    // Basic client-side validation
    if (!name || !email || !password) {
      Alert.alert("Missing Fields", "Please enter your name, email, and password.");
      return;
    }

    try {
      const response = await fetch(`${BASE_URL}/api/users/signup`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name,
          email,
          password,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        // HTTP status 200-299: Registration successful
        console.log("✅ User registered:", data.user);
        Alert.alert("Success", "Account created successfully!");
        // Navigate to the login screen
        router.replace("/screens/login"); 
      } else {
        // Server returned an error (e.g., status 409 Conflict, 400 Bad Request)
        console.log("❌ Signup failed response:", data.message);
        Alert.alert("Signup failed", data.message || "An error occurred on the server.");
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

      <Text style={styles.title}>Create Account</Text>
      
      <TextInput
        placeholder="Full Name"
        value={name}
        onChangeText={setName}
        style={styles.input}
      />
      
      <TextInput
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        style={styles.input}
        keyboardType="email-address"
        autoCapitalize="none" // Prevent auto-capitalizing email input
      />
      <TextInput
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        style={styles.input}
      />

      <TouchableOpacity style={styles.button} onPress={handleSignup}>
        <Text style={styles.buttonText}>Sign Up</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.linkButton}
        onPress={() => router.replace("/screens/login")}
      >
        <Text style={styles.linkText}>Already have an account? Login</Text>
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
