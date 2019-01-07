import React from "react";

import { storiesOf } from "@storybook/react";
import { action } from "@storybook/addon-actions";
import { linkTo } from "@storybook/addon-links";

import { Button, Welcome } from "@storybook/react/demo";
import LoginPage from "../shared/LoginPage";
import PVerificationDetailPage from "../pages/PVerificationDetailPage";
import { MemoryRouter as Router, Route, Switch } from "react-router";
import { Dialog } from "tuteria-shared/lib/shared/primitives/Modal";
import { testData, testDataTransactions } from "../adapters/test_data";
import devAdapter from "../adapters/dev";
import WithRouter from "tuteria-shared/lib/shared/PageSetup";
import testServerAdapter from "../adapters/test";
import paymentContext from "../paymentContext";
import appFirebase from "../adapters/backupFirebase";
import { RequestDetailPage } from "../pages/RequestDetailsPage";
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
storiesOf("Sales Application", module)
  .add("SListPage", () => (
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
//   .add("SDetailPage", () => (
//     <RouterWrapper initialIndex={4}>
//       <Route
//         path="/payment-verifications/:order"
//         render={props => {
//           return <PVerificationDetailPage {...props} />;
//         }}
//       />
//     </RouterWrapper>
//   ))
  .add("SDetailPage", () => (
    <RequestDetailPage/>
  ))
