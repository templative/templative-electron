import React, { useState } from "react";


// Ok, so my electron react app requests that my flask server begin the oauth process. The flask app uses my client id to create a login page for google that when successful sends an code to my oauth callback endpoint. The callback uses the code to get the id_token, which it uses to pull the users email. We check that the email exists and that the password checks out. If it does, then we generate a temporary login token for that user, and pass the token and email to my electron app using `templative://authorize?token={tempToken}&email={email}`. Our app's deep links intercept this, save the token and email to a safe session store, and consider us logged in.
const InputCode = ({
    loginStatus,
    email,
    attemptLoginCallback,
    resendCodeCallback,
    onBack,
    clearStatusCallback,
}) => {
    const [code, setCode] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const emailParts = email.split("@")
    const emailName = emailParts[0]
    const emailDomain = emailParts[1]
    const asterisks = "*".repeat(Math.max(1, emailName.length - 2));
    const hiddenEmail = `${emailName[0]}${asterisks}${emailName[emailName.length - 1]}@${emailDomain}`

    const sanitizeCode = (value) => value.replace(/\D/g, '').slice(0, 6);

    const submitIfReady = async (value) => {
        const sanitized = sanitizeCode(value);
        if (sanitized.length !== 6 || isSubmitting) return;
        setIsSubmitting(true);
        try {
            await Promise.resolve(attemptLoginCallback(sanitized));
        } finally {
            setIsSubmitting(false);
        }
    };

    const handlePaste = async (e) => {
        const pastedText = e.clipboardData?.getData('text') || '';
        const sanitized = sanitizeCode(pastedText);
        // Update field immediately with sanitized paste
        setCode(sanitized);
        // Auto-submit if 6 digits
        if (sanitized.length === 6) {
            e.preventDefault();
            await submitIfReady(sanitized);
        }
    };

    const handleKeyDown = async (e) => {
        if (e.key === 'Enter') {
            await submitIfReady(code);
        }
    };
    return (
        <>
            <p className="input-code-instructions">Enter the 6-digit code sent to your at {hiddenEmail}.</p>
            <p className="login-input-label">Code</p>
            <div className="input-group input-group-sm" data-bs-theme="dark">
                <input
                  type="text"
                  className="form-control no-left-border"
                  placeholder="123456"
                  value={code}
                  onChange={(e) => { setCode(sanitizeCode(e.target.value)); clearStatusCallback?.(); }}
                  onPaste={handlePaste}
                  onKeyDown={handleKeyDown}
                />
            </div>
            
            
            <button
                className="btn btn-primary"
                disabled={isSubmitting || !code || code.length !== 6}
                onClick={async () => { clearStatusCallback?.(); await submitIfReady(code); }}
            >
                {isSubmitting ? 'Submitting…' : 'Submit'}
            </button>
            
            <p><span className="back-link" onClick={() => { clearStatusCallback?.(); resendCodeCallback(); }}>Resend Code</span> <span className="back-link" onClick={() => { clearStatusCallback?.(); onBack(); }}>Back</span></p>
            <p className="login-status">
                {loginStatus}
            </p>

        </>
    );
};

export default InputCode;