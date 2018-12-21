/** @jsx jsx */
import { css, jsx } from '@emotion/core';
import styled from '@emotion/styled';
import React, { Fragment } from 'react';
import { Box, Flex, Button, Text, Link } from '@rebass/emotion';
import { AsLink } from '../shared/primitives/Button';

const ListItemCell = styled(Box)`
  flex: ${props => props.width};
  padding-right: 16px;
  ${props =>
    props.isEllipsis
      ? `
  text-overflow: ellipsis;
  overflow: hidden;
  white-space: nowrap;`
      : ``}
  text-transform: ${props => (props.isCapitalized ? 'capitalize' : 'inherit')};

  @media (max-width: ${props => props.hideAt}) {
    display: none;
  }
`;

const StyledTableList = styled.div`
  a:last-of-type {
    .TableRow {
      border-bottom: none;
    }
  }
`;

export const TableRow = ({ data, isHeader, style }) => {
  let columnStyle = isHeader
    ? {
        textTransform: 'capitalize',
        fontWeight: 'bold',
      }
    : {};
  let Container = isHeader ? Fragment : AsLink;
  return (
    <Container
      to="#"
      style={`
      display: block;
      :hover {
        background-color: #f8f8f8;
      }
    `}
    >
      <Flex
        alignItems="center"
        justifyContent="space-between"
        flexWrap="wrap"
        css={css`
          border-bottom: 1px solid #e8e8e8;
        `}
        px="8px"
        py="16px"
      >
        {data.map((item, i) => (
          <ListItemCell key={i.toString()} css={columnStyle} {...style[i]}>
            {item}
          </ListItemCell>
        ))}
      </Flex>
    </Container>
  );
};

export const TableList = ({ data, columns, style }) => {
  return (
    <StyledTableList>
      <TableRow data={columns} isHeader style={style} />
      {data.map((item, i) => {
        let itemValues = Object.values(item);
        return (
          <TableRow
            key={i.toString()}
            data={itemValues}
            style={style}
            className="TableRow"
          />
        );
      })}
    </StyledTableList>
  );
};

TableList.defaultProps = {
  style: [],
};
