/** @jsx jsx */
import { jsx } from "@emotion/core";
import { Flex } from "@rebass/emotion";
import React from "react";
import { DataContext } from "tuteria-shared/lib/shared/DataContext";
import { ListGroup, ListItem } from "./reusables";
import { DateFilter } from "../shared/DateFilter";
import { Link } from "react-router-dom";

export class VTransactionPage extends React.Component {
  static contextType = DataContext;
  state = {
    searchParams: "",
    filter: ""
  };
  getVerifiedTransactions = () => {
    console.log(this.context);
    let { verified_transactions } = this.context.state;
    return verified_transactions;
  };
  onSearch = e => {
    this.setState({ searchParams: e.target.value });
  };
  filteredTransactions = () => {
    let { searchParams, filter } = this.state;
    let result = this.getVerifiedTransactions();
    if (
      (!Boolean(searchParams) || searchParams.length <= 3) &&
      !Boolean(filter)
    ) {
      return result;
    }
    let data = {};
    Object.keys(result).forEach(date => {
      let records = result[date].filter(x => {
        let searchFilter =
          searchParams.length === 0
            ? false
            : x.order.toLowerCase().includes(searchParams.toLowerCase());
        let methodFilter = x.method.toLowerCase() === filter.toLowerCase();
        return searchFilter || methodFilter;
      });
      if (records.length > 0) {
        data[date] = records;
      }
    });
    console.log({ data, filter });
    return data;
  };
  onKeyDown = e => {
    if (e.keyCode === 13) {
    }
  };
  orderedTransactions = verified_transactions => {
    let result = [
      ...Object.keys(verified_transactions).sort((a, b) => {
        let oo = new Date(b).getTime();
        let aa = new Date(a).getTime();
        return oo - aa;
      })
    ];
    return result;
  };
  onFilterChange = e => {
    this.setState({ filter: e.target.value });
  };
  render() {
    let verified_transactions = this.filteredTransactions();
    return (
      <Flex flexDirection="column">
        <Flex flexDirection="row">
          <DateFilter
            onSearchChange={this.onSearch}
            onKeyDown={this.onKeyDown}
            displayDate={false}
            onFilterChange={this.onFilterChange}
            selection={this.state.filter}
            filterOptions={[
              { value: "", label: "Select Payment Methods" },
              ...["Paystack", "GT Bank", "UBA Bank", "Zenith Bank"].map(x => ({
                label: x,
                value: x
              }))
            ]}
            searchButton={{
              display: false,
              onClick: this.refreshList,
              text: "Refresh",
              styles: "margin-top: 0;"
            }}
          />
        </Flex>
        <Flex flexDirection="column">
          {this.orderedTransactions(verified_transactions).map((date, key) => (
            <React.Fragment key={key}>
              <ListGroup name={date} />
              {verified_transactions[date].map((transaction, index) => (
                <ListItem
                  key={index}
                  heading={transaction.order}
                  subHeading={transaction.method}
                  rightSection={transaction.amount}
                  to={this.props.detailPageUrl(transaction.order)}
                  Link={Link}
                />
              ))}
            </React.Fragment>
          ))}
        </Flex>
      </Flex>
    );
  }
}

export default VTransactionPage;
