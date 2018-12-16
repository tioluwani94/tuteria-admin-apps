/** @jsx jsx */
import React from "react";
import styled from "@emotion/styled";
import { Global, css, jsx } from "@emotion/core";
import ReactModal from "react-modal";
import { Button } from ".";

import { Box, Flex, Button as EButton, Text, Link } from "@rebass/emotion";
import "./modal.css";

const xs = 768;

export const ModalFooter = props => {
  const {
    children,
    modalAction,
    onClose,
    style,
    buttonType,
    is,
    showSpinner,
    buttonClass = "primary"
  } = props;
  return (
    <div className="modal-footer" style={style}>
      <div className="row">
        <Flex justifyContent="space-between">
          <Button
            type={"button"}
            onClick={onClose}
            buttonClass={"btn faint-gray-button capitalize"}
          >
            Cancel
          </Button>
          <Button
            type={buttonType || "submit"}
            is={is}
            showSpinner={showSpinner}
            onClick={modalAction}
            buttonClass={`btn  ${buttonClass} capitalize`}
          >
            {children}
          </Button>
        </Flex>
      </div>
    </div>
  );
};

export const ModalContainer = props => (
  <div className="modal-backdrop">
    <div className={props.modalClass}>{props.children}</div>
  </div>
);

export const ModalHeader = props => (
  <div className="modal-header">
    <div className="row">
      <div className="col-80">
        <h3 className={"modal-title"}>{props.children}</h3>
      </div>
      <div className="col-20" style={{ paddingRight: 0 }}>
        <button className="modal-close" onClick={props.onClose}>
          <i className="ion ion-android-close" />
        </button>
      </div>
    </div>
  </div>
);

export const ModalContent = props => (
  <div className="modal-body">{props.children}</div>
);
export const Modal = styled(ReactModal)`
  position: absolute;
  max-width: ${props => props.modalWidth}px;
  top: ${props => props.gutter}rem;
  left: 0;
  right: 0;
  margin: auto;
  margin-bottom: ${props => props.gutter}rem;
  border: 1px solid #ccc;
  background: #fff;
  overflow-scrolling: touch;
  border-radius: 4px;
  outline: none;
  padding: 0;
  &.login {
  }
  & .modal-header {
    position: relative;
    & h2 {
      margin-top: 0;
    }
  }
  ${props =>
    css`
      ${props.css};
    `};
`;

class ImageModal extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      height: null
    };
    this.node = null;
  }
  toggleHeight = height => {
    this.setState({ height });
  };
  render() {
    const {
      backgroundColor = "rgba(71, 82, 93, 0.7)",
      heading,
      headingCss,
      buttonText = "Submit",
      hideFooter = false
    } = this.props;
    return (
      <Modal
        className={"modal-dialog small"}
        css={this.props.css || ""}
        gutter={this.props.gutter}
        isOpen={this.props.showModal}
        onRequestClose={this.props.handleCloseModal}
        contentLabel="Minimal Modal Example"
        modalWidth={this.props.width}
        closeTimeoutMS={100}
        ariaHideApp={false}
        style={{
          overlay: {
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            overflowY: "auto",
            backgroundColor,
            zIndex: 9999
          }
        }}
      >
        <Global
          style={css`
                .ReactModalPortal > div {
            // opacity: 0;
            .ReactModal__Content{
              transform: scale(.9) translate3d(0,0,0);
            }
        }
        
        .ReactModalPortal .ReactModal__Overlay {
          transition: opacity 200ms ease-in-out;
          background: rgba(0, 0, 0, 0.15);
          & .ReactModal__Content{
            transition: transform .6s cubic-bezier(0,0,0,1);
              /* @media(max-width: ${xs}px){
                margin-left: 24px;
                margin-right: 24px;
              } */
          }
          &--after-open {
            opacity: 1;
            & .ReactModal__Content {
              &--after-open {
                transform: scale(1) translate3d(0,0,0);
        
                @media (max-width: 420px) {
                      min-height: 100vh;
                      position: absolute;
                      top: 0;
                      left: 0;
                      right: 0;
                      bottom: 0;
                      padding: 0;
                      margin: 0;
                      border-radius: 0;
                      border: 0;
                      overflow: auto;
                }
              }
        
            }
          }
          &--before-close {
              opacity: 0;
          }
        }
        
        `}
        />
        {heading && (
          <ModalHeader onClose={this.props.handleCloseModal}>
            {heading}
          </ModalHeader>
        )}
        <ModalContent>
          <Flex
            width={1}
            css={css`
              align-items: center;
            `}
          >
            <Text pb={4} fontSize={4}>
              {this.props.children}
            </Text>
          </Flex>
          {!hideFooter && (
            <ModalFooter
              buttonClass={this.props.buttonClass}
              onClose={this.props.handleCloseModal}
              modalAction={this.props.action}
            >
              {buttonText}
            </ModalFooter>
          )}
        </ModalContent>
      </Modal>
    );
  }
}
export const Dialog = ({
  modalIsOpen,
  close,
  children,
  buttonText,
  action
}) => {
  return (
    <ImageModal
      width={45}
      gutter={4}
      showModal={modalIsOpen}
      handleCloseModal={close}
      buttonClass={"red"}
      buttonText={buttonText}
      action={action}
    >
      {children}
    </ImageModal>
  );
};

export class DialogButton extends React.Component {
  state = {
    confirm: false
  };
  confirmAction = () => {
    this.props.confirmAction();
    this.setState({ confirm: false });
  };
  render() {
    let { dialogText, ...rest } = this.props;
    return (
      <>
        <Button
          {...rest}
          onClick={() => {
            this.setState({ confirm: true });
          }}
        />
        <Dialog
          modalIsOpen={this.state.confirm}
          close={() => {
            this.setState({ confirm: false });
          }}
          action={this.confirmAction}
        >
          {dialogText}
        </Dialog>
      </>
    );
  }
}
export default ImageModal;
