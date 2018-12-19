/** @jsx jsx */
import { jsx, css } from "@emotion/core";
import { Flex } from "@rebass/emotion";
import React from "react";
import { DataContext } from "tuteria-shared/lib/shared/DataContext";
import { Button } from "tuteria-shared/lib/shared/primitives";
import { DetailHeader, DetailItem, ListGroup } from "./reusables";
import Modal from "tuteria-shared/lib/shared/primitives/Modal";
import { Input } from "tuteria-shared/lib/shared/LoginPage";
import { getDate } from "tuteria-shared/lib/shared/reusables";

export const Select = ({ options, label, value, onChange }) => {
  return (
    <Flex py={3} flexDirection="column">
      {label && (
        <label
          css={css`
            font-weight: bold;
            padding-bottom: 8px;
          `}
        >
          {label}
        </label>
      )}
      <select
        css={css`
          height: 36px;
          align-self: flex-end;
          margin-bottom: 16px;
          width: 100%;
        `}
        value={value}
        onChange={onChange}
      >
        {options.map(option => (
          <option key={option.label} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </Flex>
  );
};
export class PVerificationDetailPage extends React.Component {
  state = {
    data: {},
    payment_detail: {},
    showModal: false,
    verified_transactions: []
  };
  static contextType = DataContext;

  componentDidMount() {
    let { match } = this.props;
    let { dispatch, actions } = this.context;
    let order = match.params.order;
    dispatch({
      type: actions.TRANSACTION_DETAIL,
      value: order
    }).then(data => {
      this.setState({
        data: data[0],
        verified_transactions: data[1],
        payment_detail: this.getPaymentMethod(order, data[1])
      });
    });
  }
  getPaymentMethod = (order, verified_transactions) => {
    let records = [].concat(...Object.values(verified_transactions));
    return records.find(x => x.order === order) || {};
  };
  updatePaymentDetail = field => {
    return e => {
      this.setState({
        payment_detail: {
          ...this.state.payment_detail,
          [field]: e.target.value
        }
      });
    };
  };
  updateVerification = () => {
    let { payment_detail } = this.state;
    let { dispatch, actions } = this.context;

    return dispatch({
      type: actions.UPDATE_VERIFICATION,
      value: payment_detail
    }).then(() => {
      this.setState({ showModal: false });
      this.props.history.goBack();
    });
  };
  render() {
    let { data, payment_detail, showModal } = this.state;
    return Object.keys(data).length > 0 ? (
      <Flex flexDirection="column">
        <Modal
          action={() => {
            let result = window.confirm(
              "Are you sure you want to approve this payment"
            );
            if (result) {
              this.setState(
                {
                  payment_detail:
                    Object.keys(payment_detail).length > 0
                      ? {
                          amount: data.amount,
                          order: data.order,
                          ...payment_detail
                        }
                      : {
                          method: "",
                          amount: data.amount,
                          order: data.order
                        }
                },
                () => {
                  if (this.state.payment_detail.method) {
                    this.updateVerification();
                  }
                }
              );
            } else {
            }
          }}
          handleCloseModal={() => {
            this.setState({
              showModal: false,
              payment_detail: this.getPaymentMethod(
                data.order,
                this.state.verified_transactions
              )
            });
          }}
          showModal={showModal}
          heading={`Update Payment Information for ${
            data.name
          } lesson booked on ${getDate(data.date)}`}
        >
          <Flex justifyContent="space-between">
            <Select
              label="Payment Method"
              value={payment_detail.method}
              options={[
                { label: "Select Payment Method", value: "" },
                { label: "Paystack", value: "Paystack" },
                { label: "UBA Bank", value: "UBA Bank" },
                { label: "GT Bank", value: "GT Bank" },
                { label: "Zenith Bank", value: "Zenith Bank" }
              ]}
              onChange={this.updatePaymentDetail("method")}
            />
            <Input
              type="number"
              label="Amount Paid"
              value={parseFloat(payment_detail.amount || data.amount)}
              onChange={this.updatePaymentDetail("amount")}
            />
          </Flex>
        </Modal>
        <DetailHeader
          heading={`N${data.amount.toLocaleString()}`}
          subHeading={`from ${data.name}`}
        >
          <Button onClick={() => this.setState({ showModal: true })}>
            {payment_detail.method ? "Update Payment" : "Confirm Payment"}
          </Button>
        </DetailHeader>
        <Flex mb={4} flexDirection="column">
          <ListGroup name="Other Information" />
          <DetailItem label="Email">{data.email}</DetailItem>
          <DetailItem label="order">{data.order}</DetailItem>
          <DetailItem label="Date booked">{getDate(data.date)}</DetailItem>
          {Object.keys(payment_detail).length > 0 && (
            <>
              <ListGroup name="Confirmed Payment Information" />
              <DetailItem label="Payment Mode">
                {payment_detail.method}
              </DetailItem>
              <DetailItem label="Amount">{payment_detail.amount}</DetailItem>
            </>
          )}
        </Flex>
      </Flex>
    ) : null;
  }
}
export default PVerificationDetailPage;
