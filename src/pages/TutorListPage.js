/** @jsx jsx */
import { css, jsx } from "@emotion/core";
import { Box, Flex, Button, Text } from "@rebass/emotion";
import React from "react";
import { AsLink } from "../shared/reusables";

export const ListItem = ({
  heading,
  subHeading,
  date,
  rightSection,
  verified = false,
  gender,
  to,
  ...rest
}) => {
  return (
    <AsLink to={to} {...rest}>
      <Flex
        py={3}
        px={2}
        width={1}
        justifyContent="space-between"
        css={css`
          border-bottom: 1px solid black;
        `}
      >
        <Box>
          <Text>{date}</Text>
          <Text fontSize={5}>{heading}</Text>
          <Text>{subHeading}</Text>
        </Box>
        <Flex
          flexDirection="column"
          css={css`
            align-self: center;
            align-items: center;
          `}
        >
          <Text>{gender}</Text>
          <Box>{rightSection}</Box>
          {verified && <Text>✔</Text>}
        </Flex>
      </Flex>
    </AsLink>
  );
};
function determineAge(date) {
  let year = new Date(date).getFullYear();

  return new Date().getFullYear() - year;
}
export class TutorListPage extends React.Component {
  state = {
    tutors: [
      {
        slug: "james1",
        full_name: "James Novak",
        dob: "2012-10-11 12:30:33",
        state: "Lagos",
        gender: "M",
        verified: true,
        email_verified: false
      },
      {
        slug: "james2",
        full_name: "James Novak",
        dob: "2012-10-11 12:30:33",
        state: "Lagos",
        gender: "M",
        verified: false,
        email_verified: true
      },
      {
        slug: "james3",
        full_name: "James Novak",
        dob: "2012-10-11 12:30:33",
        state: "Lagos",
        gender: "M",
        verified: true,
        email_verified: false
      }
    ]
  };
  static defaultProps = {
    detailPageUrl: () => {}
  };
  workedOn = slug => {};
  render() {
    return (
      <Flex flexDirection="column">
        <Flex flexDirection="column">
          {this.state.tutors.map(tutor => (
            <ListItem
              key={tutor.slug}
              date={`Age (${determineAge(tutor.dob)})`}
              heading={tutor.full_name}
              subHeading={tutor.state}
              gender={tutor.gender}
              rightSection={tutor.email_verified}
              to={this.props.detailPageUrl(tutor.slug)}
              verified={tutor.verified}
              // Link={Link}
            />
          ))}
        </Flex>
      </Flex>
    );
  }
}
export default TutorListPage;
