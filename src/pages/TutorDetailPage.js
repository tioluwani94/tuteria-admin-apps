/** @jsx jsx */
import { css, jsx } from "@emotion/core";
import { Flex, Text, Heading, Image, Link } from "@rebass/emotion";
import { DialogButton } from "tuteria-shared/lib/shared/primitives";
import { HomePageSpinner } from "tuteria-shared/lib/shared/primitives/Spinner";
import React from "react";
import {
  ListGroup,
  ListItem,
  DetailItem
} from "tuteria-shared/lib/shared/reusables";
import { DataContext } from "tuteria-shared/lib/shared/DataContext";
import { actions as cActions } from "../appContext";

export const DetailHeader = ({
  image = "https://via.placeholder.com/100",
  detail,
  children
}) => {
  return (
    <Flex>
      <Image src={image} height={100} />
      <Flex
        mb={4}
        flexDirection="column"
        css={css`
          flex: 2;
        `}
      >
        <Text mb={1}>{detail[0]}</Text>
        <Heading fontSize={5}>{detail[1]}</Heading>
        <Text mb={1}>{detail[2]}</Text>
        <Text mb={1}>{detail[3]}</Text>
      </Flex>
      <Flex
        flexDirection="column"
        css={css`
          align-self: center;
        `}
      >
        {children}
      </Flex>
    </Flex>
  );
};
const VerificationItem = ({ label, children, buttons = [] }) => {
  return (
    <Flex py={3} justifyContent="space-between">
      <Flex flexDirection="column">
        {label && (
          <Text fontWeight="bold" pb={3}>
            {label}
          </Text>
        )}
        {children}
      </Flex>
      <Flex>
        {buttons.map((button, index) => (
          <DialogButton mr={index === 0 ? 3 : 0} {...button} />
        ))}
      </Flex>
    </Flex>
  );
};
const actions = {
  EMAIL_VERIFICATION: "email_verification",
  ID_VERIFICATION: "id_verification",
  PROFILE_VERIFICATION: "profile_verification"
};
export class TutorDetailPage extends React.Component {
  static contextType = DataContext;

  state = {
    data: {},
    loading: false,
    record: null,
    email_approval: false,
    id_verified: false,
    profile_rejected: false
  };
  componentDidMount() {
    let {
      match: {
        params: { email, slug }
      },
      history
    } = this.props;
    let { dispatch, actions } = this.context;
    console.log({ email, slug });
    dispatch({
      type: actions.TUTOR_INFO,
      value: { email, slug }
    })
      .then(data => {
        console.log({ data });
        this.setState(data);
      })
      .catch(error => {
        history.push("/tutor-list");
      });
  }
  denyTutor = () => {
    this.setState({ loading: true });
    return this.localDispatch(cActions.DENY_TUTOR).then(data => {
      this.setState({ data, loading: false });
      this.props.history.push("/tutor-list");
    });
  };

  approveTutor = () => {
    this.setState({ loading: true });
    return this.localDispatch(cActions.APPROVE_TUTOR, {
      verified: this.state.data.verified
    }).then(data => {
      this.setState({ data, loading: false, record: null });
    });
  };
  localDispatch = (type, values) => {
    let { dispatch } = this.context;
    return dispatch({
      type,
      value: Boolean(values)
        ? { email: this.state.data.email, ...values }
        : this.state.data.email
    });
  };
  emailButtons = () => {
    let { record, email_approval } = this.state;
    let approveManually = {
      children: "Approve Manually",
      dialogText: "Are you sure you want to manually approve the email",
      confirmAction: () => {
        this.localDispatch(cActions.APPROVE_TUTOR_EMAIL).then(record => {
          this.setState({
            record,

            data: { ...this.state.data, email_verified: true },
            email_approval: true
          });
        });
      }
    };
    let data = email_approval
      ? [approveManually]
      : [
          {
            confirmAction: () => {
              this.localDispatch(cActions.NOTIFY_TUTOR_ABOUT_EMAIL, {
                full_name: this.state.data.full_name
              }).then(record => {
                this.setState({ record });
              });
            },
            dialogText:
              "Are you sure you want to notify the tutor about his email?",
            children:
              record && record.actions.includes(actions.EMAIL_VERIFICATION)
                ? "Send Notice Again"
                : "Send Notice"
          },
          approveManually
        ];
    return data;
  };
  verificationButton = () => {
    let { id_verified, record, data } = this.state;
    if (
      !Boolean(data.identification) ||
      Object.keys(data.identification).length === 0
    ) {
      return [
        {
          children: "Send Email Notice",
          disabled: this.state.id_verified,
          dialogText:
            "Are you sure you want to notify the tutor to upload an ID?",
          confirmAction: () => {
            this.localDispatch(cActions.UPLOAD_ID, {
              full_name: data.full_name
            }).then(record => {
              this.setState({ id_verified: true, record });
            });
          }
        }
      ];
    }
    let reject = {
      children: "Reject",
      dialogText: "You are about to reject the ID of the tutor. Confirm?",
      confirmAction: () => {
        this.localDispatch(cActions.REJECT_ID).then(record => {
          this.setState({
            record,
            data: {
              ...this.state.data,
              identification: {}
            }
          });
        });
      }
    };
    data = id_verified
      ? []
      : [
          {
            confirmAction: () => {
              this.localDispatch(cActions.APPROVE_ID, {
                full_name: this.state.data.full_name
              }).then(record => {
                this.setState({
                  record,
                  id_verified: true,
                  data: {
                    ...this.state.data,
                    identification: {
                      ...this.state.data.identification,
                      verified: true
                    }
                  }
                });
              });
            },
            dialogText: "Are you sure you want to approve the ID?",
            children:
              record && record.actions.includes(actions.ID_VERIFICATION)
                ? "Approve Again"
                : "Approve ID"
          },
          reject
        ];
    return data;
  };
  profilePicButton = () => {
    let result = [];
    let { record, data } = this.state;
    if (!Boolean(data.profile_pic)) {
      result.push({
        children: "Send Notice",
        disabled: this.state.profile_rejected,
        dialogText:
          "Are you sure you want to notify the tutor to upload a profile Pic?",
        confirmAction: () => {
          this.localDispatch(cActions.UPLOAD_PROFILE_PIC, {
            full_name: data.full_name
          }).then(() => {
            this.setState({ profile_rejected: true });
          });
        }
      });
    } else {
      if (record && record.actions.includes(actions.PROFILE_VERIFICATION)) {
        result.push({
          children: "Approve",
          disabled: this.state.profile_rejected,
          confirmAction: () => {
            this.localDispatch(cActions.APPROVE_PROFILE_PIC).then(() => {
              this.setState({ profile_rejected: true });
            });
          },
          dialogText:
            "Are you sure you want to approve the profilePic for the tutor?"
        });
      }
      result.push({
        children: "Reject",
        disabled: this.state.profile_rejected,
        confirmAction: () => {
          this.localDispatch(cActions.REJECT_PROFILE_PIC, {
            full_name: this.state.data.full_name
          }).then(() => {
            this.setState({ profile_rejected: true });
          });
        },
        dialogText:
          "Are you sure you want to delete the profilePic for the tutor?"
      });
    }
    return result;
  };
  idVerified(data = {}, force = false) {
    return force
      ? Boolean(data.verified)
      : Object.keys(data).length > 0
      ? data.verified
      : true;
  }
  render() {
    let { data } = this.state;
    console.log(data.profile_pic);
    return Object.keys(data).length === 0 ? (
      <HomePageSpinner />
    ) : (
      <Flex flexDirection="column">
        <DetailHeader
          image={data.profile_pic}
          detail={[
            data.years_of_experience,
            data.full_name,
            data.email,
            data.phone_no
          ]}
        >
          {this.idVerified(data.identification, true) && (
            <Text>Id Verified</Text>
          )}
          {data.email_verified && <Text>Email Verified</Text>}
          <Text>Social Veifications</Text>
        </DetailHeader>
        <Flex mb={4} flexDirection="column">
          <ListGroup name="Verifications" />
          {data.email_verified ? null : (
            <VerificationItem
              buttons={this.emailButtons()}
              label="Email Verification"
            />
          )}
          {this.idVerified(data.identification, true) ? null : (
            <VerificationItem
              label="ID Verifications"
              buttons={this.verificationButton()}
            >
              {data.identification ? (
                <Link
                  css={css`
                    cursor: pointer;
                  `}
                  target="_blank"
                  href={data.identification.link}
                >
                  {data.identification.link}
                </Link>
              ) : null}
            </VerificationItem>
          )}
          <VerificationItem
            label="Profile Picture Approval"
            buttons={this.profilePicButton()}
          >
            <Link
              css={css`
                cursor: pointer;
              `}
              target="_blank"
              href={`http://www.google.com`}
            >
              http://ww.google.com
            </Link>
          </VerificationItem>

          <ListGroup name="Tutor Description" />
          <Text p={3}>{data.tutor_description}</Text>
          <ListGroup name="Educations" />
          {data.educations.map(education => (
            <ListItem
              key={education.school}
              heading={education.school}
              subHeading={education.course}
              rightSection={education.degree}
            />
          ))}
          <ListGroup name="Work Experience" />
          {data.work_experiences.map(w_experience => (
            <ListItem
              key={w_experience.name}
              heading={w_experience.name}
              subHeading={w_experience.role}
            />
          ))}
          <ListGroup name="Location" />
          {data.locations.map(location => (
            <ListItem
              key={location.state}
              heading={`${location.address} ${location.vicinity}, ${
                location.state
              }`}
            />
          ))}
          <ListGroup name="Subject Veluation Dump" />
          <Flex>
            <Flex
              css={css`
                flex: 1;
              `}
              flexDirection="column"
            >
              <Heading>Potential Subjects</Heading>
              {data.potential_subjects.map(subject => (
                <DetailItem key={subject} label={subject} />
              ))}
              <Heading>Levels With Exam</Heading>
              {JSON.stringify(data.levels_with_exam)}
              <Heading>Answers</Heading>
              {JSON.stringify(data.answers)}
            </Flex>
            <Flex
              css={css`
                flex: 1;
              `}
              flexDirection="column"
            >
              <Heading>Classes</Heading>
              {data.classes.map(klass => (
                <DetailItem key={klass} label={klass} />
              ))}
              <Heading>Curriculum Used</Heading>
              {data.curriculum_used.map(klass => (
                <DetailItem key={klass} label={klass} />
              ))}
            </Flex>
          </Flex>
          {data.currriculum_explanation ? (
            <>
              <Heading>Curriculum Explanation</Heading>
              <Text p={3}>{data.currriculum_explanation}</Text>
            </>
          ) : null}
          <Flex justifyContent="space-between" pt={3}>
            {!data.verified ||
              (Boolean(this.state.record) &&
                Object.keys(this.state.record).length > 0 && (
                  <DialogButton
                    dialogText="Are you sure you want to approve this tutor"
                    confirmAction={this.approveTutor}
                    disabled={this.state.loading}
                  >
                    {!data.verified ? `Approve Tutor` : `Remove from List`}
                  </DialogButton>
                ))}
            <DialogButton
              dialogText="Are you sure you want to deny this tutor?"
              confirmAction={this.denyTutor}
              disabled={this.state.loading}
            >
              Deny Tutor
            </DialogButton>
          </Flex>
        </Flex>
      </Flex>
    );
  }
}

export default TutorDetailPage;
