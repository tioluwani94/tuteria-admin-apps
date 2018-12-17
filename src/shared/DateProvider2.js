import React from "react";
import { HomePageSpinner } from "./primitives/Spinner";
import { loadState, saveState } from "./localStorage";
import { DataContext } from "./ProtectedRoute";
export { DataContext };
export { ProtectedRoute } from "./ProtectedRoute";

const actions = {
  GET_WITHDRAWALS: "GET_WITHDRAWALS",
  GET_WITHDRAWAL: "GET_WITHDRAWAL",
  MAKE_PAYMENT: "MAKE_PAYMENT",
  GET_BOOKING_TRANSACTION: "GET_BOOKING_TRANSACTION",
  DELETE_TRANSACTION: "DELETE_TRANSACTIONS",
  GET_WITHDRAWAL_TRANSACTIONS: "GET_WITHDRAWAL_TRANSACTIONS",
  AUTHENTICATE: "AUTHENTICATE",
  TOKEN_EXIST: "TOKEN_EXIST",
  LOGIN_USER: "LOGIN_USER",
  GET_HIRED_TRANSACTIONS: "GET_HIRED_TRANSACTIONS",
  TRANSACTION_DETAIL: "TRANSACTION_DETAIL",
  GET_VERIFIED_TRANSACTIONS: "GET_VERIFIED_TRANSACTIONS"
};
export class DataProvider extends React.Component {
  dispatch = action => {
    let options = {
      [actions.GET_WITHDRAWALS]: this.fetchWithdrawals,
      [actions.GET_WITHDRAWAL]: this.getWithdrawalDetail,
      [actions.MAKE_PAYMENT]: this.makePayment,
      [actions.DELETE_WITHDRAWAL]: this.deleteWithdrawal,
      [actions.GET_BOOKING_TRANSACTION]: this.fetchBookingTransaction,
      [actions.DELETE_TRANSACTION]: this.deleteTransaction,
      [actions.GET_WITHDRAWAL_TRANSACTIONS]: this.getWithdrawalTransactions,
      [actions.TOKEN_EXIST]: this.tokenExist,
      [actions.AUTHENTICATE]: this.authenticateUser,
      [actions.LOGIN_USER]: this.loginUser,
      [actions.GET_HIRED_TRANSACTIONS]: this.fetchHiredTransactions,
      [actions.TRANSACTION_DETAIL]: this.getTransactionDetail,
      [actions.GET_VERIFIED_TRANSACTIONS]: this
        .getAllOrdersForVerifiedTransactions
    };
    if (this.props.test) {
      console.log(action);
    }
    return options[action.type](action.value);
  };
  state = {
    context: {
      state: {
        auth: false,
        withdrawals: [],
        hired_transactions: [],
        verified_transactions: {}
      },
      dispatch: this.dispatch,
      actions
    }
  };
  getAdapter() {
    return this.props.adapter;
  }
  componentDidMount() {
    this.updateState({
      verified_transactions: this.getAdapter().loadVerifications()
    });
  }
  saveVerifiedTransactions = () => {
    let { verified_transactions } = this.state.context.state;
    return this.getAdapter().saveVerifications(verifications);
  };
  updateState = obj => {
    let { context } = this.state;
    this.setState({
      context: { ...context, state: { ...context.state, ...obj } }
    });
  };
  fetchWithdrawals = refresh => {
    let { withdrawals } = this.state.context.state;
    if (!Boolean(refresh) && withdrawals.length > 0) {
      return new Promise(resolve => resolve(withdrawals));
    }
    return this.getAdapter()
      .getAllWithdrawals()
      .then(data => {
        this.updateState({ withdrawals: data });
        return data;
      })
      .catch(err => {
        throw err;
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
  makePayment = order => {
    let { withdrawals } = this.state.context.state;
    return this.getAdapter()
      .makePayment(order)
      .then(() => {
        this.updateState({
          withdrawals: withdrawals.filter(x => x.order !== order)
        });
      })
      .catch(error => {
        throw error;
      });
  };
  deleteWithdrawal = order => {
    let { withdrawals } = this.state.context.state;
    return this.getAdapter()
      .deleteWithdrawal(order)
      .then(data => {
        this.updateState({
          withdrawals: withdrawals.filter(x => x.order !== order)
        });
      });
  };
  getWithdrawalDetail = order => {
    return this.state.context.state.withdrawals.find(x => x.order === order);
  };
  fetchBookingTransaction = booking_order => {
    return this.getAdapter().getBookingTransaction(booking_order);
  };
  loginUser = ({ email, password }) => {
    return this.getAdapter()
      .login(email, password)
      .then(data => {
        saveState({ token: data });
        this.updateState({ auth: true });
      });
  };
  getWithdrawalTransactions = withdrawal_order => {
    return this.getAdapter().getTransactions(withdrawal_order);
  };
  fetchHiredTransactions = props => {
    return this.getAdapter()
      .getHiredTransactions(props)
      .then(data => {
        this.updateState({ hired_transactions: data });
        return data;
      });
  };
  getTransactionDetail = order => {
    let { hired_transactions } = this.state.context.state;
    let record = hired_transactions.find(x => x.order == order);
    if (Boolean(record)) {
      return new Promise(resolve => resolve(record));
    }
    return this.getAdapter().getTransactionDetail(order);
  };
  deleteTransaction = order => {
    return this.getAdapter().deleteTransaction(order);
  };
  getAllOrdersForVerifiedTransactions = () => {
    let { verified_transactions } = this.state.context.state;
    return [].concat(...Object.values(verified_transactions)).map(x => x.order);
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
