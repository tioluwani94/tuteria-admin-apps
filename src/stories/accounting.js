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
import { MemoryRouter as Router, Route, Switch } from "react-router";
import { Dialog } from "tuteria-shared/lib/shared/primitives/Modal";
import { testData, testDataTransactions } from "../adapters/test_data";
import devAdapter from "../adapters/dev";
import WithRouter from "tuteria-shared/lib/shared/PageSetup";
import testServerAdapter from "../adapters/test";
import paymentContext from "../paymentContext";
import appFirebase from "../adapters/backupFirebase";
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

const RouterWrapper = ({ children, initialIndex = 0, test = true }) => {
  return (
    <WithRouter
      test={test}
      RouterComponent={Router}
      routerProps={{
        initialEntries: [
          "/withdrawals",
          "/withdrawals/1004/transactions",
          "/withdrawals/1004/transactions/AA102",
          "/payment-verifications",
          "/payment-verifications/RSET323",
          "/verified-transactions",
          "unverified-withdrawals"
        ],
        initialIndex
      }}
      adapter={devAdapter}
      context={paymentContext}
      firebase={appFirebase}
    >
      {children}
    </WithRouter>
  );
};
storiesOf("Accounting Application", module)
  .add("PVerificationListPage", () => (
    <RouterWrapper initialIndex={3}>
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
    </RouterWrapper>
  ))
  .add("PVerificationDetailPage", () => (
    <RouterWrapper initialIndex={4}>
      <Route
        path="/payment-verifications/:order"
        render={props => {
          return <PVerificationDetailPage {...props} />;
        }}
      />
    </RouterWrapper>
  ))
  .add("VTransactionPage", () => null)
  .add("WDetailPage", () => (
    <RouterWrapper initialIndex={1}>
      <Route
        path="/withdrawals"
        exact
        render={props => {
          return (
            <WListPage
              {...props}
              detailPageUrl={order => `/withdrawals/${order}/transactions`}
            />
          );
        }}
      />
      <Route path="/withdrawals/:order" component={WDetailPage} />
    </RouterWrapper>
  ))
  .add("WListPage", () => (
    <RouterWrapper>
      <Route
        path="/withdrawals"
        exact
        render={props => {
          return (
            <WListPage
              {...props}
              detailPageUrl={order => `/withdrawals/${order}/transactions`}
            />
          );
        }}
      />
    </RouterWrapper>
  ));
