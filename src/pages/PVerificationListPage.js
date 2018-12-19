/** @jsx jsx */
import { css, jsx } from "@emotion/core";
import { Box, Flex, Text } from "@rebass/emotion";
import React from "react";
import { AsLink } from "./reusables";
import { Link } from "react-router-dom";
import { DataContext } from "tuteria-shared/lib/shared/DataContext";
import { DateFilter } from "../shared/DateFilter";
import { SpinnerContainer } from "tuteria-shared/lib/shared/primitives/Spinner";
import queryString from "query-string";
import { filterHelper } from "../adapters";
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
  constructor(props) {
    super(props);
    let {
      location: { search }
    } = this.props;
    let { from = "", to = "", q = "", status = "" } = queryString.parse(search);
    let state = { dateFilter: { from, to }, searchParam: q, filter: status };

    this.state = {
      dateFilter: state.dateFilter,
      client_search: true,
      verified_transactions: [],
      searchParam: state.searchParam,
      filter: state.filter,
      data: [],
      loading: false
    };
  }
  componentDidMount() {
    this.fetchList(true);
  }
  fetchList = (refresh = false) => {
    let { dispatch, actions } = this.context;
    let { dateFilter, searchParam, client_search } = this.state;
    let filterProps = client_search ? {} : { dateFilter, searchParam };
    this.setState({ loading: true });
    dispatch({
      type: actions.GET_HIRED_TRANSACTIONS,
      value: { refresh, ...filterProps }
    }).then(data => {
      this.setState({
        loading: false,
        data: data[0],
        verified_transactions: data[1]
      });
    });
  };
  serverSearch = e => {
    if (e.keyCode) {
      if (e.keyCode === 13) {
        this.fetchList(true);
      }
    } else {
      this.fetchList(true);
    }
  };
  transactionVerified = order => {
    let { verified_transactions } = this.state;
    let records = []
      .concat(...Object.values(verified_transactions))
      .map(x => x.order);
    return records.includes(order);
  };
  onDateFilter = ({ from, to }) => {
    this.setState({ dateFilter: { from, to } });
  };
  onFilterChange = e => {
    this.setState({ filter: e.target.value });
  };
  filteredResults = () => {
    let { searchParam, data, client_search, dateFilter, filter } = this.state;
    let result = data;
    if (client_search) {
      result = filterHelper(
        result,
        { searchParam, dateFilter, filter },
        this.transactionVerified
      );
    }
    return result;
  };
  render() {
    return (
      <Flex flexDirection="column">
        <Flex flexDirection="column">
          <DateFilter
            onSearchChange={e => {
              this.setState({ searchParam: e.target.value }, () => {});
            }}
            buttonText="This Month"
            searchValue={this.state.searchParam}
            dateValue={this.state.dateFilter}
            onChange={this.onDateFilter}
            onFilterChange={this.onFilterChange}
            selection={this.state.filter}
            onKeyDown={this.serverSearch}
            filterOptions={[
              { value: "", label: "Select Filter" },
              { value: "verified", label: "Verified" },
              { value: "not_verified", label: "Not Verified" }
            ]}
            searchButton={{
              display: !this.state.client_search,
              onClick: this.serverSearch
            }}
          />
          <label>
            <input
              checked={this.state.client_search}
              onChange={e =>
                this.setState({
                  client_search: e.target.checked,
                  filter: e.target.checked ? this.state.filter : ""
                })
              }
              type="checkbox"
            />
            Client Search
          </label>
        </Flex>
        <SpinnerContainer condition={this.state.loading}>
          <Flex flexDirection="column">
            {this.filteredResults().map(transaction => (
              <PVerificationListItem
                key={transaction.order}
                date={transaction.date}
                heading={transaction.name}
                subHeading={transaction.email}
                rightSection={`N${transaction.amount.toLocaleString()}`}
                to={this.props.detailPageUrl(transaction.order)}
                verified={this.transactionVerified(transaction.order)}
                Link={Link}
              />
            ))}
          </Flex>
        </SpinnerContainer>
      </Flex>
    );
  }
}

export default PVerificationListPage;
