import firebase from "firebase/app";
// Required for side-effects
// import "firebase/firestore";

var config = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: `${process.env.REACT_APP_FIREBASE_PROJECT_ID}.firebaseapp.com`,
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID
};
let db = {
  collection: () => ({
    doc: agent => ({
      set: data => {
        return new Promise(resolve => resolve(data));
      },
      get: () => new Promise(resolve => resolve({ exists: true }))
    })
  })
};

function appFireBase(keys) {
  let { analytics, storage } = keys;
  return {
    loadFireStore: () => {
      return new Promise(resolve => resolve(db));
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
    getWorkingData: (agent, defaultParam = [], defaultValue) => {
      var docRef = db.collection(storage).doc(agent);
      return genericGet(docRef, { record: defaultParam }, defaultValue).then(
        d => d.record
      );
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
      return new Promise(resolve => resolve("james@example.com"));
    }
  };
}
function parseJwt(token) {
  if (token) {
    var base64Url = token.split(".")[1];
    if (base64Url) {
      try {
        var base64 = base64Url.replace("-", "+").replace("_", "/");
        return JSON.parse(window.atob(base64));
      } catch (err) {
        return {};
      }
    }
  }
  return {};
}
function genericGet(ref, defaultParam = {}, result) {
  return ref
    .get()
    .then(function(doc) {
      if (doc.exists) {
        if (result) {
          return { record: result };
        }
        debugger;
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
