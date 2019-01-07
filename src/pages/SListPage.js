/** @jsx jsx */
import { css, jsx } from "@emotion/core";
import { Flex, Card, Box, Text } from "@rebass/emotion";
import { DateFilter } from "tuteria-shared/lib/shared/DateFilter";
import { parseQuery } from "tuteria-shared/lib/shared/utils";
import { Link } from "react-router";
import { SpinnerContainer } from "tuteria-shared/lib/shared/primitives/Spinner";
import { RequestListItem, SectionListPage } from "./reusables";
import React from "react";
const RequestStatusSummary = ({
  label,
  amount = 0,
  no = 0,
  label_name = "No of bookings"
}) => {
  return (
    <Card
      fontSize={6}
      fontWeight="bold"
      width={[1, 1, 1 / 2]}
      p={5}
      my={5}
      mx={2}
      bg="#f6f6ff"
      borderRadius={8}
      boxShadow="0 2px 16px rgba(0, 0, 0, 0.25)"
    >
      <Box>
        <Text fontSize={2}>{label}</Text>
      </Box>
      {amount.toLocaleString()}
      <Text fontSize={3}>
        {label_name}: {no}
      </Text>
    </Card>
  );
};
class SalesListPage extends React.Component {
  constructor(props) {
    super(props);
    let {
      location: { search }
    } = this.props;
    let { from = "", to = "", q = "", status = "" } = parseQuery(search);
    let state = {
      dateFilter: { from, to },
      searchParam: q,
      filter: status
    };
    this.state = {
      selection: "",
      dateFilter: state.dateFilter
    };
  }
  onDateFilter = ({ from, to }) => {
    this.setState({ dateFilter: { from, to } });
  };
  filteredResults = () => {
    return [
      {
        slug: "ABCDESDDESS",
        full_name: "Shola Ameobi",
        email: "james@example.com",
        phone_no: "08033002232",
        skill: "IELTS",
        tutor: "Chidiebere",
        status: "pending",
        created: "2018-10-12 14:10:33",
        modified: "2018-10-12 14:10:33"
      }
    ];
  };
  onSearch = () => {};
  render() {
    const actions = {
      ISSUED: 1,
      COMPLETED: 2,
      PENDING: 4,
      MEETING: 5,
      BOOKED: 6,
      PAYED: 3,
      COLD: 8,
      TO_BE_BOOKED: 11
    };
    return (
      <Flex flexDirection="column">
        <Flex>
          <RequestStatusSummary
            label_name="Request count"
            label="Paid Requests"
            amount={200000}
            no={3}
          />
          <RequestStatusSummary
            label_name="Request count"
            label="Pending Requests"
            no={30}
            amount={500000}
          />
          <RequestStatusSummary
            label="Total Revenue from sales"
            no={25}
            amount={400000}
          />
          <RequestStatusSummary
            label="Combined Revenue"
            no={200}
            amount={10000000}
          />
        </Flex>
        <Flex flexDirection={"column"}>
          <DateFilter
            onSearchChange={e => {
              this.setState({ searchParam: e.target.value }, () => {});
            }}
            buttonText="This Month"
            searchValue={this.state.searchParam}
            dateValue={this.state.dateFilter}
            onChange={this.onDateFilter}
            onKeyDown={this.serverSearch}
            displayDate={false}
            selection={this.state.selection}
            onFilterChange={e => this.setState({ selection: e.target.value })}
            placeholder="Search by email"
            searchButton={{
              display: true,
              onClick: this.serverSearch
            }}
            filterOptions={[
              { value: "", label: "All" },
              {
                value: actions.ISSUED,
                label: "issued requests"
              },
              {
                value: actions.COMPLETED,
                label: "completed requests"
              },
              {
                value: actions.PENDING,
                label: "pending requests"
              },
              {
                value: actions.MEETING,
                label: "meet with client"
              },
              {
                value: actions.PAYED,
                label: "paid requests"
              },
              {
                value: actions.COLD,
                label: "cold clients"
              },
              {
                value: actions.TO_BE_BOOKED,
                label: "requests to be booked"
              }
            ]}
          />
        </Flex>
        <SpinnerContainer condition={this.state.loading}>
          <Flex flexDirection="column">
            <SectionListPage
              data={this.filteredResults()}
              callback={request => request}
              Component={RequestListItem}
              keyValue="created"
            />
          </Flex>
        </SpinnerContainer>
      </Flex>
    );
  }
}

export default SalesListPage;
