/** @jsx jsx */
import { css, jsx } from "@emotion/core";
import { Box, Flex, Card, Text } from "@rebass/emotion";
import { Button } from "./primitives";
import React from "react";

export const Input = ({
  label,
  type = "text",
  value,
  onChange,
  isValid,
  ...rest
}) => {
  return (
    <Flex
      flexDirection="column"
      py={3}
      css={css`
        label {
          padding-bottom: 8px;
          font-weight: bold;
          text-transform: capitalize;
        }
        input {
          border-color: ${isValid ? "" : "red"};
          line-height: 24px;
          height: 24px;
          padding: 4px;
        }
      `}
    >
      <label htmlFor={rest.name}>{label}</label>
      <input {...{ type, value, onChange, ...rest }} />
    </Flex>
  );
};

export class LoginPage extends React.Component {
  state = {
    fields: {
      email: "",
      password: ""
    },
    loading: false,
    toggleError: false,
    errors: {}
  };
  onChange = field => {
    return e => {
      this.setState({
        fields: { ...this.state.fields, [field]: e.target.value }
      });
    };
  };
  isValid = (toggleError, field) => {
    let { fields, errors } = this.state;
    return toggleError
      ? Boolean(fields[field]) && Boolean(errors[field]) === false
      : true;
  };
  setDefaultErrors = fields => {
    let errors = {};
    if (!Boolean(fields.email)) {
      errors.email = "The email field is required";
    }
    if (!Boolean(fields.password)) {
      errors.password = "The  password field is required";
    }
    this.setState({ toggleError: true, errors });
  };
  onSubmit = e => {
    let { fields } = this.state;
    e.preventDefault();
    this.setState({ errors: {} });
    let isValid = Object.keys(fields).every(field => this.isValid(true, field));
    if (isValid) {
      this.setState({ loading: true });
      this.props
        .login(fields)
        .then(
          data => {
            this.props.toNextPage();
          },
          errors => {
            console.log(errors);
            this.setState({ toggleError: true, loading: false, errors });
          }
        )
        .catch(errors => {
          console.log(errors);
          this.setState({ toggleError: true, loading: false, errors });
        });
    } else {
      this.setDefaultErrors(fields);
    }
  };
  render() {
    let { fields } = this.state;
    return (
      <Box mx={"auto"} mt={6} width={1 / 3}>
        <form onSubmit={this.onSubmit}>
          {Object.keys(this.state.errors).length > 0 ? (
            <Card>
              {Object.keys(this.state.errors).map(error => (
                <Text>{this.state.errors[error]}</Text>
              ))}
            </Card>
          ) : null}
          <Input
            label="email"
            value={fields.email}
            type="email"
            onChange={this.onChange("email")}
            isValid={this.isValid(this.state.toggleError, "email")}
          />
          <Input
            label="password"
            value={fields.password}
            type="password"
            onChange={this.onChange("password")}
            isValid={this.isValid(this.state.toggleError, "password")}
          />
          <Button disabled={this.state.loading} width={1} type="submit">
            Login
          </Button>
        </form>
      </Box>
    );
  }
}

export default LoginPage;
