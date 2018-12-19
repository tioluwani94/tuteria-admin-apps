import firebase from "firebase/app";
// Required for side-effects
// import "firebase/firestore";

var config = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: `${process.env.REACT_APP_FIREBASE_PROJECT_ID}.firebaseapp.com`,
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID
};
let db;
function loadFireStore() {
  return import(`firebase/firestore`).then(() => {
    db = firebase.firestore();
    // Initialize Cloud Firestore through Firebase
    const settings = { /* your settings... */ timestampsInSnapshots: true };
    db.settings(settings);
    return db
  });
}
if (!firebase.apps.length) {
  firebase.initializeApp(config);
  loadFireStore();
}
if (!db) {
  loadFireStore();
}
function appFireBase(keys) {
  let { analytics, storage } = keys;
  return {
    loadFireStore: () => {
      if (db) {
        return new Promise(resolve => resolve(db));
      }
      return loadFireStore();
    },
    saveAnalytics: (agent, data) => {
      return db
        .collection(analytics)
        .doc(agent)
        .set(data);
    },
    getAnalytics: agent => {
      let ref = db.collection(analytics).doc(agent);
      return genericGet(ref);
    },
    saveWorkingData: (agent, data) => {
      return db
        .collection(storage)
        .doc(agent)
        .set({ record: data });
    },
    getWorkingData: (agent, defaultParam = []) => {
      var docRef = db.collection(storage).doc(agent);
      return genericGet(docRef, { record: defaultParam }).then(d => d.record);
    },
    loginUser: (email, password) => {
      return import(`firebase/auth`)
        .then(() => {
          return firebase
            .auth()
            .signInWithEmailAndPassword(email, password)
            .then(() => {
              let user = firebase.auth().currentUser;
              if (user) {
                return user.getIdToken(/* forceRefresh */ true).then(data => {
                  return {
                    token: data,
                    uid: user.email
                  };
                });
              }
              return "";
            })
            .catch(function(error) {
              throw error;
            });
        })
        .catch(err => {
          throw err;
        });
    },
    getUserToken: token => {
      let result = parseJwt(token);
      return new Promise(resolve => resolve(result.email));
    }
  };
}
function parseJwt(token) {
  var base64Url = token.split(".")[1];
  var base64 = base64Url.replace("-", "+").replace("_", "/");
  return JSON.parse(window.atob(base64));
}
function genericGet(ref, defaultParam = {}) {
  return ref
    .get()
    .then(function(doc) {
      if (doc.exists) {
        return doc.data();
      } else {
        return defaultParam;
      }
    })
    .catch(function(error) {
      throw error;
    });
}

export default appFireBase;
