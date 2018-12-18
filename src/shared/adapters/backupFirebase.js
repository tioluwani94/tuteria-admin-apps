import firebase from "firebase/app";
// Required for side-effects
import "firebase/firestore";
var config = {
  apiKey: process.env.FIREBASE_API_KEY,
  authDomain: `${process.env.FIREBASE_PROJECT_ID}.firebaseapp.com`,
  projectId: process.env.FIREBASE_PROJECT_ID
};
firebase.initializeApp(config);

// Initialize Cloud Firestore through Firebase
const db = firebase.firestore();

function saveAnalytics(agent, data) {
  // Add a new document in collection "cities"
  return db
    .collection("tutor_analytics")
    .doc(agent)
    .set(data);
}

function getAnalytics(agent) {}

function saveWorkingData(agent, data) {}
