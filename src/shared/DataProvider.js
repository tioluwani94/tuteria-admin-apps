import React from "react";
import { loadState, saveState } from "./localStorage";
import { DataContext } from "./ProtectedRoute";
import PaymentContext from "./contexts/payment_verification";
import TutorContext from "./contexts/tutor_success";
export { DataContext };
export { ProtectedRoute } from "./ProtectedRoute";

const actions = {
  AUTHENTICATE: "AUTHENTICATE",
  TOKEN_EXIST: "TOKEN_EXIST",
  LOGIN_USER: "LOGIN_USER",
  ...PaymentContext.actions,
  ...TutorContext.actions
};
export class DataProvider extends React.Component {
  dispatch = action => {
    let options = PaymentContext.dispatch(action, {
      [actions.TOKEN_EXIST]: this.tokenExist,
      [actions.AUTHENTICATE]: this.authenticateUser,
      [actions.LOGIN_USER]: this.loginUser
    });
    options = TutorContext.dispatch(action, options);

    if (this.props.test) {
      console.log(action);
    }
    return options[action.type](action.value, this);
  };
  state = {
    context: {
      state: {
        auth: false,
        withdrawals: [],
        hired_transactions: [],
        verified_transactions: {},
        pending_verifications: []
      },
      dispatch: this.dispatch,
      actions
    }
  };
  getAdapter = () => {
    return this.props.adapter;
  };
  componentDidMount() {
    TutorContext.componentDidMount(this);
    // this.updateState({
    //   verified_transactions: this.getAdapter().loadVerifications()
    // });
  }
  updateState = obj => {
    let { context } = this.state;
    this.setState({
      context: { ...context, state: { ...context.state, ...obj } }
    });
  };

  getToken() {
    let data = loadState();
    if (Boolean(data)) {
      return data.token;
    }
    return undefined;
  }
  tokenExist = () => {
    return Boolean(this.getToken());
  };
  authenticateUser = () => {
    let { auth } = this.state.context.state;
    if (auth) {
      return new Promise(resolve => resolve(true));
    }
    return this.props.authenticateUser(this.getToken()).then(data => {
      this.updateState({ auth: data });
      return true;
    });
  };

  loginUser = ({ email, password }) => {
    return this.getAdapter()
      .login(email, password)
      .then(data => {
        saveState({ token: data });
        this.updateState({ auth: true });
      });
  };

  render() {
    return (
      <DataContext.Provider value={this.state.context}>
        {this.props.children}
      </DataContext.Provider>
    );
  }
}

export default DataProvider;
