import React from "react";

import { storiesOf } from "@storybook/react";
import { action } from "@storybook/addon-actions";
import { linkTo } from "@storybook/addon-links";
import LoginPage from "../../tutor-verification-app/src/shared/LoginPage";
import TutorListPage from "../../../tutor-verification-app/src/pages/TutorListPage";


import { Button, Welcome } from "@storybook/react/demo";
import TutorDetailPage from "../../../tutor-verification-app/src/pages/TutorDetailPage";

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
    // <DataProvider
    //   test={test}
    //   // adapter={testServerAdapter}
    //   adapter={devAdapter}
    //   authenticateUser={token => new Promise(resolve => resolve(true))}
    // >
    <Router
      initialEntries={[
        "/withdrawals",
        "/withdrawals/1004/transactions",
        "/withdrawals/1004/transactions/AA102"
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
    // </DataProvider>
  );
};
storiesOf("Pages", module)
  .add("Tutor List Page", () => <TutorListPage />)
  .add("Tutor Detail Page", () => <TutorDetailPage />);
