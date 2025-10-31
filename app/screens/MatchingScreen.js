import AsyncStorage from '@react-native-async-storage/async-storage';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useState } from 'react';
import { Alert, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const matchingPairs = [
  { term: "Equality before law", definition: "All persons are treated equally under the law." },
  { term: "Equal protection of laws", definition: "Laws must protect all persons equally." },
  { term: "Reasonable classification", definition: "State can classify people if it has valid reasons." },
  { term: "Arbitrary discrimination", definition: "Unfair treatment without justification." },
  { term: "Article 14", definition: "Guarantees equality to all persons." }
];

const MatchingScreen = () => {
  const router = useRouter();
  const { id } = useLocalSearchParams(); // lesson id
  const [selectedTerm, setSelectedTerm] = useState(null);
  const [selectedDef, setSelectedDef] = useState(null);
  const [matchedPairs, setMatchedPairs] = useState([]);
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);

  const terms = matchingPairs.map(pair => pair.term);
  const definitions = matchingPairs.map(pair => pair.definition);

  const handleSelectTerm = (term) => {
    if (selectedTerm === term) {
      setSelectedTerm(null);
    } else {
      setSelectedTerm(term);
      if (selectedDef) {
        checkMatch(term, selectedDef);
      }
    }
  };

  const handleSelectDef = (def) => {
    if (selectedDef === def) {
      setSelectedDef(null);
    } else {
      setSelectedDef(def);
      if (selectedTerm) {
        checkMatch(selectedTerm, def);
      }
    }
  };

  const checkMatch = (term, def) => {
    const pair = matchingPairs.find(p => p.term === term && p.definition === def);
    if (pair) {
      setMatchedPairs([...matchedPairs, pair]);
      setScore(score + 1);
    }
    setSelectedTerm(null);
    setSelectedDef(null);
    if (matchedPairs.length + 1 === matchingPairs.length) {
      setShowResult(true);
    }
  };

  const completeGame = async () => {
    try {
      const userId = await AsyncStorage.getItem('userId');
      if (userId) {
        const updatedLessons = [1]; // Assuming lesson 1 is completed
        const updatedQuizzes = [3]; // Game id 3 completed
        const updatedScores = { 3: score }; // Score for game 3
        const response = await fetch(`http://10.44.114.8:5000/api/users/progress/${userId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            lessonsCompleted: updatedLessons,
            quizzesCompleted: updatedQuizzes,
            quizScores: updatedScores
          })
        });
        if (response.ok) {
          Alert.alert('Success', 'Progress updated!');
        } else {
          Alert.alert('Error', 'Failed to update progress');
        }
      }
    } catch (error) {
      console.error('Error updating progress:', error);
      Alert.alert('Error', 'Failed to update progress');
    }
    router.push('/screens/CitizenLearning');
  };

  if (showResult) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Matching Game Completed!</Text>
        <Text style={styles.score}>Your Score: {score}/{matchingPairs.length}</Text>
        <TouchableOpacity style={styles.button} onPress={completeGame}>
          <Text style={styles.buttonText}>Complete Game</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Article 14 Matching Game</Text>
      <Text style={styles.instruction}>Match the terms with their definitions</Text>
      <View style={styles.gameContainer}>
        <View style={styles.column}>
          <Text style={styles.columnTitle}>Terms</Text>
          {terms.map((term, index) => (
            <TouchableOpacity
              key={index}
              style={[
                styles.item,
                selectedTerm === term && styles.selected,
                matchedPairs.some(p => p.term === term) && styles.matched
              ]}
              onPress={() => handleSelectTerm(term)}
              disabled={matchedPairs.some(p => p.term === term)}
            >
              <Text style={styles.itemText}>{term}</Text>
            </TouchableOpacity>
          ))}
        </View>
        <View style={styles.column}>
          <Text style={styles.columnTitle}>Definitions</Text>
          {definitions.map((def, index) => (
            <TouchableOpacity
              key={index}
              style={[
                styles.item,
                selectedDef === def && styles.selected,
                matchedPairs.some(p => p.definition === def) && styles.matched
              ]}
              onPress={() => handleSelectDef(def)}
              disabled={matchedPairs.some(p => p.definition === def)}
            >
              <Text style={styles.itemText}>{def}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#fff', justifyContent: 'center' },
  title: { fontSize: 24, fontWeight: 'bold', textAlign: 'center', marginBottom: 20 },
  instruction: { fontSize: 16, textAlign: 'center', marginBottom: 20 },
  gameContainer: { flexDirection: 'row', justifyContent: 'space-between' },
  column: { flex: 1, marginHorizontal: 10 },
  columnTitle: { fontSize: 18, fontWeight: 'bold', textAlign: 'center', marginBottom: 10 },
  item: { backgroundColor: '#f0f0f0', padding: 15, marginVertical: 5, borderRadius: 10 },
  selected: { backgroundColor: '#4CAF50' },
  matched: { backgroundColor: '#81C784' },
  itemText: { fontSize: 14, textAlign: 'center' },
  score: { fontSize: 20, textAlign: 'center', marginBottom: 20 },
  button: { backgroundColor: '#4CAF50', padding: 15, borderRadius: 10, alignItems: 'center' },
  buttonText: { color: '#fff', fontSize: 18, fontWeight: 'bold' }
});

export default MatchingScreen;
