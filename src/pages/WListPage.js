/** @jsx jsx */
import { css, jsx } from "@emotion/core";
import { Flex, Button, Text } from "@rebass/emotion";
import React from "react";
import { DataContext } from "tuteria-shared/lib/shared/DataContext";
import {
  ListGroup,
  ListItem,
  getTime,
  SectionListPage,
  Link
} from "./reusables";

import { SpinnerContainer } from "tuteria-shared/lib/shared/primitives/Spinner";
import { DateFilter } from "tuteria-shared/lib/shared/DateFilter";
import { parseQuery } from "tuteria-shared/lib/shared/utils";
export { ListGroup, ListItem };

export class WListPage extends React.Component {
  static contextType = DataContext;
  constructor(props) {
    super(props);
    let {
      location: { search }
    } = this.props;
    let { status = "new" } = parseQuery(search);

    this.state = {
      data: [],
      pending_verification: [],
      filter: status || "",
      loading: false,
      in_paystack: 0
    };
  }
  componentDidMount() {
    let { dispatch, actions } = this.context;

    dispatch({ type: actions.GET_PENDING_VERIFICATIONS }).then(data => {
      this.setState({ pending_verification: data });
      this.fetchList();
    });
  }

  fetchList = (refresh = false) => {
    let { dispatch, actions } = this.context;
    this.setState({ loading: true });
    dispatch({ type: actions.GET_WITHDRAWALS, value: refresh }).then(data => {
      this.setState({ data, loading: false });
    });
    dispatch({ type: actions.GET_PAYSTACK_BALANCE, value: true }).then(
      amount => {
        this.setState({ in_paystack: amount });
      }
    );
  };
  filteredResults = () => {
    let { filter, pending_verification, data } = this.state;
    const filterCallback = w => {
      if (!filter) {
        return w;
      }
      return filter === "pending"
        ? pending_verification.map(x => x.order).includes(w.order)
        : !pending_verification.map(x => x.order).includes(w.order);
    };
    const transactionFunc = x => {
      let rr = pending_verification.find(
        o => o.order.toString() === x.order.toString()
      );
      if (rr) {
        return { ...x, transfer_code: rr.transfer_code };
      }
      return x;
    };
    return data.filter(filterCallback).map(transactionFunc);
  };
  refreshList = () => {
    this.fetchList(true);
  };
  totalAmountToPay = () => {
    return this.state.data.map(x => x.amount).reduce((a, b) => a + b, 0);
  };
  paystackBalance = () => {
    return this.context.state.paystack_balance;
  };
  onFilterChange = e => {
    this.setState({ filter: e.target.value });
  };
  render() {
    return (
      <Flex flexDirection="column">
        <Flex flexDirection="row-reverse" pr={2} pb={3} width={1}>
          <Button
            css={css`
              :active {
                opacity: 0.7;
              }
              :hover {
                cursor: pointer;
              }
            `}
            onClick={this.refreshList}
          >
            Refresh
          </Button>
          <DateFilter
            filterOptions={[
              { value: "", label: "Select Filter" },
              {
                value: "pending",
                label: "Awaiting Verification from paystack"
              },
              { value: "new", label: "Fresh Withdrawals" }
            ]}
            onFilterChange={this.onFilterChange}
            selection={this.state.filter}
          />
          <Flex
            justifyContent="space-around"
            css={css`
              flex: 2;
            `}
          >
            <Text fontSize={25}>
              Paystack Balance: {this.paystackBalance().toLocaleString()}
            </Text>
            <Text fontSize={25}>
              Total amount to pay: {this.totalAmountToPay().toLocaleString()}
            </Text>
          </Flex>
        </Flex>
        <SpinnerContainer condition={this.state.loading}>
          {this.state.data.length > 0 ? (
            <SectionListPage
              data={this.filteredResults()}
              LinkComponent={Link}
              callback={withdrawal => ({
                heading: `N${withdrawal.amount}`,
                subHeading: withdrawal.email,
                rightSection: getTime(withdrawal.date),
                verified: this.state.pending_verification
                  .map(x => x.order)
                  .includes(withdrawal.order),
                to: this.props.detailPageUrl(withdrawal.order)
              })}
            />
          ) : (
            <Flex
              css={css`
                align-items: center;
              `}
              flexDirection="column"
            >
              <Text fontSize={5}>
                Hit the refresh button to try again or check your network
              </Text>
            </Flex>
          )}
        </SpinnerContainer>
      </Flex>
    );
  }
}

export default WListPage;
