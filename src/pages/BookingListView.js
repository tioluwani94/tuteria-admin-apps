import React from 'react';
import { Flex, Heading } from '@rebass/emotion';
import { TableList } from '../components/List';
import { DataContext } from '../DataProvider';
import { format } from 'date-fns';
import { Panel } from '../shared/reuseable';
import { HomePageSpinner } from '../shared/primitives/Spinner';
import SectionHeading from '../components/SectionHeading';

const columns = [
  'Client email',
  'Tutor email',
  'Order',
  'Sessions',
  'Status',
  'Date',
];

const formatDate = date => {
  return format(new Date(date), 'MMMM M, GGGG');
};

const TABLE_CONFIG = [
  { width: '30%', isEllipsis: true },
  { width: '30%', hideAt: '620px', isEllipsis: true },
  { width: '10%', hideAt: '370px' },
  { width: '10%', hideAt: '840px' },
  { width: '10%', isCapitalized: true },
  { width: '10%', hideAt: '1006px' },
];

export class BookingListView extends React.Component {
  static contextType = DataContext;
  state = {
    bookings: [],
  };
  componentDidMount() {
    this.fetchBookings();
  }
  fetchBookings = (refresh = false) => {
    let { dispatch, actions } = this.context;
    dispatch({ type: actions.GET_BOOKINGS, value: refresh }).then(data => {
      this.setState({ bookings: this.formatBookingData(data) });
    });
  };
  formatBookingData = bookings => {
    return bookings.map(booking => ({
      client: booking.client.email,
      tutor: booking.tutor.email,
      order: booking.order,
      sessions: booking.sessions.length,
      status: booking.status,
      date: formatDate(booking.createdAt),
    }));
  };
  filterBookings = status => {
    if (status !== '') {
      let { dispatch, actions } = this.context;
      dispatch({ type: actions.FILTER_BOOKINGS, value: status }).then(data => {
        this.setState({ bookings: this.formatBookingData(data) });
      });
    } else {
      this.fetchBookings(true);
    }
  };
  searchBookings = search => {
    if (search !== '') {
      let { dispatch, actions } = this.context;
      dispatch({ type: actions.SEARCH_BOOKINGS, value: search }).then(data => {
        this.setState({ bookings: this.formatBookingData(data) });
      });
    } else {
      this.fetchBookings(true);
    }
  };
  render() {
    let { bookings } = this.state;
    let { loading } = this.context.state;
    return (
      <React.Fragment>
        <SectionHeading
          heading={`Bookings - ${bookings.length}`}
          filters={['Scheduled', 'Delivered', 'Initialized', 'Worked On']}
          clientSearch={this.searchBookings}
          serverSearch={() => {}}
          clientFilter={this.filterBookings}
          serverFilter={() => {}}
          filterPlaceholder="All"
        />
        {loading ? (
          <HomePageSpinner />
        ) : bookings.length > 0 ? (
          <Panel mt="64px">
            <TableList columns={columns} data={bookings} style={TABLE_CONFIG} />
          </Panel>
        ) : (
          <Flex
            justifyContent="center"
            alignItems="center"
            flexDirection="column"
            my="100px"
          >
            <Heading>No Bookings</Heading>
          </Flex>
        )}
      </React.Fragment>
    );
  }
}
