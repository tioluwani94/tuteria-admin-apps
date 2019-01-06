import React from "react";

import { storiesOf } from "@storybook/react";
import { action } from "@storybook/addon-actions";
import { linkTo } from "@storybook/addon-links";
import LoginPage from "tuteria-shared/lib/shared/LoginPage";
import SListPage from "../pages/SListPage";

import { MemoryRouter as Router, Route, Switch } from "react-router";
import { testData, testDataTransactions } from "../adapters/test_data";
import devAdapter from "../adapters/dev";
import WithRouter from "tuteria-shared/lib/shared/PageSetup";
import testServerAdapter from "../adapters/test";
import paymentContext from "../paymentContext";
import appFirebase from "../adapters/backupFirebase";

import { Button, Welcome } from "@storybook/react/demo";

const RouterWrapper = ({ children, initialIndex = 0, test = true }) => {
  return (
    <WithRouter
      test={test}
      RouterComponent={Router}
      routerProps={{
        initialEntries: ["/requests"],
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
storiesOf("Sales and Customer Success Application", module).add(
  "SListPage",
  () => (
    <RouterWrapper>
      <Route
        path="/requests"
        exact
        render={props => {
          return (
            <SListPage
              {...props}
              detailPageUrl={order => `/requests/${order}/transactions`}
            />
          );
        }}
      />
    </RouterWrapper>
  )
);
