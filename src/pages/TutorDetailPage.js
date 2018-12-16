/** @jsx jsx */
import { css, jsx } from "@emotion/core";
import { Box, Flex, Button, Text, Heading, Image } from "@rebass/emotion";
import React from "react";
import { ListGroup, ListItem, DetailItem } from "../shared/reusables";
import logo from "./logo.svg";

export const DetailHeader = ({
  image = "https://via.placeholder.com/100",
  detail
}) => {
  return (
    <Flex>
      <Image src={image} height={100} />
      <Flex
        mb={4}
        flexDirection="column"
        css={css`
          flex: 2;
        `}
      >
        <Text mb={1}>{detail[0]}</Text>
        <Heading fontSize={5}>{detail[1]}</Heading>
        <Text mb={1}>{detail[2]}</Text>
        <Text mb={1}>{detail[3]}</Text>
      </Flex>
      <Flex
        flexDirection="column"
        css={css`
          align-self: center;
        `}
      >
        <Text>Id Verified</Text>
        <Text>Email Verified</Text>
        <Text>Social Veifications</Text>
      </Flex>
    </Flex>
  );
};
export class TutorDetailPage extends React.Component {
  state = {
    data: {
      profile_pic: logo,
      slug: "james3",
      full_name: "James Novak",
      dob: "2012-10-11 12:30:33",
      state: "Lagos",
      gender: "M",
      verified: true,
      email_verified: false,
      email: "james@example.com",
      phone_no: "07035209976",
      years_of_experience: "6-10 Years",
      tutor_description: `Ifeoluwa is a dedicated, resourceful and goal-driven professional educator with a solid commitment to the social and academic growth and development of every child. This I have been doing for 10 years now. I specialize in tutoring Numeracy, Literacy and sciences for Nursery, Primary and JSS students. I have successfully tutored students for common entrance,JSCE and BECE. I also have a strong passion in seeing my learners write with a good and eligible handwriting. I have a strong believe in Child-centred curriculum and aptitude to remain flexible, ensuring that every child learning styles and abilities are addressed. I provide assessment and feedback both to my learners and parent if applicable.`,
      educations: [
        {
          school: "University of Lagos",
          course: "Systems Engineering",
          degree: "MSC"
        },
        {
          school: "University of Lagos",
          course: "Systems Engineering",
          degree: "MSC"
        }
      ],
      work_experiences: [
        { name: "Tuteria Developer", role: "Backend Developer" },
        { name: "Tuteria Developer", role: "Backend Developer" }
      ],
      locations: [
        {
          address: "20 Harrison Ojemen Street",
          state: "Lagos",
          vicinity: "GRA"
        }
      ],
      potential_subjects: ["French", "English", "Physics"],
      levels_with_exam: {},
      answers: {},
      classes: ["Nursery 2", "Primary 3", "JSS1"],
      curriculum_used: ["British", "American"],
      currriculum_explanation:
        "It is an Interesting curriculum that helps growing child especially in Reading and number work."
    }
  };
  render() {
    let { data } = this.state;
    return (
      <Flex flexDirection="column">
        <DetailHeader
          image={data.profile_pic}
          detail={[
            data.years_of_experience,
            data.full_name,
            data.email,
            data.phone_no
          ]}
        />
        <Flex mb={4} flexDirection="column">
          <ListGroup name="Tutor Description" />
          <Text p={3}>{data.tutor_description}</Text>
          <ListGroup name="Educations" />
          {data.educations.map(education => (
            <ListItem
              key={education.school}
              heading={education.school}
              subHeading={education.course}
              rightSection={education.degree}
            />
          ))}
          <ListGroup name="Work Experience" />
          {data.work_experiences.map(w_experience => (
            <ListItem
              key={w_experience.name}
              heading={w_experience.name}
              subHeading={w_experience.role}
            />
          ))}
          <ListGroup name="Location" />
          {data.locations.map(location => (
            <ListItem
              key={location.state}
              heading={`${location.address} ${location.vicinity}, ${
                location.state
              }`}
            />
          ))}
          <ListGroup name="Subject Veluation Dump" />
          <Flex>
            <Flex
              css={css`
                flex: 1;
              `}
              flexDirection="column"
            >
              <Heading>Potential Subjects</Heading>
              {data.potential_subjects.map(subject => (
                <DetailItem key={subject} label={subject} />
              ))}
              <Heading>Levels With Exam</Heading>
              {JSON.stringify(data.levels_with_exam)}
              <Heading>Answers</Heading>
              {JSON.stringify(data.answers)}
            </Flex>
            <Flex
              css={css`
                flex: 1;
              `}
              flexDirection="column"
            >
              <Heading>Classes</Heading>
              {data.classes.map(klass => (
                <DetailItem key={klass} label={klass} />
              ))}
              <Heading>Curriculum Used</Heading>
              {data.curriculum_used.map(klass => (
                <DetailItem key={klass} label={klass} />
              ))}
            </Flex>
          </Flex>
          {data.currriculum_explanation ? (
            <>
              <Heading>Curriculum Explanation</Heading>
              <Text p={3}>{data.currriculum_explanation}</Text>
            </>
          ) : null}
          <Flex justifyContent="space-between" pt={3}>
            <Button>Approve Tutor</Button> <Button>Deny Tutor</Button>
          </Flex>
        </Flex>
      </Flex>
    );
  }
}

export default TutorDetailPage;
