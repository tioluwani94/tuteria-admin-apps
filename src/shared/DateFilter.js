/** @jsx jsx */
import { css, jsx } from "@emotion/core";
import { Box, Flex, Button } from "@rebass/emotion";
import React from "react";
import { Input } from "tuteria-shared/lib/shared/LoginPage";
import format from "date-fns/format";

function currentMonth() {
  var date = new Date();
  var firstDay = new Date(date.getFullYear(), date.getMonth(), 1);
  var lastDay = new Date(date.getFullYear(), date.getMonth() + 1, 0);
  return {
    from: format(firstDay, "YYYY-MM-DD"),
    to: format(lastDay, "YYYY-MM-DD")
  };
}
class FromTo extends React.Component {
  state = this.props.value || {
    from: "",
    to: ""
  };
  //   static getDerivedStateFromProps(props, state) {
  //     let { value = { from: "", to: "" } } = props;
  //     if (value.from !== state.from || value.to !== state.to) {
  //       return value;
  //     }
  //     return null;
  //   }
  onChange = key => {
    return e => {
      this.setState({ [key]: e.target.value }, () => {
        this.props.onChange(this.state);
      });
    };
  };
  render() {
    return (
      <Flex>
        <Input
          label="From"
          type="date"
          name="from"
          isValid
          value={this.state.from}
          onChange={this.onChange("from")}
        />
        <Input
          value={this.state.to}
          label="To"
          type="date"
          name="to"
          isValid
          onChange={this.onChange("to")}
        />
        <Button
          py="4px"
          onClick={() => {
            let today = currentMonth();

            this.setState(today, () => {
              this.props.onChange(this.state);
            });
          }}
          css={css`
            height: 36px;
            align-self: center;
            margin-top: 26px;
            border-radius: 0;
          `}
        >
          {this.props.buttonText || "Reset"}
        </Button>
      </Flex>
    );
  }
}

export const DateFilter = ({
  onChange,
  onSearchChange,
  displayDate = true,
  searchValue,
  onKeyDown = () => {},
  onFilterChange = () => {},
  filterOptions = [],
  dateValue = {
    from: "",
    to: ""
  },
  selection,
  placeholder = "Search either email or order",
  buttonText,
  searchButton = {}
}) => {
  return (
    <Flex
      css={css`
        flex: 1;
      `}
      justifyContent="space-between"
    >
      {onSearchChange ? (
        <Box
          w={1}
          pr={4}
          css={css`
            flex: 1;
            align-self: flex-end;
          `}
        >
          <Input
            onChange={onSearchChange}
            onKeyDown={onKeyDown}
            value={searchValue}
            isValid
            placeholder={placeholder}
          />
        </Box>
      ) : null}
      {onChange ? (
        <Flex flexDirection="column">
          <FromTo
            buttonText={buttonText}
            value={dateValue}
            onChange={onChange}
          />
        </Flex>
      ) : null}
      {filterOptions.length > 0 ? (
        <select
          css={css`
            height: 36px;
            align-self: flex-end;
            margin-bottom: 16px;
            margin-left: 20px;
          `}
          value={selection}
          onChange={onFilterChange}
        >
          {filterOptions.map(option => (
            <option key={option.label} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      ) : null}
      {searchButton.display ? (
        <Button
          css={css`
            height: 40px;
            align-self: center;
            margin-top: 24px;
            margin-left: 10px;
            ${searchButton.styles || ""}
          `}
          onClick={searchButton.onClick}
        >
          {searchButton.text || "Search"}
        </Button>
      ) : null}
    </Flex>
  );
};
