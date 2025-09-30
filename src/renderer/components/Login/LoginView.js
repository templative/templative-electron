import React from "react";
import "./LoginView.css";
const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
import Logo from "../logo.svg?react";
import GetEmailAndRequestCode from "./GetEmailAndRequestCode";
import InputCode from "./InputCode";

export default class LoginView extends React.Component {
  state = {
    email: '',
    showCodeInput: false,
    status: '',
  };

  async componentDidMount() {
    try {
      const { ipcRenderer } = require('electron');
      const { channels } = require('../../../shared/constants');
      const last = await ipcRenderer.invoke(channels.TO_SERVER_GET_LAST_USED_EMAIL);
      if (last && typeof last === 'string') {
        this.setState({ email: last });
      }
    } catch (e) {
      // ignore
    }
  }

  updateEmail = (email) => {
    this.setState({ email, status: '' });
  };

  clearStatus = () => {
    if (this.state.status) {
      this.setState({ status: '' });
    }
  }

  // Step 1: Send login code to email
  attemptSendCode = async () => {
    const { sendLoginCodeCallback } = this.props;
    const { email } = this.state;
    if (!emailPattern.test(email)) {
      this.setState({ status: 'Please enter a valid email address.' });
      return { success: false, error: 'invalid-email' };
    }
    try {
      // persist last used email
      try {
        const { ipcRenderer } = require('electron');
        const { channels } = require('../../../shared/constants');
        await ipcRenderer.invoke(channels.TO_SERVER_SET_LAST_USED_EMAIL, email);
      } catch (_) {}

      const result = await sendLoginCodeCallback(email);
      if (result && result.success !== false) {
        this.setState({ showCodeInput: true, status: '' });
        return result;
      } else {
        const errorMsg = (result && result.error) || 'Failed to send login code';
        this.setState({ status: errorMsg });
        return result || { success: false, error: errorMsg };
      }
    } catch (err) {
      this.setState({ status: 'Failed to send login code' });
      return { success: false, error: 'request-failed' };
    }
  };

  // Step 2: Verify the code
  attemptVerifyCode = async (code) => {
    const { verifyLoginCodeCallback } = this.props;
    const { email } = this.state;
    try {
      const result = await verifyLoginCodeCallback(email, code);
      if (result && result.success === false && result.error) {
        this.setState({ status: result.error });
      }
    } catch (err) {
      this.setState({ status: 'Invalid or expired code' });
    }
  };

  resendCode = async () => {
    const result = await this.attemptSendCode();
    if (result && result.success !== false) {
      this.setState({ status: 'New Code Sent' });
    }
  };

  goBackToEmail = () => {
    this.setState({ showCodeInput: false, status: '' });
  }

  render() {
    const { loginStatus, clickRegisterCallback } = this.props;
    const { email, showCodeInput, status } = this.state;

    return (
      <div className="login-view" data-bs-theme="dark">
        <div className="welcome-modal">
          <div className="d-grid gap-2">
            <Logo className="login-logo" />
            {!showCodeInput ? (
              <GetEmailAndRequestCode
                email={email}
                loginStatus={status || loginStatus}
                updateEmailCallback={this.updateEmail}
                attemptSendCodeCallback={this.attemptSendCode}
                  clearStatusCallback={this.clearStatus}
                clickRegisterCallback={clickRegisterCallback}
              />
            ) : (
              <InputCode
                loginStatus={status || loginStatus}
                email={email}
                attemptLoginCallback={this.attemptVerifyCode}
                resendCodeCallback={this.resendCode}
                onBack={this.goBackToEmail}     
                  clearStatusCallback={this.clearStatus}
              />
            )}
          </div>
        </div>
      </div>
    );
  }
}