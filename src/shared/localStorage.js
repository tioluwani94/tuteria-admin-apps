const T_STATE = "TUTERIA_WITHDRAWAL_STATE";
export const loadState = () => {
  try {
    const serializedState = localStorage.getItem(T_STATE);
    if (serializedState === null) {
      return undefined;
    }
    return JSON.parse(serializedState);
  } catch (err) {
    return undefined;
  }
};

export const saveState = state => {
  try {
    const serializedState = JSON.stringify(state);
    localStorage.setItem(T_STATE, serializedState);
  } catch (err) {
    console.log(err);
  }
};

export const clearState = () => {
  try {
    localStorage.removeItem(T_STATE);
  } catch (err) {
    console.log(err);
  }
};

export const getFragment = (key, defaultParams = {}) => {
  let state = loadState() || {};
  return state[key] || defaultParams;
};
export const saveFragment = obj => {
  let state = loadState() || {};
  saveState({ ...state, ...obj });
};
