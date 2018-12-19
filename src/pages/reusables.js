/** @jsx jsx */
import { css, jsx } from "@emotion/core";
import { Flex, Text, Heading } from "@rebass/emotion";

export {
  getDate,
  ListGroup,
  AsLink,
  ListItem,
  DetailItem,
  getTime
} from "tuteria-shared/lib/shared/reusables";

export const DetailHeader = ({ heading, subHeading, children }) => {
  return (
    <Flex
      mb={4}
      flexDirection="column"
      css={css`
        align-items: center;
      `}
    >
      <Heading fontSize={5}>{heading}</Heading>
      <Text>{subHeading}</Text>
      {children}
    </Flex>
  );
};
