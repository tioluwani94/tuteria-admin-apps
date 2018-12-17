import { getFragment, saveFragment } from "../localStorage";
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
  APPROVE_PROFILE_PIC: "APPROVE_PROFILE_PIC"
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
  EMAIL_VERIFY: "EMAIL_VERIFY"
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
function getWorkingDataRecords(value, { getAdapter, updateState, state }) {
  let { pending_verifications } = state.context.state;
  if (pending_verifications.length > 0) {
    return new Promise(resolve => resolve(pending_verifications));
  }
  return getAdapter()
    .getTutorVerificationWorkedOn()
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
function approveTutor(email, { getAdapter, state, updateState }) {
  let { agent = "Biola", pending_verifications } = state.context.state;
  let wk = pending_verifications.filter(x => x.email !== email);
  return getAdapter()
    .approveTutor(email, true)
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
      console.log(data);
      return data.find(x => x.email === email);
    });
}
function approveProfilePic(email, { state, updateState }) {
  let data = removeFromWorkingDirectory(
    email,
    state,
    workingActions.PROFILE_VERIFICATION
  );
  console.log(data);
  updateState({ pending_verifications: data });
  return new Promise(resolve => resolve(data.find(x => x.email === email)));
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
      console.log(data);
      updateAnalytics(analytics.EMAIL_VERIFY, agent);
      return data.find(x => x.email === email);
    });
}
const dispatch = (action, existingOptions = {}) => {
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
    ...existingOptions
  };
};
export default {
  dispatch,
  actions
};
