import format from "date-fns/format";

export const actions = {
  FETCH_TUTOR_WORKING_DATA: "FETCH_TUTOR_WORKING_DATA",
  GET_UNVERIFIED_TUTORS: "GET_UNVERIFIED_TUTORS",
  TUTOR_INFO: "TUTOR_INFO",
  APPROVE_TUTOR: "APPROVE_TUTOR",
  DENY_TUTOR: "DENY_TUTOR",
  APPROVE_TUTOR_EMAIL: "APPROVE_TUTOR_EMAIL",
  NOTIFY_TUTOR_ABOUT_EMAIL: "NOTIFY_TUTOR_ABOUT_EMAIL",
  REJECT_PROFILE_PIC: "REJECT_PROFILE_PIC",
  REJECT_ID: "REJECT_ID",
  APPROVE_ID: "APPROVE_ID",
  APPROVE_PROFILE_PIC: "APPROVE_PROFILE_PIC",
  UPLOAD_PROFILE_PIC: "UPLOAD_PROFILE_PIC",
  UPLOAD_ID: "UPLOAD_ID",
  SAVE_PROGRESS: "SAVE_PROGRESS"
};
export const workingActions = {
  EMAIL_VERIFICATION: "email_verification",
  ID_VERIFICATION: "id_verification",
  PROFILE_VERIFICATION: "profile_verification"
};
const analytics = {
  TUTOR_APPROVAL: "APPROVE_TUTOR",
  PROFILE_PICTURE: "DENY_PROFILE_PIC",
  ID_APPROVAL: "ID_APPROVAL",
  ID_REJECTION: "ID_REJECTION",
  DENY_TUTOR: "DENY_TUTOR",
  EMAIL_VERIFY: "EMAIL_VERIFY",
  UPLOAD_PROFILE_PIC: "UPLOAD_PROFILE_PIC",
  UPLOAD_ID: "UPLOAD_ID"
};
function updateAnalytics(firebaseAction, type, agent) {
  let date = format(new Date(), "D/MM/YYYY");
  return firebaseAction("getAnalytics", [agent]).then(agentData => {
    let currentInstance = agentData[date] || {};
    let oldInstance = currentInstance[type] || 0;
    let newData = {
      ...agentData,
      [date]: { ...currentInstance, [type]: (oldInstance += 1) }
    };
    return firebaseAction("saveAnalytics", [agent, newData]);
  });
}
function getWorkingData(firebaseAction, agent, updateState) {
  return firebaseAction("getWorkingData", [agent]).then(data => {
    updateState({ pending_verifications: data });
    return data;
  });
}
export function autoSave(firebaseAction, state) {
  let { pending_verifications, agent = "Biola" } = state.context.state;
  return saveWorkingData(firebaseAction, agent, pending_verifications).then(
    () => {
      return firebaseAction("getAnalytics", [agent]).then(agentData => {
        console.log("Saved to firebase", { agentData, pending_verifications });
        return firebaseAction("saveAnalytics", [agent, agentData]);
      });
    }
  );
}
function saveWorkingData(firebaseAction, agent, data) {
  return firebaseAction("saveWorkingData", [agent, data]);
}
function getWorkingDataRecords(firebaseAction, value, { updateState, state }) {
  let { pending_verifications, agent = "Biola" } = state.context.state;
  if (pending_verifications.length > 0) {
    return new Promise(resolve => resolve(pending_verifications));
  }
  return firebaseAction("getWorkingData", [agent, []], [])
    .then(data => {
      updateState({ pending_verifications: data });
      return data;
    })
    .catch(err => {
      throw err;
    });
}
function fetchTutorDetail(
  firebaseAction,
  props,
  { getAdapter, state, updateState }
) {
  return Promise.all([
    getWorkingDataRecords(firebaseAction, null, {
      state,
      updateState
    }),
    getAdapter().fetchTutorDetail(props)
  ]).then(data => {
    let record = data[0].find(x => x.email === props.email);
    return {
      record,
      data: data[1]
    };
  });
}
const getUnverifiedTutors = (
  firebaseAction,
  params,
  { getAdapter, state, updateState }
) => {
  return Promise.all([
    getWorkingDataRecords(firebaseAction, null, {
      state,
      updateState
    }),
    getAdapter().getAllUnverifiedTutors(params)
  ]).then(data => {
    let emailsOnly = data[0].map(x => x.email);
    return data[1].filter(x => !emailsOnly.includes(x.email));
  });
};
function approveTutor(
  firebaseAction,
  { email, verified = false },
  { getAdapter, state, updateState }
) {
  let { agent = "Biola", pending_verifications } = state.context.state;
  let wk = pending_verifications.filter(x => x.email !== email);
  return getAdapter()
    .approveTutor(email, true, verified)
    .then(data => {
      updateAnalytics(firebaseAction, analytics.TUTOR_APPROVAL, agent);
      updateState({ pending_verifications: wk }, s => {
        autoSave(firebaseAction, s);
      });
      return data;
    });
}
function denyTutor(firebaseAction, email, { getAdapter, state }) {
  let { agent = "Biola" } = state.context.state;
  return getAdapter()
    .approveTutor(email, false)
    .then(data => {
      updateAnalytics(firebaseAction, analytics.DENY_TUTOR, agent);
      return data;
    });
}
function addToWorkingDirectory({ email, full_name }, state, type) {
  let { pending_verifications } = state.context.state;
  let emails_only = pending_verifications.map(x => x.email);
  return emails_only.includes(email)
    ? pending_verifications.map(x => {
        if (x.email === email) {
          return {
            ...x,
            actions: [...new Set([...x.actions, type])],
            date: format(new Date(), "YYYY-M-D H:mm:ss")
          };
        }
        return x;
      })
    : [
        ...pending_verifications,
        {
          actions: [type],
          email: email,
          date: format(new Date(), "YYYY-M-D H:mm:ss"),
          full_name
        }
      ];
}
function notifyTutorAboutEmail(
  firebaseAction,
  { email, full_name },
  { getAdapter, state, updateState }
) {
  let data = addToWorkingDirectory(
    { email, full_name },
    state,
    workingActions.EMAIL_VERIFICATION
  );
  return getAdapter()
    .notifyTutorAboutEmail(email)
    .then(() => {
      updateState({ pending_verifications: data }, s => {
        autoSave(firebaseAction, s);
      });
      return data.find(x => x.email === email);
    });
}
function approveProfilePic(firebaseAction, email, { state, updateState }) {
  let data = removeFromWorkingDirectory(
    email,
    state,
    workingActions.PROFILE_VERIFICATION
  );
  updateState({ pending_verifications: data }, s => {
    autoSave(firebaseAction, s);
  });
  return new Promise(resolve => resolve(data.find(x => x.email === email)));
}
function uploadProfilePic(
  firebaseAction,
  { email, full_name },
  { getAdapter, state, updateState }
) {
  let { agent = "Biola" } = state.context.state;
  let data = addToWorkingDirectory(
    { email, full_name },
    state,
    workingActions.PROFILE_VERIFICATION
  );
  return getAdapter()
    .uploadProfilePic(email)
    .then(() => {
      updateState({ pending_verifications: data }, s => {
        autoSave(firebaseAction, s);
      });
      updateAnalytics(firebaseAction, analytics.UPLOAD_PROFILE_PIC, agent);
      return data.find(x => x.email === email);
    });
}
function rejectProfilePic(
  firebaseAction,
  { email, full_name },
  { getAdapter, state, updateState }
) {
  let { agent = "Biola" } = state.context.state;
  let data = addToWorkingDirectory(
    { email, full_name },
    state,
    workingActions.PROFILE_VERIFICATION
  );
  return getAdapter()
    .rejectProfilePic(email)
    .then(() => {
      updateState({ pending_verifications: data }, s =>
        autoSave(firebaseAction, s)
      );
      updateAnalytics(firebaseAction, analytics.PROFILE_PICTURE, agent);
      return data.find(x => x.email === email);
    });
}
function approveIdentification(
  firebaseAction,
  email,
  { getAdapter, state, updateState }
) {
  let { agent = "Biola" } = state.context.state;
  let data = removeFromWorkingDirectory(
    email,
    state,
    workingActions.ID_VERIFICATION
  );
  return getAdapter()
    .approveIdentification(email)
    .then(() => {
      updateState({ pending_verifications: data }, s => {
        autoSave(firebaseAction, s);
      });
      updateAnalytics(firebaseAction, analytics.ID_APPROVAL, agent);
      return data.find(x => x.email === email);
    });
}
function removeFromWorkingDirectory(email, state, type) {
  let { pending_verifications } = state.context.state;
  let emails_only = pending_verifications.map(x => x.email);
  return emails_only.includes(email)
    ? pending_verifications
        .map(x => {
          if (x.email === email) {
            return {
              ...x,
              actions: x.actions.filter(o => o !== type)
            };
          }
          return x;
        })
        .filter(x => x.actions.length > 0)
    : pending_verifications;
}
function uploadVerificationId(
  firebaseAction,
  { email, full_name },
  { getAdapter, state, updateState }
) {
  let { agent = "Biola" } = state.context.state;
  let data = addToWorkingDirectory(
    { email, full_name },
    state,
    workingActions.ID_VERIFICATION
  );
  return getAdapter()
    .uploadVerificationId(email)
    .then(() => {
      updateState({ pending_verifications: data }, s => {
        autoSave(firebaseAction, s);
      });
      updateAnalytics(firebaseAction, analytics.UPLOAD_ID, agent);
      return data.find(x => x.email === email);
    });
}
function rejectIdentification(
  firebaseAction,
  { email, full_name },
  { getAdapter, state, updateState }
) {
  let { agent = "Biola" } = state.context.state;
  let data = addToWorkingDirectory(
    { email, full_name },
    state,
    workingActions.ID_VERIFICATION
  );
  return getAdapter()
    .rejectIdentification(email)
    .then(() => {
      updateState({ pending_verifications: data }, s => {
        autoSave(firebaseAction, s);
      });
      updateAnalytics(firebaseAction, analytics.ID_REJECTION, agent);
      return data.find(x => x.email === email);
    });
}
function saveProgress(firebaseAction, value, { state }) {
  autoSave(firebaseAction, state);
}
function approveTutorEmail(
  firebaseAction,
  email,
  { getAdapter, state, updateState }
) {
  let { agent = "Biola" } = state.context.state;
  let data = removeFromWorkingDirectory(
    email,
    state,
    workingActions.EMAIL_VERIFICATION
  );
  return getAdapter()
    .approveTutorEmail(email)
    .then(() => {
      updateState({ pending_verifications: data }, s => {
        autoSave(firebaseAction, s);
      });
      updateAnalytics(firebaseAction, analytics.EMAIL_VERIFY, agent);
      return data.find(x => x.email === email);
    });
}
const dispatch = (action, existingOptions = {}, firebaseFunc) => {
  // firebaseAction("getAnalytics", ["Abiola"]).then(data => {
  //   console.log(data);
  // });
  function firebaseAction(key, args) {
    return firebaseFunc.loadFireStore().then(() => firebaseFunc[key](...args));
  }
  let options = {
    [actions.FETCH_TUTOR_WORKING_DATA]: getWorkingDataRecords.bind(
      null,
      firebaseAction
    ),
    [actions.GET_UNVERIFIED_TUTORS]: getUnverifiedTutors.bind(
      null,
      firebaseAction
    ),
    [actions.TUTOR_INFO]: fetchTutorDetail.bind(null, firebaseAction),
    [actions.APPROVE_TUTOR]: approveTutor.bind(null, firebaseAction),
    [actions.DENY_TUTOR]: denyTutor.bind(null, firebaseAction),
    [actions.NOTIFY_TUTOR_ABOUT_EMAIL]: notifyTutorAboutEmail.bind(
      null,
      firebaseAction
    ),
    [actions.APPROVE_TUTOR_EMAIL]: approveTutorEmail.bind(null, firebaseAction),
    [actions.REJECT_PROFILE_PIC]: rejectProfilePic.bind(null, firebaseAction),
    [actions.APPROVE_ID]: approveIdentification.bind(null, firebaseAction),
    [actions.REJECT_ID]: rejectIdentification.bind(null, firebaseAction),
    [actions.APPROVE_PROFILE_PIC]: approveProfilePic.bind(null, firebaseAction),
    [actions.UPLOAD_PROFILE_PIC]: uploadProfilePic.bind(null, firebaseAction),
    [actions.UPLOAD_ID]: uploadVerificationId.bind(null, firebaseAction),
    [actions.SAVE_PROGRESS]: saveProgress.bind(null, firebaseAction),
    ...existingOptions
  };
  return options;
};
const componentDidMount = ({ updateState, state }, firebaseFunc) => {
  let { agent = "Biola" } = state.context.state;
  function firebaseAction(key, args) {
    return firebaseFunc.loadFireStore().then(() => firebaseFunc[key](...args));
  }
  getWorkingData(firebaseAction, agent, updateState).then(data => {
    updateState({ pending_verifications: data });
  });
};
export default {
  dispatch,
  actions,
  componentDidMount,
  state: {
    pending_verifications: []
  },
  keys: {
    analytics: "tutor_analytics",
    storage: "tutor_working_data"
  }
};
