import React, { useEffect } from 'react';
import './Toast.css';
import warningIcon from './warning.svg?react';
import successIcon from './check.svg?react';
import errorIcon from './error.svg?react';
import messageIcon from './message.svg?react';
import brushIcon from './brush.svg?react';

const Toast = ({ message, type = 'info', onClose, duration = 3000 }) => {
    useEffect(() => {
        const timer = setTimeout(() => {
            onClose();
        }, duration);

        return () => clearTimeout(timer);
    }, [duration, onClose]);
    
    const icons = {
        warning: warningIcon,
        success: successIcon,
        error: errorIcon,
        message: messageIcon,
        brush: brushIcon,
    }
    const Icon = icons[type] || null;
    return (
        <div 
            className={`toast-notification toast-${type}`}
            onClick={onClose}
        >
            <Icon className="toast-icon"/>
            <span className="toast-message">{message}</span>
        </div>
    );
};

export default Toast;
