import { Flex } from "@rebass/emotion";
import React from "react";
import { DataContext } from "tuteria-shared/lib/shared/DataContext";
import { ListGroup, ListItem } from "./reusables";
import { DateFilter } from "tuteria-shared/lib/shared/DateFilter";
import { Link } from "react-router-dom";

export class VTransactionPage extends React.Component {
  static contextType = DataContext;
  state = {
    searchParams: ""
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
    let { searchParams } = this.state;
    let result = this.getVerifiedTransactions();
    if (!Boolean(searchParams) || searchParams.length <= 3) {
      return result;
    }
    let data = {};
    Object.keys(result).forEach(date => {
      let records = result[date].filter(x =>
        x.order.toLowerCase().includes(searchParams.toLowerCase())
      );
      if (records.length > 0) {
        data[date] = records;
      }
    });
    return data;
  };
  onKeyDown = e => {
    if (e.keyCode === 13) {
    }
  };
  render() {
    let verified_transactions = this.filteredTransactions();
    return (
      <Flex flexDirection="column">
        <Flex flexDirection="column">
          <DateFilter
            onSearchChange={this.onSearch}
            onKeyDown={this.onKeyDown}
            displayDate={false}
          />
        </Flex>
        <Flex flexDirection="column">
          {Object.keys(verified_transactions).map((date, key) => (
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
