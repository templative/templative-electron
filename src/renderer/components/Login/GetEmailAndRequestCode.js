import React, { useState } from "react";
const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Ok, so my electron react app requests that my flask server begin the oauth process. The flask app uses my client id to create a login page for google that when successful sends an code to my oauth callback endpoint. The callback uses the code to get the id_token, which it uses to pull the users email. We check that the email exists and that the password checks out. If it does, then we generate a temporary login token for that user, and pass the token and email to my electron app using `templative://authorize?token={tempToken}&email={email}`. Our app's deep links intercept this, save the token and email to a safe session store, and consider us logged in.
const GetEmailAndRequestCode = ({
  email,
  loginStatus,
  updateEmailCallback,
  attemptSendCodeCallback,
  clearStatusCallback,
  clickRegisterCallback,
}) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const googleLogin = async () => {
    try {
      const { ipcRenderer } = require('electron');
      const { channels } = require('../../../shared/constants');
      await ipcRenderer.invoke(channels.TO_SERVER_GOOGLE_LOGIN);
    } catch (error) {
      console.error('LoginView: Google login failed:', error);
    }
  };

  const isEmailValid = emailPattern.test(email);

  const sanitizeEmail = (value) => value.trim();

  const submitIfReady = async (value) => {
    const nextEmail = sanitizeEmail(value ?? email);
    if (!emailPattern.test(nextEmail) || isSubmitting) return;
    setIsSubmitting(true);
    try {
      // Ensure parent state gets updated before submit when triggered from paste
      if (nextEmail !== email) {
        updateEmailCallback(nextEmail);
        await new Promise((resolve) => setTimeout(resolve, 0));
      }
      await Promise.resolve(attemptSendCodeCallback());
    } finally {
      setIsSubmitting(false);
    }
  };

  const handlePaste = async (e) => {
    const pastedText = e.clipboardData?.getData('text') || '';
    const sanitized = sanitizeEmail(pastedText);
    updateEmailCallback(sanitized);
    if (emailPattern.test(sanitized)) {
      e.preventDefault();
      await submitIfReady(sanitized);
    }
  };

  const handleKeyDown = async (e) => {
    if (e.key === 'Enter') {
      await submitIfReady();
    }
  };

    const emailIcon = (
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-person-circle" viewBox="0 0 16 16">
            <path d="M11 6a3 3 0 1 1-6 0 3 3 0 0 1 6 0"/>
            <path fillRule="evenodd" d="M0 8a8 8 0 1 1 16 0A8 8 0 0 1 0 8m8-7a7 7 0 0 0-5.468 11.37C3.242 11.226 4.805 10 8 10s4.757 1.225 5.468 2.37A7 7 0 0 0 8 1"/>
        </svg>
    );

    return (
        <>
            <p>Log in to Templative</p>
            <button onClick={googleLogin} className="btn btn-outline-primary google-login-button">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-google google-login-icon" viewBox="0 0 16 16">
                    <path d="M15.545 6.558a9.4 9.4 0 0 1 .139 1.626c0 2.434-.87 4.492-2.384 5.885h.002C11.978 15.292 10.158 16 8 16A8 8 0 1 1 8 0a7.7 7.7 0 0 1 5.352 2.082l-2.284 2.284A4.35 4.35 0 0 0 8 3.166c-2.087 0-3.86 1.408-4.492 3.304a4.8 4.8 0 0 0 0 3.063h.003c.635 1.893 2.405 3.301 4.492 3.301 1.078 0 2.004-.276 2.722-.764h-.003a3.7 3.7 0 0 0 1.599-2.431H8v-3.08z"/>
                </svg>
                Login with Google
            </button>
            <hr />
            <p className="login-input-label">Email</p>
            <div className="input-group input-group-sm" data-bs-theme="dark">
                <span className="input-group-text soft-label" id="basic-addon3">{emailIcon}</span>
                <input
                    type="email"
                    className="form-control no-left-border"
                    placeholder="john-smith@mail.com"
                    value={email}
                    onChange={(e) => { updateEmailCallback(e.target.value); clearStatusCallback?.(); }}
                    onPaste={handlePaste}
                    onKeyDown={handleKeyDown}
                />
            </div>
            
            <button
                className="btn btn-primary"
                disabled={!isEmailValid || isSubmitting}
                onClick={() => { clearStatusCallback?.(); submitIfReady(); }}
            >
                {isSubmitting ? 'Sending…' : 'Continue'}
            </button>
            
            <p className="need-templative-account">
                Need a Templative account? <span className="register-now" onClick={clickRegisterCallback}>Register now</span>.
            </p>
            <p className="login-status">
                {loginStatus}
            </p>
        </>
    );
};

export default GetEmailAndRequestCode;