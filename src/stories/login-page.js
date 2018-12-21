import React from "react";

import { storiesOf } from "@storybook/react";
import { action } from "@storybook/addon-actions";
import { linkTo } from "@storybook/addon-links";

import { Button, Welcome } from "@storybook/react/demo";
import LoginPage from "../shared/LoginPage";
import WListPage, { ListItem, ListGroup } from "../pages/WListPage";
import PVerificationListPage from "../pages/PVerificationListPage";
import PVerificationDetailPage from "../pages/PVerificationDetailPage";
import VTransactionPage from "../pages/VTransactionPage";
import WDetailPage from "../pages/WDetailPage";
import DataProvider, { ProtectedRoute, DataContext } from "../DataProvider";
import { MemoryRouter as Router, Route, Switch } from "react-router";
import { Dialog } from "../shared/primitives/Modal";
import { testData, testDataTransactions } from "../adapters/test_data";
import devAdapter from "../adapters/dev";
import testServerAdapter from "../adapters/test";
storiesOf("Welcome", module).add("to Storybook", () => (
  <Welcome showApp={linkTo("Button")} />
));

storiesOf("Button", module)
  .add("with text", () => (
    <Button onClick={action("clicked")}>Hello Button</Button>
  ))
  .add("with some emoji", () => (
    <Button onClick={action("clicked")}>
      <span role="img" aria-label="so cool">
        😀 😎 👍 💯
      </span>
    </Button>
  ));

const WithRouter = ({ children, initialIndex = 0, test = true }) => {
  return (
    <DataProvider
      test={test}
      // adapter={testServerAdapter}
      adapter={devAdapter}
      authenticateUser={token => new Promise(resolve => resolve(true))}
    >
      <Router
        initialEntries={[
          "/withdrawals",
          "/withdrawals/1004/transactions",
          "/withdrawals/1004/transactions/AA102",
          "/payment-verifications",
          "/payment-verifications/RSET323",
          "/verified-transactions"
        ]}
        initialIndex={initialIndex}
      >
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
                          props.history.push("/withdrawals");
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
storiesOf("Pages", module)
  .add("Login Page", () => (
    <LoginPage
      login={() => {
        return new Promise((resolve, reject) => {
          setTimeout(() => {
            // resolve();
            reject({ data: "The credentials is invalid" });
          }, 2000);
        });
      }}
      toNextPage={() => {}}
    />
  ))
  .add("Withdrawal List Page", () => (
    <WithRouter test={false}>
      <ProtectedRoute
        path="/withdrawals"
        exact
        render={() => {
          return (
            <WListPage
              detailPageUrl={order => `/withdrawals/${order}/transactions`}
            />
          );
        }}
      />
      <ProtectedRoute path="/withdrawals/:order" component={WDetailPage} />
    </WithRouter>
  ))
  .add("Withdrawal Detail Page", () => (
    <WithRouter initialIndex={1}>
      <ProtectedRoute
        path="/withdrawals"
        exact
        render={() => {
          return <WListPage detailPageUrl={order => `/withdrawals/${order}`} />;
        }}
      />
      <ProtectedRoute
        path="/withdrawals/:order"
        render={props => (
          <WDetailPage
            getWithdrawal={order => testData().find(x => x.order === order)}
            {...props}
          />
        )}
      />
    </WithRouter>
  ))
  .add("Transaction Detail Page", () => (
    <WithRouter initialIndex={2}>
      <ProtectedRoute
        path="/withdrawals"
        exact
        render={() => {
          return <WListPage detailPageUrl={order => `/withdrawals/${order}`} />;
        }}
      />
      <ProtectedRoute
        path="/withdrawals/:order"
        render={props => (
          <WDetailPage
            getWithdrawal={order => testData().find(x => x.order === order)}
            transactions={testDataTransactions()}
            {...props}
          />
        )}
      />
    </WithRouter>
  ))
  .add("Payment Verification List Page", () => (
    <WithRouter initialIndex={3}>
      <Route
        path="/payment-verifications"
        exact
        render={props => {
          return (
            <PVerificationListPage
              detailPageUrl={order => `/payment-verifications/${order}`}
              {...props}
            />
          );
        }}
      />
      <Route
        path="/payment-verifications/:order"
        render={props => {
          return <PVerificationDetailPage {...props} />;
        }}
      />
    </WithRouter>
  ))
  .add("Payment Verification Detail Page", () => (
    <WithRouter initialIndex={4}>
      <Route
        path="/payment-verifications"
        exact
        render={props => {
          return (
            <PVerificationListPage
              detailPageUrl={order => `/payment-verifications/${order}`}
              {...props}
            />
          );
        }}
      />
      <Route
        path="/payment-verifications/:order"
        render={props => {
          return <PVerificationDetailPage {...props} />;
        }}
      />
    </WithRouter>
  ))
  .add("Verified Transactions Page", () => (
    <WithRouter initialIndex={5}>
      <Route
        path="/verified-transactions"
        exact
        render={props => {
          return (
            <VTransactionPage
              detailPageUrl={order => `/payment-verifications/${order}`}
              {...props}
            />
          );
        }}
      />
      <Route
        path="/payment-verifications/:order"
        render={props => {
          return <PVerificationDetailPage {...props} />;
        }}
      />
    </WithRouter>
  ));

storiesOf("Components", module)
  .add("ListItem", () => (
    <ListItem
      to="http:/www.google.com"
      heading="N10,000"
      subHeading="james@example.com"
      rightSection="10:00 am"
    />
  ))
  .add("List Group", () => <ListGroup name="December, 12 2018" />)
  .add("Dialog", () => <Dialog modalIsOpen>Are you sure</Dialog>);
