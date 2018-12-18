/** @jsx jsx */
import { css, jsx } from "@emotion/core";
import { Flex } from "@rebass/emotion";
import React from "react";
import { DataContext } from "tuteria-shared/lib/shared/DataContext";
import {  Button } from "tuteria-shared/lib/shared/primitives";
import { ListGroup, ListItem, getDate } from "./reusables";
import { DateFilter } from "tuteria-shared/lib/shared/DateFilter";
import { Link } from "react-router-dom";

export class VTransactionPage extends React.Component {
  static contextType = DataContext;
  state = {
    selection: "",
    searchParams: "",
    data: []
  };
  componentDidMount() {
    let { dispatch, actions } = this.context;
    dispatch({ type: actions.FETCH_TUTOR_WORKING_DATA }).then(data => {
      this.setState({ data });
    });
  }
  getFilteredResult() {
    let { data, selection, searchParams } = this.state;
    let result = selection
      ? data.filter(x => x.actions.includes(selection))
      : data;
    result =
      Boolean(searchParams) && searchParams.length > 2
        ? result.filter(x => x.email.includes(searchParams))
        : result;
    return result;
  }
  renderItemsInGroups() {
    let rows = [];
    let lastCategory = null;
    [...this.getFilteredResult()]
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      .forEach((record, index) => {
        let date = getDate(record.date);
        if (date !== lastCategory) {
          rows.push(<ListGroup name={date} key={date} />);
        }
        rows.push(
          <ListItem
            key={record.email}
            heading={record.full_name}
            subHeading={record.email}
            rightSection={record.actions.map((x, i) => (
              <div key={`${x}-${i}`}>{x}</div>
            ))}
            to={this.props.detailPageUrl(record.email)}
            Link={Link}
          />
        );
        lastCategory = date;
      });
    return rows;
  }
  onSearch = e => {
    this.setState({ searchParams: e.target.value });
  };

  onKeyDown = e => {
    if (e.keyCode === 13) {
    }
  };
  saveProgress = () => {
    let { dispatch, actions } = this.context;
    dispatch({ type: actions.SAVE_PROGRESS });
  };
  render() {
    const actions = {
      EMAIL_VERIFICATION: "email_verification",
      ID_VERIFICATION: "id_verification",
      PROFILE_VERIFICATION: "profile_verification"
    };
    return (
      <Flex flexDirection="column">
        <Flex flexDirection="column">
          <DateFilter
            onSearchChange={this.onSearch}
            onKeyDown={this.onKeyDown}
            displayDate={false}
            selection={this.state.selection}
            onFilterChange={e => this.setState({ selection: e.target.value })}
            placeholder="Search by email"
            filterOptions={[
              { value: "", label: "All" },
              {
                value: actions.EMAIL_VERIFICATION,
                label: "Email Verification"
              },
              { value: actions.ID_VERIFICATION, label: "ID Verification" },
              {
                value: actions.PROFILE_VERIFICATION,
                label: "Profile Pic Verification"
              }
            ]}
          />
        </Flex>
        <Button
          width={1 / 4}
          css={css`
            :active {
              opacity: 0.7;
            }
            :hover {
              cursor: pointer;
            }
          `}
          onClick={this.saveProgress}
        >
          Save Progress
        </Button>
        <Flex flexDirection="column">{this.renderItemsInGroups()}</Flex>
      </Flex>
    );
  }
}

export default VTransactionPage;
