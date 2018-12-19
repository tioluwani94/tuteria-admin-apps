import {
  testData,
  testDataTransactions,
  hiredData,
  defaultWorkingdata,
  sampleTutorDetailData,
  tutorList,
  getTutorDetail
} from "./test_data";
import { saveFragment } from "tuteria-shared/lib/shared/localStorage";
import { filterHelper } from ".";
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

function getHiredTransactions(props, filterFunc) {
  //props could be dateFilter, searchParam
  if (Object.keys(props).length === 0) {
    return new Promise(resolve => resolve(hiredData));
  }
  return new Promise(resolve =>
    setTimeout(() => {
      resolve(filterHelper(hiredData, props, filterFunc));
    }, 2000)
  );
}

function getTransactionDetail(props) {
  return new Promise(resolve =>
    resolve(hiredData.find(x => x.order.toLowerCase() === props.toLowerCase()))
  );
}


function saveVerifications(verifications) {
  saveFragment({
    VERIFICATIONS: verifications
  });
}

function getTutorVerificationWorkedOn(agent) {
  return new Promise(resolve => resolve(defaultWorkingdata));
}

function getAllUnverifiedTutors({ selection }) {
  let options = {
    new_applicant: x => x.verified === false,
    verified_tutors: x => x.verified === true
  };
  let filterFunc = options[selection];
  let result = filterFunc ? tutorList.filter(filterFunc) : tutorList;
  return new Promise(resolve => resolve(result));
}

function fetchTutorDetail(props) {
  let key = Object.keys(props).find(x => props[x] !== undefined);
  let result = getTutorDetail(key, props[key]);
  return new Promise(resolve => resolve(result));
}

function approveTutor(email, approved = false, verified = false) {
  let newTutor = { ...sampleTutorDetailData, verified: approved };
  return new Promise(resolve => resolve(newTutor));
}

function notifyTutorAboutEmail(email) {
  return new Promise(resolve => resolve());
}

function approveTutorEmail(email) {
  return new Promise(resolve => resolve());
}

function rejectProfilePic(email) {
  return new Promise(resolve => resolve());
}

function approveIdentification(email) {
  return new Promise(resolve => resolve());
}

function rejectIdentification(email) {
  return new Promise(resolve => resolve());
}

function uploadProfilePicEmail(email) {
  return new Promise(resolve => resolve());
}

function uploadVerificationIdEmail(email) {
  return new Promise(resolve => resolve());
}

export default {
  login,
  authenticate,
  //payment data
  getAllWithdrawals,
  getTransactions,
  getBookingTransaction,
  deleteTransaction,
  deleteWithdrawal,
  makePayment,
  getHiredTransactions,
  getTransactionDetail,
  saveVerifications,
  //tutor verification
  getTutorVerificationWorkedOn,
  getAllUnverifiedTutors,
  fetchTutorDetail,
  approveTutor,
  notifyTutorAboutEmail,
  approveTutorEmail,
  rejectProfilePic,
  rejectIdentification,
  approveIdentification,
  uploadProfilePic: uploadProfilePicEmail,
  uploadVerificationId: uploadVerificationIdEmail
};
