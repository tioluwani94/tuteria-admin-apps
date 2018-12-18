/** @jsx jsx */
import { css, jsx } from "@emotion/core";
import { Box, Flex, Button, Text } from "@rebass/emotion";
import React from "react";
import { Input } from "./LoginPage";

class FromTo extends React.Component {
  state = {
    from: "",
    to: ""
  };
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
      </Flex>
    );
  }
}

export const DateFilter = ({
  onChange,
  onSearchChange,
  displayDate = true,
  onKeyDown = () => {},
  onFilterChange = () => {},
  filterOptions = [],
  selection,
  placeholder = "Search either email or order"
}) => {
  return (
    <Flex justifyContent="space-between">
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
            isValid
            placeholder={placeholder}
          />
        </Box>
      ) : null}
      {onChange ? (
        <Flex flexDirection="column">
          <FromTo onChange={onChange} />
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
    </Flex>
  );
};
