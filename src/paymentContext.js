import { format } from "date-fns";
import { testData } from "./adapters/test_data";
import Paystack from "tuteria-shared/lib/shared/adapters/paystack";

const paystack = Paystack(
  "https://paystack-graphql-server.now.sh",
  process.env.PAYSTACK_PUBLIC_KEY
);
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
  UPDATE_VERIFICATION: "UPDATE_VERIFICATION",
  GET_PENDING_VERIFICATIONS: "GET_PENDING_VERIFICATIONS",
  VERIFY_PAYSTACK_TRANSACTION: "VERIFY_PAYSTACK_TRANSACTION",
  GET_PAYSTACK_BALANCE: "GET_PAYSTACK_BALANCE"
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
const verifyPaystackTransaction = (
  firebaseAction,
  { code, order },
  { getAdapter, state, updateState }
) => {
  let {
    pending_verifications,
    verified_transactions,
    withdrawals,
    paystack_balance,
    agent
  } = state.context.state;
  if (!pending_verifications.map(x => x.order).includes(order)) {
    return new Promise(resolve =>
      resolve({ status: true, pending_verifications })
    );
  }
  return paystack.verifyTransfer(code).then(status => {
    if (status) {
      return getAdapter()
        .makePayment(order)
        .then(() => getPaystackBalance(true, { state, updateState }))
        .then(() => {
          let transactions = pending_verifications.filter(
            x => x.order !== order
          );
          updateState({
            withdrawals: withdrawals.filter(x => x.order !== order),
            pending_verifications: transactions
          });
          firebaseAction("saveWorkingData", [
            agent,
            { pending_verifications: transactions, verified_transactions }
          ]);
          return { pending_verifications: transactions, status };
        });
    }
    return { pending_verifications, status };
  });
};
const makePayment = (
  firebaseAction,
  payout,
  { state, getAdapter, updateState }
) => {
  let {
    withdrawals,
    pending_verifications,
    verified_transactions,
    agent
  } = state.context.state;
  return paystack
    .createTransfer(payout)
    .then(code => {
      let new_verifications = [
        ...pending_verifications,
        { order: payout.order, transfer_code: code }
      ];
      updateState({
        withdrawals: withdrawals.map(x =>
          x.order === payout.order ? { ...x, transfer_code: code } : x
        ),
        pending_verifications: new_verifications
      });
      firebaseAction("saveWorkingData", [
        agent,
        { pending_verifications: new_verifications, verified_transactions }
      ]);
      return {
        transfer_code: code,
        pending_verifications: new_verifications
      };
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
const fetchBookingTransaction = ({ order, kind }, { getAdapter }) => {
  return getAdapter().getBookingTransaction({ order, kind });
};

const getWithdrawalTransactions = (withdrawal_order, { getAdapter }) => {
  return getAdapter().getTransactions(withdrawal_order);
};
function getPendingVerifications(firebaseAction, value, state) {
  let { pending_verifications } = state.state.context.state;
  if (pending_verifications.length > 0) {
    return new Promise(resolve => resolve(pending_verifications));
  }
  return fetchVerifiedTransactons(firebaseAction, false, state).then(
    ({ pending_verifications }) => {
      return pending_verifications;
    }
  );
}

const fetchVerifiedTransactons = (
  firebaseAction,
  local = false,
  { updateState, state }
) => {
  let {
    verified_transactions,
    pending_verifications,
    agent = "Biola"
  } = state.context.state;
  if (local) {
    return new Promise(resolve =>
      resolve({ verified_transactions, pending_verifications })
    );
  }
  return firebaseAction("getWorkingData", [
    agent,
    {},
    {
      pending_verifications: [
        { order: "1004", transfer_code: "TRF_up7yj58e9eke7xl" }
      ],
      verified_transactions: {}
    }
  ]).then(data => {
    let result = data.pending_verifications
      ? data
      : {
          verified_transactions: {},
          pending_verifications: []
        };
    updateState(result);
    return result;
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
  if (hired_transactions.length > 0) {
    let record = hired_transactions.find(
      x => x.order.toString().toLowerCase() === order.toLowerCase()
    );
    if (Boolean(record)) {
      return new Promise(resolve => resolve([record, verified_transactions]));
    }
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
    if (verified_transactions[x].includes(order)) {
      result = x;
      index = verified_transactions[x].findIndex(x => x.order === order);
    }
  });
  return { key: result, index };
}
const updateVerification = (firebaseAction, value, { updateState, state }) => {
  let {
    verified_transactions,
    pending_verifications,
    agent = "Biola"
  } = state.context.state;
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
  return firebaseAction("saveWorkingData", [
    agent,
    { verified_transactions: new_transactions, pending_verifications }
  ]);
};
const getPaystackBalance = (load = false, { state, updateState }) => {
  let { paystack_balance = 0 } = state.context.state;
  if (!load) {
    return new Promise(resolve => resolve(paystack_balance));
  }
  return paystack.getBalance().then(amount => {
    updateState({ paystack_balance: amount });
    return amount;
  });
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
    [actions.MAKE_PAYMENT]: makePayment.bind(null, firebaseAction),
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
    [actions.GET_PENDING_VERIFICATIONS]: getPendingVerifications.bind(
      null,
      firebaseAction
    ),
    [actions.VERIFY_PAYSTACK_TRANSACTION]: verifyPaystackTransaction.bind(
      null,
      firebaseAction
    ),
    [actions.GET_PAYSTACK_BALANCE]: getPaystackBalance,
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
  getPaystackBalance(true, { updateState, state });
};
export default {
  dispatch,
  actions,
  componentDidMount,
  state: {
    hired_transactions: [],
    verified_transactions: {},
    pending_verifications: [],
    withdrawals: testData(),
    paystack_balance: 0
  },
  keys: {
    analytics: "payment_analytics",
    storage: "verified_payments"
  }
};
