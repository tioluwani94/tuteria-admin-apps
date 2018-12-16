import {
  testData,
  testDataTransactions,
  hiredData,
  VerifiedTransactions
} from "./test_data";
import { getFragment, saveFragment } from "../localStorage";
let token = "TESTDATATOKEN";
function login(email, password) {
  return new Promise(resolve => resolve(token));
}

function authenticate(token) {
  return new Promise(resolve => resolve(true));
}

function getAllWithdrawals() {
  return new Promise(resolve => resolve(testData()));
}

function getTransactions(withrawalOrder) {
  return new Promise(resolve => resolve(testDataTransactions()));
}
function deleteTransaction(order) {
  return new Promise(resolve => resolve({}));
}
function deleteWithdrawal(order) {
  return new Promise(resolve => resolve());
}
function getBookingTransaction(transactionOrder) {
  return new Promise(resolve =>
    resolve({
      amount: "N2000",
      status: "TUTOR_HIRE",
      date: "2018-10-10 9:20:33",
      order: "AA101"
    })
  );
}
function makePayment(order) {
  return new Promise(resolve => resolve({}));
}
function getHiredTransactions(props) {
  return new Promise(resolve => resolve(hiredData));
}
function getTransactionDetail(props) {
  return new Promise(resolve => resolve(hiredData.find(x => x.order == props)));
}
function loadVerifications() {
  return VerifiedTransactions;
}

function saveVerifications(verfications) {
  saveFragment({ VERIFICATIONS: verifications });
}
export default {
  login,
  authenticate,
  getAllWithdrawals,
  getTransactions,
  getBookingTransaction,
  deleteTransaction,
  deleteWithdrawal,
  makePayment,
  getHiredTransactions,
  getTransactionDetail,
  loadVerifications,
  saveVerifications
};
