import paymentContext from "./paymentContext";
import appContext from "./appContext";

const actions = {
  ...paymentContext.actions,
  ...appContext.actions
};

const dispatch = (action, existingOptions = {}, firebaseFunc) => {
  let options = {
    ...paymentContext.dispatch(action, existingOptions, firebaseFunc),
    ...appContext.dispatch(action, existingOptions, firebaseFunc),
    ...existingOptions
  };
  return options;
};
const componentDidMount = (
  { updateState, state, getAdapter },
  firebaseFunc
) => {
  paymentContext.componentDidMount(
    { updateState, state, getAdapter },
    firebaseFunc
  );
  // appContext.componentDidMount(
  //   { updateState, state, getAdapter },
  //   firebaseFunc
  // );
};
export default {
  dispatch,
  actions,
  componentDidMount,
  state: {
    ...paymentContext.state,
    ...appContext.state
  },
  keys: paymentContext.keys
};
