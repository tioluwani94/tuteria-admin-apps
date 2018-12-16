/** @jsx jsx */
import { css, jsx } from "@emotion/core";
import { Box, Flex, Button as EButton, Text, Link } from "@rebass/emotion";
import React from "react";
export { DialogButton } from "./Modal";
export const Button = ({ ...rest }) => {
  return (
    <EButton
      py={3}
      css={css`
        :hover {
          cursor: pointer;
        }
        :disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }
      `}
      {...rest}
    />
  );
};
