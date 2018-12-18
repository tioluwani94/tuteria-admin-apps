/** @jsx jsx */
import { css, jsx } from "@emotion/core";
import { Flex, Text, Heading } from "@rebass/emotion";
import React from "react";
import { DataContext } from "tuteria-shared/lib/shared/DataContext";
import { Route, Switch, Redirect } from "react-router";
import { DialogButton } from "tuteria-shared/lib/shared/primitives";

import { ListGroup, ListItem, getDate, DetailItem } from "./reusables";
export { DetailItem };
export const DetailHeader = ({ heading, subHeading, children }) => {
  return (
    <Flex
      mb={4}
      flexDirection="column"
      css={css`
        align-items: center;
      `}
    >
      <Heading fontSize={5}>{heading}</Heading>
      <Text>{subHeading}</Text>
      {children}
    </Flex>
  );
};
function getDuration(start, end) {
  return `${getDate(start, true)} - ${getDate(end, true)}`;
}
class TransactionDetail extends React.Component {
  state = {
    confirm: false
  };
  componentDidMount() {
    this.props.getBookingTransaction();
  }
  deleteTransaction = () => {
    this.setState({ confirm: false });
  };
  render() {
    let { detail, booking_transaction } = this.props;
    return (
      <Flex flexDirection="column">
        <Flex
          mb={4}
          flexDirection="column"
          css={css`
            align-items: center;
          `}
        >
          <Heading fontSize={5}>{detail.amount}</Heading>
          <DialogButton
            dialogText="Are you sure you want to delete this transaction"
            confirmAction={() => this.props.deleteTransaction(detail.order)}
            my={2}
            width={400}
            disabled={this.props.loading}
            children="Delete Transaction"
          />
          <Text>{detail.status}</Text>
        </Flex>
        <Flex mb={4} flexDirection="column">
          <ListGroup name="Transaction Details" />
          <DetailItem label="Client Email">{detail.client_email}</DetailItem>
          <DetailItem label="Tutor email">{detail.tutor_email}</DetailItem>
          <DetailItem label="Duration">
            {getDuration(detail.booking.start_time, detail.booking.end_time)}
          </DetailItem>
          <DetailItem label="Made Payment">{detail.made_payment}</DetailItem>
          <DetailItem label="Booking Status">
            {detail.booking.status}
          </DetailItem>
        </Flex>
        <Flex mb={4} flexDirection="column">
          <ListGroup name="Booking Transaction" />
          {booking_transaction &&
            Object.keys(booking_transaction).length > 0 && (
              <ListItem
                heading={booking_transaction.amount}
                subHeading={booking_transaction.status}
                rightSection={getDate(booking_transaction.date)}
              />
            )}
        </Flex>
      </Flex>
    );
  }
}
class TransactionList extends React.Component {
  toDetailPage = (order, status, condition = "EARNING") => {
    let {
      match: { params }
    } = this.props;
    if (status === condition) {
      this.props.goToTransactionDetail(params.order, order);
    }
  };
  render() {
    let { transactions = [] } = this.props;
    return (
      <>
        <ListGroup name="Transactions" />
        {transactions.map((transaction, index) => {
          return (
            <ListItem
              key={transaction.order}
              onClick={() => {
                this.toDetailPage(transaction.order, transaction.status);
              }}
              heading={transaction.amount}
              subHeading={transaction.status}
              rightSection={getDate(transaction.date)}
            />
          );
        })}
      </>
    );
  }
}
export class WDetailPage extends React.Component {
  static contextType = DataContext;
  state = {
    data: {},
    loading: false,
    booking_transaction: {},
    transactions: this.props.transactions || []
  };
  componentDidMount() {
    let { match, history } = this.props;
    let { dispatch, actions } = this.context;
    let result = dispatch({
      type: actions.GET_WITHDRAWAL,
      value: match.params.order
    });
    dispatch({
      type: actions.GET_WITHDRAWAL_TRANSACTIONS,
      value: match.params.order
    }).then(data => {
      this.setState({ transactions: data });
    });
    if (this.props.getWithdrawal) {
      this.setState({ data: this.props.getWithdrawal(match.params.order) });
    } else {
      if (Boolean(result)) {
        this.setState({ data: result });
      } else {
        history.push("/withdrawals");
      }
      //should only happen in test scenarios
    }
  }
  makePayment = () => {
    let { match, history } = this.props;
    let { dispatch, actions } = this.context;
    this.setState({ loading: true });
    dispatch({ type: actions.MAKE_PAYMENT, value: match.params.order })
      .then(() => {
        history.push("/withdrawals");
      })
      .catch(error => {
        this.setState({ loading: false });
      });
  };
  deleteTransaction = order => {
    let { dispatch, actions } = this.context;
    let { match, history } = this.props;
    this.setState({ loading: true });
    dispatch({ type: actions.DELETE_TRANSACTION, value: order })
      .then(() => {
        history.push(`/withdrawals/${match.order}/transactions`);
        this.setState({
          transactions: this.state.transactions.filter(x => x.order !== order),
          loading: false
        });
      })
      .catch(error => {
        this.setState({ loading: false });
      });
  };
  deleteWithdrawal = () => {
    let { match, history } = this.props;
    let { dispatch, actions } = this.context;
    this.setState({ loading: true });
    dispatch({ type: actions.DELETE_WITHDRAWAL, value: match.params.order })
      .then(() => {
        history.push("/withdrawals");
      })
      .catch(error => {
        this.setState({ loading: false });
      });
  };
  getBookingTransaction = booking_order => {
    let { dispatch, actions } = this.context;
    this.setState({ booking_transaction: {} });
    dispatch({
      type: actions.GET_BOOKING_TRANSACTION,
      value: booking_order
    })
      .then(data => {
        this.setState({ booking_transaction: data });
      })
      .catch(error => {});
  };
  getTransactionDetail = transaction_id => {
    return this.state.transactions.find(x => x.order === transaction_id);
  };
  goToTransactionDetail = (withdrawal_id, transaction_id) => {
    let {  history } = this.props;
    let record = this.getTransactionDetail(transaction_id);
    this.getBookingTransaction(record.booking.order);
    history.push(
      `/withdrawals/${withdrawal_id}/transactions/${transaction_id}`
    );
  };
  render() {
    let { data } = this.state;
    // let {
    //   match: {
    //     params: { order }
    //   }
    // } = this.props;
    return (
      <Flex flexDirection="column">
        <DetailHeader heading={data.amount} subHeading={`to ${data.email}`}>
          <DialogButton
            dialogText="Proceed with tutor payment? "
            confirmAction={this.makePayment}
            disabled={this.state.loading}
            my={2}
            width={400}
            children="Pay tutor"
          />
        </DetailHeader>
        <Flex mb={4} flexDirection="column">
          <ListGroup name="Details" />
          {Object.keys(data).length > 0 && (
            <>
              <DetailItem label="Account Number">{data.account_no}</DetailItem>
              <DetailItem label="Bank Name">{data.bank}</DetailItem>
              <DetailItem label="Account Name">{data.account_name}</DetailItem>
              <DetailItem label="Phone Number">{data.phone_no}</DetailItem>
              <DetailItem label="Amount in Wallet">
                {data.wallet_amount}
              </DetailItem>
            </>
          )}
        </Flex>
        <Flex mb={4} flexDirection="column">
          <Switch>
            <Route
              path={`/withdrawals/:order/transactions`}
              exact
              render={props => (
                <TransactionList
                  transactions={this.state.transactions}
                  goToTransactionDetail={this.goToTransactionDetail}
                  {...props}
                />
              )}
            />
            <Route
              path={`/withdrawals/:order/transactions/:transaction_id`}
              exact
              render={props => {
                let detail = this.getTransactionDetail(
                  props.match.params.transaction_id
                );
                if (detail) {
                  return (
                    <TransactionDetail
                      detail={detail}
                      booking_transaction={this.state.booking_transaction}
                      deleteTransaction={this.deleteTransaction}
                      getBookingTransaction={() =>
                        this.getBookingTransaction(
                          props.match.params.transaction_id
                        )
                      }
                      loading={this.state.loading}
                      {...props}
                    />
                  );
                }
                return (
                  <Redirect
                    to={`/withdrawals/${props.match.params.order}/transactions`}
                  />
                );
              }}
            />
          </Switch>
        </Flex>
        <DialogButton
          dialogText="Are you sure you want to delete this withdrawal? "
          confirmAction={this.deleteWithdrawal}
          disabled={this.state.loading}
          children="Delete Withdrawal"
        />
      </Flex>
    );
  }
}

export default WDetailPage;
