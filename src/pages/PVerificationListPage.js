/** @jsx jsx */
import { css, jsx } from "@emotion/core";
import { Box, Flex, Button, Text } from "@rebass/emotion";
import React from "react";
import { Input } from "../shared/LoginPage";
import { AsLink } from "./reusables";
import { Link } from "react-router-dom";
import { DataContext } from "../shared/DataContext";
import { DateFilter } from "../shared/DateFilter";
export const PVerificationListItem = ({
  heading,
  subHeading,
  date,
  rightSection,
  verified = false,
  to,
  ...rest
}) => {
  return (
    <AsLink to={to} {...rest}>
      <Flex
        py={3}
        px={2}
        width={1}
        justifyContent="space-between"
        css={css`
          border-bottom: 1px solid black;
        `}
      >
        <Box>
          <Text>{date}</Text>
          <Text fontSize={5}>{heading}</Text>
          <Text>{subHeading}</Text>
        </Box>
        <Flex
          flexDirection="column"
          css={css`
            align-self: center;
            align-items: center;
          `}
        >
          <Box>{rightSection}</Box>
          {verified && <Text>✔</Text>}
        </Flex>
      </Flex>
    </AsLink>
  );
};

export class PVerificationListPage extends React.Component {
  static contextType = DataContext;
  state = {
    dateFilter: {},
    client_search: false,
    data: []
  };
  componentDidMount() {
    this.fetchList();
  }
  fetchList = (refresh = false) => {
    let { dispatch, actions } = this.context;
    dispatch({ type: actions.GET_HIRED_TRANSACTIONS, value: { refresh } }).then(
      data => {
        this.setState({ data });
      }
    );
  };
  transactionVerified = order => {
    let { dispatch, actions } = this.context;
    let records = dispatch({ type: actions.GET_VERIFIED_TRANSACTIONS });
    return records.includes(order);
  };
  onDateFilter = ({ from, to }) => {
    this.setState({ dateFilter: { from, to } });
  };
  render() {
    return (
      <Flex flexDirection="column">
        <Flex flexDirection="column">
          <DateFilter
            onChange={this.onDateFilter}
            filterOptions={[
              { value: "", label: "Select Filter" },
              { value: "verified", label: "Verified Transactions" }
            ]}
          />
          <label>
            <input
              checked={this.state.client_search}
              onChange={e => this.setState({ client_search: e.target.checked })}
              type="checkbox"
            />
            Client Search
          </label>
        </Flex>
        <Flex flexDirection="column">
          {this.state.data.map(transaction => (
            <PVerificationListItem
              key={transaction.order}
              date={transaction.date}
              heading={transaction.name}
              subHeading={transaction.email}
              rightSection={transaction.amount}
              to={this.props.detailPageUrl(transaction.order)}
              verified={this.transactionVerified(transaction.order)}
              Link={Link}
            />
          ))}
        </Flex>
      </Flex>
    );
  }
}

export default PVerificationListPage;
