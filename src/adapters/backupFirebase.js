import firebase from "firebase/app"; // Required for side-effects

import "firebase/firestore";
var config = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: `${process.env.REACT_APP_FIREBASE_PROJECT_ID}.firebaseapp.com`,
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID
};
let db;
firebase.initializeApp(config);
db = firebase.firestore(); // if (!firebase.apps.length) {
//   // Initialize Cloud Firestore through Firebase
//   const settings = { /* your settings... */ timestampsInSnapshots: true };
//   db.settings(settings);
// }
// if (!db) {
//   db = firebase.firestore();
// }

function saveAnalytics(agent, data) {
  // Add a new document in collection "cities"
  return db.collection("tutor_analytics").doc(agent).set(data);
}

function getAnalytics(agent) {
  let ref = db.collection("tutor_analytics").doc(agent);
  return genericGet(ref);
}

function saveWorkingData(agent, data) {
  return db.collection("tutor_working_data").doc(agent).set({
    record: data
  });
}

function genericGet(ref, defaultParam = {}) {
  return ref.get().then(function (doc) {
    if (doc.exists) {
      return doc.data();
    } else {
      return defaultParam;
    }
  }).catch(function (error) {
    throw error;
  });
}

function getWorkingData(agent, defaultParam = []) {
  var docRef = db.collection("tutor_working_data").doc("agent");
  return genericGet(docRef, {
    record: defaultParam
  }).then(d => d.record);
}

export default {
  saveAnalytics,
  getAnalytics,
  getWorkingData,
  saveWorkingData
};