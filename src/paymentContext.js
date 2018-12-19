import { format } from "date-fns";

export const actions = {
  GET_WITHDRAWALS: "GET_WITHDRAWALS",
  GET_WITHDRAWAL: "GET_WITHDRAWAL",
  MAKE_PAYMENT: "MAKE_PAYMENT",
  GET_BOOKING_TRANSACTION: "GET_BOOKING_TRANSACTION",
  DELETE_TRANSACTION: "DELETE_TRANSACTIONS",
  GET_WITHDRAWAL_TRANSACTIONS: "GET_WITHDRAWAL_TRANSACTIONS",
  GET_HIRED_TRANSACTIONS: "GET_HIRED_TRANSACTIONS",
  TRANSACTION_DETAIL: "TRANSACTION_DETAIL",
  GET_VERIFIED_TRANSACTIONS: "GET_VERIFIED_TRANSACTIONS",
  UPDATE_VERIFICATION: "UPDATE_VERIFICATION"
};
const fetchWithdrawals = (refresh, { state, getAdapter, updateState }) => {
  let { withdrawals } = state.context.state;
  if (!Boolean(refresh) && withdrawals.length > 0) {
    return new Promise(resolve => resolve(withdrawals));
  }
  return getAdapter()
    .getAllWithdrawals()
    .then(data => {
      updateState({ withdrawals: data });
      return data;
    })
    .catch(err => {
      throw err;
    });
};

const getWithdrawalDetail = (order, { state }) => {
  return state.context.state.withdrawals.find(x => x.order === order);
};
const makePayment = (order, { state, getAdapter, updateState }) => {
  let { withdrawals } = state.context.state;
  return getAdapter()
    .makePayment(order)
    .then(() => {
      updateState({
        withdrawals: withdrawals.filter(x => x.order !== order)
      });
    })
    .catch(error => {
      throw error;
    });
};

const deleteWithdrawal = (order, { state, updateState, getAdapter }) => {
  let { withdrawals } = state.context.state;
  return getAdapter()
    .deleteWithdrawal(order)
    .then(data => {
      updateState({
        withdrawals: withdrawals.filter(x => x.order !== order)
      });
    });
};
const fetchBookingTransaction = (booking_order, { getAdapter }) => {
  return getAdapter().getBookingTransaction(booking_order);
};

const getWithdrawalTransactions = (withdrawal_order, { getAdapter }) => {
  return getAdapter().getTransactions(withdrawal_order);
};
const fetchVerifiedTransactons = (
  firebaseAction,
  local = false,
  { updateState, state }
) => {
  let { verified_transactions, agent = "Biola" } = state.context.state;
  if (Object.keys(verified_transactions).length > 0) {
    return new Promise(resolve => resolve(verified_transactions));
  }
  return firebaseAction("getWorkingData", [agent, {}]).then(data => {
    updateState({
      verified_transactions: data
    });
    return data;
  });
};
function findTransaction(verified_transactions, boolean = true) {
  return order => {
    let records = []
      .concat(...Object.values(verified_transactions))
      .map(x => (boolean ? x.order : x));
    return boolean
      ? records.includes(order)
      : records.find(x => x.order === order);
  };
}
const fetchHiredTransactions = (
  firebaseAction,
  { refresh, ...rest },
  { getAdapter, updateState, state }
) => {
  let { hired_transactions, verified_transactions = {} } = state.context.state;
  if (!Boolean(refresh)) {
    return new Promise(resolve =>
      resolve([hired_transactions, verified_transactions])
    );
  }
  const transactionVerified = findTransaction(verified_transactions);
  return Promise.all([
    getAdapter().getHiredTransactions(rest, transactionVerified),
    fetchVerifiedTransactons(firebaseAction, true, {
      updateState,
      state
    })
  ]).then(data => {
    console.log(data);
    updateState({ hired_transactions: data[0] });
    return data;
  });
};
const getTransactionDetail = (
  firebaseAction,
  order,
  { getAdapter, state, updateState }
) => {
  let { hired_transactions, verified_transactions } = state.context.state;
  let record = hired_transactions.find(
    x => x.order.toLowerCase() === order.toLowerCase()
  );
  if (Boolean(record)) {
    return new Promise(resolve => resolve([record, verified_transactions]));
  }
  return Promise.all([
    getAdapter().getTransactionDetail(order),
    fetchVerifiedTransactons(firebaseAction, true, {
      getAdapter,
      updateState,
      state
    })
  ]);
};
const deleteTransaction = (order, { getAdapter }) => {
  return getAdapter().deleteTransaction(order);
};
function getVerificationTransactionDate(verified_transactions, order) {
  let result = undefined;
  let index = undefined;
  Object.keys(verified_transactions).forEach(x => {
    if (verified_transactions[x].map(x => x.order).includes(order)) {
      result = x;
      index = verified_transactions[x].findIndex(x => x.order === order);
    }
  });
  return { key: result, index };
}
const updateVerification = (firebaseAction, value, { updateState, state }) => {
  let { verified_transactions, agent = "Biola" } = state.context.state;
  let new_transactions = { ...verified_transactions };
  let instance = findTransaction(new_transactions, false)(value.order);
  let { key, index } = getVerificationTransactionDate(
    verified_transactions,
    value.order
  );
  if (instance) {
    if (instance.method !== value.method) {
      new_transactions = {
        ...new_transactions,
        [key]: new_transactions[key].map((x, i) => {
          if (i === index) {
            return value;
          }
          return x;
        })
      };
    }
  } else {
    if (!Boolean(key)) {
      key = format(new Date(), "YYYY-MM-DD");
    }
    let existingRecordInKey = new_transactions[key] || [];
    new_transactions[key] = [...existingRecordInKey, value];
  }
  updateState({ verified_transactions: new_transactions });
  return firebaseAction("saveWorkingData", [agent, new_transactions]);
};
const dispatch = (action, existingOptions = {}, firebaseFunc) => {
  function firebaseAction(key, args) {
    // return new Promise(resolve => resolve({}));
    // return firebaseFunc[key](...args);
    return firebaseFunc.loadFireStore().then(() => firebaseFunc[key](...args));
  }
  let options = {
    [actions.GET_WITHDRAWALS]: fetchWithdrawals,
    [actions.GET_WITHDRAWAL]: getWithdrawalDetail,
    [actions.MAKE_PAYMENT]: makePayment,
    [actions.DELETE_WITHDRAWAL]: deleteWithdrawal,
    [actions.GET_BOOKING_TRANSACTION]: fetchBookingTransaction,
    [actions.DELETE_TRANSACTION]: deleteTransaction,
    [actions.GET_WITHDRAWAL_TRANSACTIONS]: getWithdrawalTransactions,
    [actions.GET_HIRED_TRANSACTIONS]: fetchHiredTransactions.bind(
      null,
      firebaseAction
    ),
    [actions.TRANSACTION_DETAIL]: getTransactionDetail.bind(
      null,
      firebaseAction
    ),
    [actions.UPDATE_VERIFICATION]: updateVerification.bind(
      null,
      firebaseAction
    ),
    ...existingOptions
  };
  return options;
};
const componentDidMount = (
  { updateState, state, getAdapter },
  firebaseFunc
) => {
  function firebaseAction(key, args) {
    return firebaseFunc[key](...args);
  }
  fetchVerifiedTransactons(firebaseAction, true, {
    getAdapter,
    updateState,
    state
  });
};
export default {
  dispatch,
  actions,
  componentDidMount,
  state: {
    hired_transactions: [],
    verified_transactions: {},
    withdrawals: []
  },
  keys: {
    analytics: "payment_analytics",
    storage: "verified_payments"
  }
};
