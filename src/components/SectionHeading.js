import React from 'react';
import PropTypes from 'prop-types';
import styled from '@emotion/styled';
import { jsx, css } from '@emotion/core';
import { Flex, Box, Heading, Text } from '@rebass/emotion';
import { Input } from '../shared/primitives/Input';
import { Select } from '../shared/primitives/Select';

const StyledSectionHeading = styled(Flex)`
  background-color: #fff;
  border-bottom: 1px solid #e8e8e8;
  box-shadow: 0 1px 1px rgba(0, 0, 0, 0.05);

  .SectionHeading {
    &__heading {
    }
    &__search {
    }

    &__filter {
    }
  }
`;

class SectionHeading extends React.Component {
  state = {
    search: '',
    isClientSearch: true,
  };
  onSearchChange = e => {
    this.setState({
      search: e.target.value,
    });
  };
  onClientSearchChange = e => {
    this.setState({
      isClientSearch: e.target.checked,
    });
  };
  handleSearch = e => {
    e.preventDefault();
    const { search, isClientSearch } = this.state;
    if (isClientSearch) {
      this.props.clientSearch(search);
    } else {
      this.props.serverSearch(search);
    }
  };
  handleFilter = e => {
    let filter = e.target.value;
    const { isClientSearch } = this.state;
    if (isClientSearch) {
      this.props.clientFilter(filter);
    } else {
      this.props.serverFilter(filter);
    }
  };
  render() {
    const {
      heading,
      filters,
      searchPlaceholder,
      filterPlaceholder,
    } = this.props;
    const { search, isClientSearch } = this.state;
    return (
      <StyledSectionHeading
        px="16px"
        py="16px"
        className="SectionHeading"
        alignItems="center"
      >
        <Box className="SectionHeading__heading" width={1 / 5} mr="16px">
          <Heading>{heading}</Heading>
        </Box>
        <Flex mr="16px" alignItems="center">
          <Input
            type="checkbox"
            onChange={this.onClientSearchChange}
            checked={isClientSearch}
          />
          <Text
            css={css`
              display: inline;
            `}
          >
            Client search
          </Text>
        </Flex>
        <Box width={2 / 5}>
          <Flex alignItems="center">
            <Box className="SectionHeading__search" mr="16px" width="60%">
              <form onSubmit={this.handleSearch} style={{ width: '100%' }}>
                <Input
                  value={search}
                  onChange={this.onSearchChange}
                  placeholder={searchPlaceholder}
                  width="100%"
                />
              </form>
            </Box>

            <Box className="SectionHeading__filter" width="40%">
              <Select
                placeholder={filterPlaceholder}
                width="100%"
                onChange={this.handleFilter}
                formatOptions={options =>
                  options.map(option => ({ label: option, value: option }))
                }
                options={filters}
              />
            </Box>
          </Flex>
        </Box>
      </StyledSectionHeading>
    );
  }
}

SectionHeading.defaultProps = {
  searchPlaceholder: 'Search by order or email',
  filterPlaceholder: 'Filter by status',
};

SectionHeading.propTypes = {
  clientSearch: PropTypes.func.isRequired,
  serverSearch: PropTypes.func.isRequired,
  clientFilter: PropTypes.func.isRequired,
  serverFilter: PropTypes.func.isRequired,
};

export default SectionHeading;
