import { css, jsx } from "@emotion/core";
import { Flex, Text, Heading } from "@rebass/emotion";
import React from "react";
import { DataContext } from "../DataProvider";
import { Route, Switch, Redirect } from "react-router";
import { DialogButton, Button } from "../shared/primitives";
import { DetailHeader, DetailItem } from "./WDetailPage";
import { ListGroup } from "./reusables";

export class PVerificationDetailPage extends React.Component {
  state = {
    data: {},
    payment_method: "Paystack"
  };
  static contextType = DataContext;

  componentDidMount() {
    let { match, history } = this.props;
    let { dispatch, actions } = this.context;
    dispatch({
      type: actions.TRANSACTION_DETAIL,
      value: match.params.order
    }).then(data => {
      this.setState({ data });
    });
  }
  render() {
    let { data, payment_method } = this.state;
    return Object.keys(data).length > 0 ? (
      <Flex flexDirection="column">
        <DetailHeader heading={data.amount} subHeading={`from ${data.name}`}>
          <Button>Confirm Payment</Button>
        </DetailHeader>
        <Flex mb={4} flexDirection="column">
          <ListGroup name="Other Information" />
          <DetailItem label="Email">{data.email}</DetailItem>
          <DetailItem label="order">{data.order}</DetailItem>
          {payment_method && (
            <DetailItem label="Payment Method">
              <strong>{payment_method}</strong>
            </DetailItem>
          )}
        </Flex>
      </Flex>
    ) : null;
  }
}
export default PVerificationDetailPage;
