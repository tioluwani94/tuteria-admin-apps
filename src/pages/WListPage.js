/** @jsx jsx */
import { css, jsx } from "@emotion/core";
import { Box, Flex, Button, Text } from "@rebass/emotion";
import React from "react";
import format from "date-fns/format";
import { DataContext } from "../shared/DataContext";
import { Link } from "react-router-dom";
import { ListGroup, ListItem, getDate, getTime } from "./reusables";
export { ListGroup, ListItem };

export class WListPage extends React.Component {
  static contextType = DataContext;
  state = {
    data: []
  };
  componentDidMount() {
    this.fetchList();
  }
  renderItemsInGroups() {
    let rows = [];
    let lastCategory = null;
    [...this.state.data]
      .sort((a, b) => new Date(b.date).getTime() > new Date(a.date).getTime())
      .forEach((withdrawal, index) => {
        let date = getDate(withdrawal.date);
        if (date !== lastCategory) {
          rows.push(<ListGroup name={date} key={date} />);
        }
        rows.push(
          <ListItem
            key={index}
            heading={withdrawal.amount}
            subHeading={withdrawal.email}
            rightSection={getTime(withdrawal.date)}
            to={this.props.detailPageUrl(withdrawal.order)}
            Link={Link}
          />
        );
        lastCategory = date;
      });
    return rows;
  }
  fetchList = (refresh = false) => {
    let { dispatch, actions } = this.context;
    dispatch({ type: actions.GET_WITHDRAWALS, value: refresh }).then(data => {
      this.setState({ data });
    });
  };
  refreshList = () => {
    this.fetchList(true);
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
        </Flex>
        {this.state.data.length > 0 ? (
          this.renderItemsInGroups()
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
      </Flex>
    );
  }
}

export default WListPage;
