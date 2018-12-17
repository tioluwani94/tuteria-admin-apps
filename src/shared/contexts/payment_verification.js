export const actions = {
  GET_WITHDRAWALS: "GET_WITHDRAWALS",
  GET_WITHDRAWAL: "GET_WITHDRAWAL",
  MAKE_PAYMENT: "MAKE_PAYMENT",
  GET_BOOKING_TRANSACTION: "GET_BOOKING_TRANSACTION",
  DELETE_TRANSACTION: "DELETE_TRANSACTIONS",
  GET_WITHDRAWAL_TRANSACTIONS: "GET_WITHDRAWAL_TRANSACTIONS",
  GET_HIRED_TRANSACTIONS: "GET_HIRED_TRANSACTIONS",
  TRANSACTION_DETAIL: "TRANSACTION_DETAIL",
  GET_VERIFIED_TRANSACTIONS: "GET_VERIFIED_TRANSACTIONS"
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
const fetchHiredTransactions = (props, { getAdapter, updateState }) => {
  return getAdapter()
    .getHiredTransactions(props)
    .then(data => {
      updateState({ hired_transactions: data });
      return data;
    });
};
const getTransactionDetail = (order, { getAdapter, state }) => {
  let { hired_transactions } = state.context.state;
  let record = hired_transactions.find(x => x.order == order);
  if (Boolean(record)) {
    return new Promise(resolve => resolve(record));
  }
  return getAdapter().getTransactionDetail(order);
};
const deleteTransaction = (order, { getAdapter }) => {
  return getAdapter().deleteTransaction(order);
};
const getAllOrdersForVerifiedTransactions = (value, { state }) => {
  let { verified_transactions } = state.context.state;
  return [].concat(...Object.values(verified_transactions)).map(x => x.order);
};
export function dispatch(action, existingOptions = {}) {
  return {
    [actions.GET_WITHDRAWALS]: fetchWithdrawals,
    [actions.GET_WITHDRAWAL]: getWithdrawalDetail,
    [actions.MAKE_PAYMENT]: makePayment,
    [actions.DELETE_WITHDRAWAL]: deleteWithdrawal,
    [actions.GET_BOOKING_TRANSACTION]: fetchBookingTransaction,
    [actions.DELETE_TRANSACTION]: deleteTransaction,
    [actions.GET_WITHDRAWAL_TRANSACTIONS]: getWithdrawalTransactions,
    [actions.GET_HIRED_TRANSACTIONS]: fetchHiredTransactions,
    [actions.TRANSACTION_DETAIL]: getTransactionDetail,
    [actions.GET_VERIFIED_TRANSACTIONS]: getAllOrdersForVerifiedTransactions,
    ...existingOptions
  };
}

export default {
  dispatch,
  actions
};
