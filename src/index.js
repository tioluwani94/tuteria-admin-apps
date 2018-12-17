/** @jsx jsx */
import { css, jsx } from "@emotion/core";
import React from "react";
import ReactDOM from "react-dom";
import { Flex } from "@rebass/emotion";
import { Route, Redirect, Link } from "react-router-dom";
import ProtectedRoute from "./shared/ProtectedRoute";
import WithRouter from "./shared/PageSetup";

const TutorDetailPage = React.lazy(() => import("./pages/TutorDetailPage"));
const WDetailPage = React.lazy(() => import("./pages/WDetailPage"));
const WListPage = React.lazy(() => import("./pages/WListPage"));
const PVerificationDetailPage = React.lazy(() =>
  import(`./pages/PVerificationDetailPage`)
);
const TutorListPage = React.lazy(() => import(`./pages/TutorListPage`));
const WorkingSection = React.lazy(() => import(`./pages/WorkingSection`));
const VTransactionPage = React.lazy(() => import(`./pages/VTransactionPage`));
const PVerificationListPage = React.lazy(() =>
  import(`./pages/PVerificationListPage`)
);

function App() {
  return (
    <WithRouter
      heading={
        <Flex
          pb={3}
          justifyContent="space-between"
          css={css`
            flex-wrap: wrap;
            > a {
              padding-right: 10px;
              padding-bottom: 10px;
            }
          `}
        >
          <Link to="/tutor-list">Tutor List Page</Link>
          <Link to="/payment-verifications">Verification List Page</Link>
          <Link to="/withdrawals">Withdrawal List Page</Link>
          <Link to="/verified-transactions">Verified Transactions Page</Link>
          <Link to="/tutor-working-section">Working Section</Link>
        </Flex>
      }
    >
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
      <Route
        path="/tutor-list"
        exact
        render={props => (
          <TutorListPage detailPageUrl={slug => `/tutor-list/${slug}`} />
        )}
      />
      <Route path="/tutor-list/:slug" component={TutorDetailPage} />
      <Route
        path="/tutor-working-section"
        render={props => (
          <WorkingSection
            {...props}
            detailPageUrl={slug => `/worked-records/${slug}?email=true`}
          />
        )}
      />
      <Route path="/worked-records/:email" component={TutorDetailPage} />
      <Redirect to="/tutor-list" />
    </WithRouter>
  );
}

const rootElement = document.getElementById("root");
ReactDOM.render(<App />, rootElement);
