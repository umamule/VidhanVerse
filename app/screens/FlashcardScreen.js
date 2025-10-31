import AsyncStorage from '@react-native-async-storage/async-storage';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useState } from 'react';
import { Alert, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const flashcards = [
  { front: "What does Article 14 guarantee?", back: "Equality before law and equal protection of laws." },
  { front: "Who does Article 14 apply to?", back: "All persons within the territory of India." },
  { front: "What is reasonable classification?", back: "State can classify people if it has intelligible differentia and rational nexus." },
  { front: "What is arbitrary discrimination?", back: "Unfair treatment without valid justification." },
  { front: "Can the State discriminate arbitrarily?", back: "No, Article 14 prohibits it." }
];

const FlashcardScreen = () => {
  const router = useRouter();
  const { id } = useLocalSearchParams(); // lesson id
  const [currentCard, setCurrentCard] = useState(0);
  const [showBack, setShowBack] = useState(false);
  const [completed, setCompleted] = useState(false);

  const flipCard = () => {
    setShowBack(!showBack);
  };

  const nextCard = () => {
    if (currentCard < flashcards.length - 1) {
      setCurrentCard(currentCard + 1);
      setShowBack(false);
    } else {
      setCompleted(true);
    }
  };

  const completeReview = async () => {
    try {
      const userId = await AsyncStorage.getItem('userId');
      if (userId) {
        const updatedLessons = [1]; // Assuming lesson 1 is completed
        const updatedQuizzes = [5]; // Game id 5 completed
        const updatedScores = { 5: flashcards.length }; // Full score for review
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

  if (completed) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Flashcard Review Completed!</Text>
        <Text style={styles.message}>You reviewed all {flashcards.length} flashcards.</Text>
        <TouchableOpacity style={styles.button} onPress={completeReview}>
          <Text style={styles.buttonText}>Complete Review</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Article 14 Flashcard Review</Text>
      <Text style={styles.cardNumber}>Card {currentCard + 1} of {flashcards.length}</Text>
      <TouchableOpacity style={styles.card} onPress={flipCard}>
        <Text style={styles.cardText}>
          {showBack ? flashcards[currentCard].back : flashcards[currentCard].front}
        </Text>
        <Text style={styles.flipHint}>Tap to flip</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.nextButton} onPress={nextCard}>
        <Text style={styles.nextButtonText}>Next Card</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#fff', justifyContent: 'center', alignItems: 'center' },
  title: { fontSize: 24, fontWeight: 'bold', textAlign: 'center', marginBottom: 20 },
  cardNumber: { fontSize: 16, marginBottom: 20 },
  card: { width: '80%', height: 200, backgroundColor: '#4CAF50', borderRadius: 10, justifyContent: 'center', alignItems: 'center', marginBottom: 20 },
  cardText: { fontSize: 18, color: '#fff', textAlign: 'center', padding: 10 },
  flipHint: { fontSize: 14, color: '#E8F5E9', marginTop: 10 },
  nextButton: { backgroundColor: '#4CAF50', padding: 15, borderRadius: 10 },
  nextButtonText: { color: '#fff', fontSize: 18, fontWeight: 'bold' },
  message: { fontSize: 16, textAlign: 'center', marginBottom: 20 },
  button: { backgroundColor: '#4CAF50', padding: 15, borderRadius: 10, alignItems: 'center' },
  buttonText: { color: '#fff', fontSize: 18, fontWeight: 'bold' }
});

export default FlashcardScreen;
