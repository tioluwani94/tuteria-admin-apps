/** @jsx jsx */
import React, { Component } from 'react';
import { css, jsx } from '@emotion/core';
import { Text, Flex, Box, Button as RButton } from '@rebass/emotion';
import { Button } from 'tuteria-shared/lib/shared/primitives';
import { Input } from 'tuteria-shared/lib/shared/LoginPage';
import {
  DetailItem,
  DetailHeader,
  ListGroup,
  TutorDetailHeader,
} from 'tuteria-shared/lib/shared/reusables';
import { DialogButton } from 'tuteria-shared/lib/shared/primitives';
import { Select } from './PVerificationDetailPage';

const options = [
  { label: 'To be booked', value: 'To be booked' },
  { label: 'Completed', value: 'Completed' },
  { label: 'Cold', value: 'Cold' },
];

const RemarkForm = ({ onSubmit }) => (
  <form onSubmit={onSubmit}>
    <Box mb={3}>
      <textarea
        css={css`
          width: 100%;
        `}
        placeholder="Enter remark here"
        rows={10}
      />
    </Box>
    <RButton type="submit">Submit remark</RButton>
  </form>
);

export class SDetailPage extends Component {
  state = {
    data: {
      request: {
        first_name: 'Tioluwani',
        last_name: 'Kolawole',
        email: 'kolawole.tioluwani@gmail.com',
        phone: '08078657912',
        request_id: '23009',
        no_of_hours: 7,
        per_hour_rate: 2500,
        budget: 35000,
        slug: 'ABSCDEFG',
        no_of_students: 3,
        curriculum: 'British',
        duration: '3pm - 5pm',
        classes: ['JSS1', 'JSS2', 'SS1'],
        days: ['Monday', 'Wednesday', 'Friday', 'Saturday'],
        subjects: ['Mathematics', 'English Language', 'Biology', 'Chemistry'],
        expectation:
          'Lorem Khaled Ipsum is a major key to success. I’m giving you cloth talk, cloth. Special cloth alert, cut from a special cloth. The first of the month is coming, we have to get money, we have no choice.',
      },
      location: {
        area: 'lbs',
        state: 'Lagos',
        address: '37 Alara street, Onike ',
        vicinity: 'Yaba',
      },
      tutors: [
        {
          profile_pic:
            'http://res.cloudinary.com/tuteria/image/upload/v1546853059/vc4x8ljjgaollupn25x0.jpg',
          phone_no: '+2348069269483',
          full_name: 'Blessing Avugara',
          verified: true,
          amount_per_hour: 2500,
          years_of_experience: 'Between 3 to 5 years',
          email: 'blessingozioma123@gmail.com',
          potential_subjects: [
            'Verbal Reasoning',
            'Fine Art',
            'Quantitative Reasoning',
            'Basic Sciences',
            'Basic Mathematics',
            'English Language',
            'Computer Science',
            'Social Studies',
            'Economics',
            'Commerce',
          ],
        },
        {
          profile_pic:
            'http://res.cloudinary.com/tuteria/image/upload/v1546853059/vc4x8ljjgaollupn25x0.jpg',
          phone_no: '+2348069269483',
          full_name: 'Blessing Avugara',
          verified: true,
          amount_per_hour: 2500,
          years_of_experience: 'Between 3 to 5 years',
          email: 'blessingozioma123@gmail.com',
          potential_subjects: [
            'Verbal Reasoning',
            'Fine Art',
            'Quantitative Reasoning',
            'Basic Sciences',
            'Basic Mathematics',
            'English Language',
            'Computer Science',
            'Social Studies',
            'Economics',
            'Commerce',
          ],
        },
      ],
    },
  };
  render() {
    const { request, location, tutors } = this.state.data;
    return (
      <>
        <div>
          <DetailHeader
            heading={`N${request.budget}`}
            subHeading={`Request ID: ${request.request_id}`}
          >
            <Text pt={1}>Slug: {request.slug}</Text>
          </DetailHeader>
          <DetailItem label="Full Name">
            {request.first_name} {request.last_name}
          </DetailItem>
          <DetailItem label="Email">{request.email}</DetailItem>
          <DetailItem label="Phone">{request.phone}</DetailItem>
          <DetailItem label="Address">{`${location.address} ${
            location.vicinity
          }, ${location.state}`}</DetailItem>
          <DetailItem label="Per hour rate">
            N{request.per_hour_rate}
          </DetailItem>
          <DetailItem label="Number of hours">{request.no_of_hours}</DetailItem>
        </div>
        <div>
          <ListGroup name="Lesson Detail" />
          <DetailItem label="Number of students">
            {request.no_of_students}
          </DetailItem>
          <DetailItem label="Class of children">
            {request.classes.map(value => (
              <span>{value}, </span>
            ))}
          </DetailItem>
          <DetailItem label="Subjects">
            {request.subjects.map(subject => (
              <span>{subject}, </span>
            ))}
          </DetailItem>
          <DetailItem label="Curriculum">{request.curriculum}</DetailItem>
          <DetailItem label="Expectations" flexDirection="column">
            <Text fontSize="18px" lineHeight={2} pt={2}>
              {request.expectation}
            </Text>
          </DetailItem>
        </div>
        <div>
          <ListGroup name="Schedule Detail" />
          <DetailItem label="Number of hours">{request.no_of_hours}</DetailItem>
          <DetailItem label="Number of days">{request.days.length}</DetailItem>
          <DetailItem label="Selected days">
            {request.days.map(day => (
              <span>{day}, </span>
            ))}
          </DetailItem>
          <DetailItem label="Duration">{request.duration}</DetailItem>
        </div>
        <div>
          <ListGroup name="List of approved tutors" />
          <Flex alignItems="center">
            <Box
              css={css`
                flex: 1;
              `}
            >
              <Input isValid placeholder="Email of tutor" type="text" />
            </Box>
            <Box ml={3}>
              <Button>Add to pool</Button>
            </Box>
          </Flex>
          {tutors.map(tutor => (
            <Box
              css={css`
                border-bottom: 1px solid #e8e8e8;
              `}
              mb={'16px'}
            >
              <TutorDetailHeader
                image={tutor.profile_pic}
                detail={[
                  tutor.years_of_experience,
                  tutor.full_name,
                  tutor.email,
                  tutor.phone_no,
                ]}
              >
                <Text>N{tutor.amount_per_hour}</Text>
                {tutor.verified && <Text>✔</Text>}
              </TutorDetailHeader>
            </Box>
          ))}
        </div>
        <div>
          <Flex justifyContent="space-between" alignItems="center">
            <DialogButton
              hideFooter={true}
              heading="Add remark"
              dialogText={<RemarkForm />}
            >
              Give remark
            </DialogButton>
            <Button>Send profile to client</Button>
          </Flex>
        </div>
        <Box my={3}>
          <ListGroup name="Update request status" />
          <Flex>
            <Box
              css={css`
                flex: 1;
              `}
            >
              <Select options={options} />
            </Box>
            <Box>
              <Button>Update</Button>
            </Box>
          </Flex>
        </Box>
      </>
    );
  }
}
