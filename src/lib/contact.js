import { EMAIL } from './constants';

const MOBILE_UA = /iPhone|iPad|iPod|Android/i;

export const isMobileDevice = () =>
  typeof navigator !== 'undefined' && MOBILE_UA.test(navigator.userAgent);

// Phones/tablets open the mail app; desktops open Gmail's compose window.
export const getEmailHref = () =>
  isMobileDevice()
    ? `mailto:${EMAIL}`
    : `https://mail.google.com/mail/?view=cm&fs=1&to=${EMAIL}`;
