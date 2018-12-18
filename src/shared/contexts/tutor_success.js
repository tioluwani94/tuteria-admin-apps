import { getFragment, saveFragment } from "../localStorage";
import format from "date-fns/format";
import FireBase2 from "../adapters/backupFirebase"
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
function updateAnalytics(type, agent) {
  let date = format(new Date(), "D/MM/YYYY");
  let analyticsData = getFragment("ANALYTICS", {});
  let agentData = analyticsData[agent] || {};
  let currentInstance = agentData[date] || {};
  let oldInstance = currentInstance[type] || 0;
  agentData = { [date]: { ...currentInstance, [type]: (oldInstance += 1) } };
  analyticsData = { ...analyticsData, [agent]: agentData };
  saveFragment({ ANALYTICS: analyticsData });
}
function getWorkingData(agent, updateState, remote = false) {
  let record = getFragment("WORKING_DATA", {});
  let agentData = record[agent] || [];
  if (remote) {
    firebaseAction("getWorkingData", [agent]).then(data => {
      updateState({ pending_verifications: data });
      saveWorkingData(agent, data);
    });
  }
  return new Promise(resolve => {
    resolve(agentData);
  });
}
export function autoSave(state, timeout = 10, interval = false) {
  let { pending_verifications, agent = "Biola" } = state.context.state;
  let analyticsData = getFragment("ANALYTICS", {});
  let agentData = analyticsData[agent] || {};
  const saveFunc = () => {
    saveFragment(agent, pending_verifications, true);
    saveWorkingData(agent, pending_verifications, true);
    firebaseAction("saveAnalytics", [agent, agentData]);
    console.log("Saved to firebase", { agentData, pending_verifications });
  };
  // if (interval) {
  //   setInterval(saveFunc, timeout * 1000 * 60);
  // } else {
    saveFunc();
  // }
}
function saveWorkingData(agent, data, remote = false) {
  let record = getFragment("WORKING_DATA", {});
  let agentData = record[agent] || {};
  record = { ...record, [agent]: { ...agentData, ...data } };
  saveFragment({ WORKING_DATA: record });
  if (remote) {
    firebaseAction("saveWorkingData", [agent, data]);
  }
}
function getWorkingDataRecords(value, { getAdapter, updateState, state }) {
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
function fetchTutorDetail(props, { getAdapter, state, updateState }) {
  return Promise.all([
    getWorkingDataRecords(null, { getAdapter, state, updateState }),
    getAdapter().fetchTutorDetail(props)
  ]).then(data => {
    let record = data[0].find(x => x.email === props.email);
    return {
      record,
      data: data[1]
    };
  });
}
const getUnverifiedTutors = (params, { getAdapter, state, updateState }) => {
  return Promise.all([
    getWorkingDataRecords(null, { getAdapter, state, updateState }),
    getAdapter().getAllUnverifiedTutors(params)
  ]).then(data => {
    let emailsOnly = data[0].map(x => x.email);
    return data[1].filter(x => !emailsOnly.includes(x.email));
  });
};
function approveTutor(
  { email, verified = false },
  { getAdapter, state, updateState }
) {
  let { agent = "Biola", pending_verifications } = state.context.state;
  let wk = pending_verifications.filter(x => x.email !== email);
  return getAdapter()
    .approveTutor(email, true, verified)
    .then(data => {
      updateAnalytics(analytics.TUTOR_APPROVAL, agent);
      updateState({ pending_verifications: wk });
      return data;
    });
}
function denyTutor(email, { getAdapter, state }) {
  let { agent = "Biola" } = state.context.state;
  return getAdapter()
    .approveTutor(email, false)
    .then(data => {
      updateAnalytics(analytics.DENY_TUTOR, agent);
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
      updateState({ pending_verifications: data });
      return data.find(x => x.email === email);
    });
}
function approveProfilePic(email, { state, updateState }) {
  let data = removeFromWorkingDirectory(
    email,
    state,
    workingActions.PROFILE_VERIFICATION
  );
  updateState({ pending_verifications: data });
  return new Promise(resolve => resolve(data.find(x => x.email === email)));
}
function uploadProfilePic(
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
      updateState({ pending_verifications: data });
      updateAnalytics(analytics.UPLOAD_PROFILE_PIC, agent);
      return data.find(x => x.email === email);
    });
}
function rejectProfilePic(
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
      updateState({ pending_verifications: data });
      updateAnalytics(analytics.PROFILE_PICTURE, agent);
      return data.find(x => x.email === email);
    });
}
function approveIdentification(email, { getAdapter, state, updateState }) {
  let { agent = "Biola" } = state.context.state;
  let data = removeFromWorkingDirectory(
    email,
    state,
    workingActions.ID_VERIFICATION
  );
  return getAdapter()
    .approveIdentification(email)
    .then(() => {
      updateState({ pending_verifications: data });
      updateAnalytics(analytics.ID_APPROVAL, agent);
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
      updateState({ pending_verifications: data });
      updateAnalytics(analytics.UPLOAD_ID, agent);
      return data.find(x => x.email === email);
    });
}
function rejectIdentification(
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
      updateState({ pending_verifications: data });
      updateAnalytics(analytics.ID_REJECTION, agent);
      return data.find(x => x.email === email);
    });
}
function saveProgress(value, { state, agent, updateState }) {
  autoSave(state);
}
function approveTutorEmail(email, { getAdapter, state, updateState }) {
  let { agent = "Biola" } = state.context.state;
  let data = removeFromWorkingDirectory(
    email,
    state,
    workingActions.EMAIL_VERIFICATION
  );
  return getAdapter()
    .approveTutorEmail(email)
    .then(() => {
      updateState({ pending_verifications: data });
      updateAnalytics(analytics.EMAIL_VERIFY, agent);
      return data.find(x => x.email === email);
    });
}
function firebaseAction(key, args) {
  return FireBase2[key](...args)
  return import("../adapters/backupFirebase.js").then(module => {
    let func = module.default[key];
    return func(...args);
  });
}
const dispatch = (action, existingOptions = {}) => {
  // firebaseAction("getAnalytics", ["Abiola"]).then(data => {
  //   console.log(data);
  // });
  return {
    [actions.FETCH_TUTOR_WORKING_DATA]: getWorkingDataRecords,
    [actions.GET_UNVERIFIED_TUTORS]: getUnverifiedTutors,
    [actions.TUTOR_INFO]: fetchTutorDetail,
    [actions.APPROVE_TUTOR]: approveTutor,
    [actions.DENY_TUTOR]: denyTutor,
    [actions.NOTIFY_TUTOR_ABOUT_EMAIL]: notifyTutorAboutEmail,
    [actions.APPROVE_TUTOR_EMAIL]: approveTutorEmail,
    [actions.REJECT_PROFILE_PIC]: rejectProfilePic,
    [actions.APPROVE_ID]: approveIdentification,
    [actions.REJECT_ID]: rejectIdentification,
    [actions.APPROVE_PROFILE_PIC]: approveProfilePic,
    [actions.UPLOAD_PROFILE_PIC]: uploadProfilePic,
    [actions.UPLOAD_ID]: uploadVerificationId,
    [actions.SAVE_PROGRESS]: saveProgress,
    ...existingOptions
  };
};
const componentDidMount = ({ updateState, state }) => {
  let { agent = "Biola" } = state.context.state;
  getWorkingData(agent, updateState, true).then(data => {
    updateState({ pending_verifications: data });
  });
  autoSave(state, 5, true);
};
export default {
  dispatch,
  actions,
  componentDidMount
};
