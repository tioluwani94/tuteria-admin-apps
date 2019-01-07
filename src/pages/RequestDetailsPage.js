/** @jsx jsx */
import React, { Component } from 'react';
import { css, jsx } from '@emotion/core';
import { Text } from '@rebass/emotion';
import {
  DetailItem,
  DetailHeader,
  ListGroup,
} from 'tuteria-shared/lib/shared/reusables';

export class RequestDetailPage extends Component {
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
    },
  };
  render() {
    const { request, location } = this.state.data;
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
          <DetailItem label="Address">{`${location.address} ${location.vicinity}, ${location.state}`}</DetailItem>
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
            <Text fontSize="18px" lineHeight={2} pt={2}>{request.expectation}</Text>
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
          <DetailItem label="Duration">{request.curriculum}</DetailItem>
        </div>
        <div>
          <ListGroup name="List of approved tutors" />

        </div>
      </>
    );
  }
}
