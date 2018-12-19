/** @jsx jsx */
import { css, jsx } from "@emotion/core";
import React from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import DataProvider from "./DataProvider";
import Spinner from "tuteria-shared/lib/shared/primitives/Spinner";
import { DataContext } from "tuteria-shared/lib/shared/DataContext";
import LoginPage from "./LoginPage";
import appFireBase from "../adapters/backupFirebase";
export const WithRouter = ({
  heading,
  children,
  adapter,
  firebase,
  context,
  toNextPage = () => {},
  test = true
}) => {
  return (
    <DataProvider
      test={test}
      // adapter={testServerAdapter}
      adapter={adapter}
      context={context}
      appFirebase={firebase || appFireBase}
      authenticateUser={token => new Promise(resolve => resolve(true))}
    >
      <React.Suspense fallback={<Spinner />}>
        <Router>
          <>
            {heading}
            <Switch>
              {" "}
              <Route
                path="/login"
                render={props => {
                  return (
                    <DataContext.Consumer>
                      {({ dispatch, actions }) => {
                        return (
                          <LoginPage
                            login={props =>
                              dispatch({
                                type: actions.LOGIN_USER,
                                value: props
                              })
                            }
                            toNextPage={() => {
                              toNextPage(props);
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
          </>
        </Router>
      </React.Suspense>
    </DataProvider>
  );
};

export default WithRouter;
