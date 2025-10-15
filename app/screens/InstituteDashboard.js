import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
  ScrollView,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import debounce from "lodash.debounce";

const API_BASE = "http:// 10.147.21.191:5000/api"; // <-- change if needed

export default function InstituteLearning() {
  const [search, setSearch] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  // Function to fetch search results
  const doSearch = async (q) => {
    if (!q || q.trim().length < 1) {
      setResults([]);
      return;
    }
    setLoading(true);
    try {
      const res = await fetch(
        `${API_BASE}/resources/search?q=${encodeURIComponent(q)}`
      );
      const json = await res.json();
      if (json.ok) setResults(json.results);
      else setResults([]);
    } catch (err) {
      console.error(err);
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  // Debounce search
  const debounced = useCallback(debounce(doSearch, 400), []);
  useEffect(() => {
    debounced(search);
    return () => debounced.cancel();
  }, [search]);

  return (
    <View style={styles.container}>
      {/* Header */}
      <LinearGradient colors={["#FF9800", "#FFB74D"]} style={styles.header}>
        <Text style={styles.headerText}>Institute Learning</Text>
        <Text style={styles.subHeader}>Explore Acts, Articles & Case Laws</Text>
      </LinearGradient>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <TextInput
          placeholder="Search Acts, Articles, or Case Laws..."
          placeholderTextColor="#999"
          value={search}
          onChangeText={setSearch}
          style={styles.searchInput}
        />
      </View>

      {/* Loading indicator */}
      {loading && <ActivityIndicator style={{ margin: 12 }} size="small" />}

      {/* Search Results */}
      <FlatList
        data={results}
        keyExtractor={(item) => item._id || item.id}
        contentContainerStyle={{ paddingHorizontal: 15, paddingBottom: 200 }}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.card}
            onPress={() =>
              router.push(`/screens/ResourceDetail?id=${item._id || item.id}`)
            }
          >
            <Text style={styles.typeTag}>{item.type}</Text>
            <Text style={styles.cardTitle}>{item.title}</Text>
            <Text style={styles.cardDesc} numberOfLines={2}>
              {item.summary || item.desc}
            </Text>
          </TouchableOpacity>
        )}
        ListEmptyComponent={() => (
          <View style={{ padding: 20 }}>
            <Text style={{ color: "#666" }}>
              No results. Try searching "Article 21", "RTI", or a case name.
            </Text>
          </View>
        )}
      />

      {/* Mock Test Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Mock Tests</Text>
        <Text style={styles.sectionDesc}>
          Test your knowledge of constitutional laws and articles.
        </Text>
        <TouchableOpacity
          style={[styles.button, { backgroundColor: "#FF9800" }]}
          onPress={() => router.push("/screens/MockList")}
        >
          <Text style={styles.buttonText}>Start Mock Test</Text>
        </TouchableOpacity>
      </View>

      {/* Profile Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Profile</Text>
        <Text style={styles.sectionDesc}>
          Manage your institute’s details, teachers, and course progress.
        </Text>
        <TouchableOpacity
          style={[styles.button, { backgroundColor: "#4CAF50" }]}
          onPress={() => router.push("/screens/InstituteProfile")}
        >
          <Text style={styles.buttonText}>View Profile</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  header: {
    padding: 25,
    borderBottomLeftRadius: 25,
    borderBottomRightRadius: 25,
    alignItems: "center",
  },
  headerText: { fontSize: 26, fontWeight: "bold", color: "#fff" },
  subHeader: { fontSize: 14, color: "#fbe9e7", marginTop: 5 },
  searchContainer: {
    margin: 15,
    backgroundColor: "#f5f5f5",
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  searchInput: {
    fontSize: 16,
    color: "#333",
  },
  card: {
    backgroundColor: "#FFF3E0",
    marginBottom: 12,
    borderRadius: 15,
    padding: 15,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  typeTag: {
    fontSize: 12,
    color: "#FF6F00",
    fontWeight: "bold",
    marginBottom: 5,
    textTransform: "uppercase",
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 4,
  },
  cardDesc: { fontSize: 14, color: "#555" },
  section: {
    margin: 15,
    backgroundColor: "#FFF8E1",
    borderRadius: 15,
    padding: 15,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  sectionTitle: { fontSize: 18, fontWeight: "bold", color: "#333" },
  sectionDesc: { fontSize: 14, color: "#666", marginVertical: 6 },
  button: {
    marginTop: 10,
    padding: 12,
    borderRadius: 10,
    alignItems: "center",
  },
  buttonText: { color: "#fff", fontSize: 16, fontWeight: "bold" },
});
