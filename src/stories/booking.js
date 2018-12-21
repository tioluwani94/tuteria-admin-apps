import React from 'react';
import { storiesOf } from '@storybook/react';
import { MemoryRouter as Router, Switch, Route } from 'react-router';
import devAdapter from '../adapters/dev';
import { DataContext, DataProvider } from '../DataProvider';
import ProtectedRoute from '../shared/ProtectedRoutes';
import { LoginPage } from '../shared/LoginPage';
import { BookingListView } from '../pages/BookingListView';

const WithRouter = ({ children, initialIndex = 0, test = true }) => {
  return (
    <DataProvider
      test={test}
      // adapter={testServerAdapter}
      adapter={devAdapter}
      authenticateUser={token => new Promise(resolve => resolve(true))}
    >
      <Router initialEntries={['/login', '/bookings']} initialIndex={initialIndex}>
        <Switch>
          <Route
            path="/login"
            render={props => {
              return (
                <DataContext.Consumer>
                  {({ dispatch, actions }) => {
                    return (
                      <LoginPage
                        login={props =>
                          dispatch({ type: actions.LOGIN_USER, value: props })
                        }
                        toNextPage={() => {
                          props.history.push('/bookings');
                        }}
                      />
                    );
                  }}
                </DataContext.Consumer>
              );
            }}
          />
          {children}
        </Switch>
      </Router>
    </DataProvider>
  );
};

const bookings = storiesOf("Bookings", module);

bookings.add("Booking List View", () => (
    
    <WithRouter initialIndex={1}>
      <Route
        path="/bookings"
        exact
        render={() => {
          return <BookingListView />;
        }}
      />
      {/* <ProtectedRoute
        path="/bookings/:order"
        render={props => (
          <WDetailPage
            getWithdrawal={order => testData().find(x => x.order === order)}
            transactions={testDataTransactions()}
            {...props}
          />
        )}
      /> */}
    </WithRouter>
))
