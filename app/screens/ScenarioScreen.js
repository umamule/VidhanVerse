import AsyncStorage from '@react-native-async-storage/async-storage';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useState } from 'react';
import { Alert, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const scenarios = [
  {
    scenario: "The government passes a law that allows only men to apply for certain high-paying jobs in the public sector. Is this law valid under Article 14?",
    options: ["Yes, because it's a reasonable classification.", "No, because it discriminates arbitrarily without valid justification."],
    answer: 1,
    explanation: "Article 14 prohibits arbitrary discrimination. Gender-based discrimination in employment is not justified."
  },
  {
    scenario: "A state classifies citizens into 'rich' and 'poor' for tax purposes, but the criteria are vague and unfair. Is this classification valid?",
    options: ["Yes, as long as it's for taxation.", "No, because it lacks intelligible differentia and rational nexus."],
    answer: 1,
    explanation: "For classification to be valid, it must have clear basis and reasonable connection to the purpose."
  },
  {
    scenario: "A public school denies admission to students from a particular religion. Does this violate Article 14?",
    options: ["No, if it's a private school.", "Yes, as it denies equal protection to all persons."],
    answer: 1,
    explanation: "Article 14 ensures equal protection of laws to all persons, regardless of religion."
  },
  {
    scenario: "The police arrest a person without any reason or evidence. Is this action protected under Article 14?",
    options: ["Yes, police have discretion.", "No, it violates equality before law and equal protection."],
    answer: 1,
    explanation: "Arbitrary actions by the state are prohibited; everyone must be treated equally."
  },
  {
    scenario: "A foreigner living in India is denied access to public healthcare facilities available to citizens. Is this permissible?",
    options: ["Yes, foreigners have no rights.", "No, Article 14 applies to all persons within Indian territory."],
    answer: 1,
    explanation: "Article 14 guarantees equality to all persons, including foreigners, within India."
  }
];

const ScenarioScreen = () => {
  const router = useRouter();
  const { id } = useLocalSearchParams(); // lesson id
  const [currentScenario, setCurrentScenario] = useState(0);
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [answers, setAnswers] = useState([]);

  const handleAnswer = (selectedIndex) => {
    const isCorrect = selectedIndex === scenarios[currentScenario].answer;
    const newAnswers = [...answers, selectedIndex];
    setAnswers(newAnswers);
    if (isCorrect) {
      setScore(score + 1);
    }
    if (currentScenario < scenarios.length - 1) {
      setCurrentScenario(currentScenario + 1);
    } else {
      setShowResult(true);
    }
  };

  const completeGame = async () => {
    try {
      const userId = await AsyncStorage.getItem('userId');
      if (userId) {
        const updatedLessons = [1]; // Assuming lesson 1 is completed
        const updatedQuizzes = [4]; // Game id 4 completed
        const updatedScores = { 4: score }; // Score for game 4
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
        <Text style={styles.title}>Scenario Game Completed!</Text>
        <Text style={styles.score}>Your Score: {score}/{scenarios.length}</Text>
        <TouchableOpacity style={styles.button} onPress={completeGame}>
          <Text style={styles.buttonText}>Complete Game</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Article 14 Scenario Decisions</Text>
      <Text style={styles.scenarioNumber}>Scenario {currentScenario + 1} of {scenarios.length}</Text>
      <Text style={styles.scenario}>{scenarios[currentScenario].scenario}</Text>
      {scenarios[currentScenario].options.map((option, index) => (
        <TouchableOpacity key={index} style={styles.option} onPress={() => handleAnswer(index)}>
          <Text style={styles.optionText}>{option}</Text>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#fff' },
  title: { fontSize: 24, fontWeight: 'bold', textAlign: 'center', marginBottom: 20 },
  scenarioNumber: { fontSize: 16, textAlign: 'center', marginBottom: 10 },
  scenario: { fontSize: 18, marginBottom: 20, textAlign: 'center' },
  option: { backgroundColor: '#f0f0f0', padding: 15, marginVertical: 5, borderRadius: 10 },
  optionText: { fontSize: 16 },
  score: { fontSize: 20, textAlign: 'center', marginBottom: 20 },
  button: { backgroundColor: '#4CAF50', padding: 15, borderRadius: 10, alignItems: 'center' },
  buttonText: { color: '#fff', fontSize: 18, fontWeight: 'bold' }
});

export default ScenarioScreen;
