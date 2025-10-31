# Task: Rewrite TrueFalseScreen.js with 5 True/False Questions on Article 14 and Connect with CitizenLearning.js

## Information Gathered
- TrueFalseScreen.js currently fetches questions from backend API `/api/mock/quiz/${id}/2`.
- CitizenLearning.js has games array with game id 2 routing to TrueFalseScreen?id=1 for lesson 1 (Article 14).
- Backend has 15 true/false questions seeded for Article 14 True/False.
- User wants to rewrite TrueFalseScreen.js with 5 hardcoded questions instead of fetching.

## Plan
- [] Rewrite TrueFalseScreen.js to include 5 hardcoded true/false questions on Right to Equality (Article 14).
- [] Ensure the component logic handles the 5 questions, scoring, and progress update.
- [] Verify connection with CitizenLearning.js (selecting game 2 navigates to TrueFalseScreen with id=1).

## Dependent Files
- app/screens/TrueFalseScreen.js: Rewrite with hardcoded questions.
- app/screens/CitizenLearning.js: Already connected, no changes needed.

## Followup Steps
- [] Test the quiz flow: Navigate to lesson 1, select game 2, answer questions, check score and progress update.
- [] Ensure navigation back to CitizenLearning after completion.
