/** @jsx jsx */
import React, { Component } from 'react';
import { css, jsx } from '@emotion/core';
import { DetailItem, DetailHeader } from 'tuteria-shared/lib/shared/reusables';

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
      },
    },
  };
  render() {
    const { request } = this.state.data;
    return (
      <div>
        <DetailHeader heading={`N${request.budget}`} subHeading={request.slug} />
        <DetailItem label="Full Name">
          {request.first_name} {request.last_name}
        </DetailItem>
        <DetailItem label="Email">{request.email}</DetailItem>
        <DetailItem label="Phone">{request.phone}</DetailItem>
      </div>
    );
  }
}
