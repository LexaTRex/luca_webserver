export const IS_DEV = process.env.NODE_ENV === 'development';
export const API_PATH = process.env.REACT_APP_API_PATH || '/api';

export const HOSTNAME = window.location.origin;

export const HEALTH_DEPARTMENT_SUPPORT_PHONE_NUMBER =
  process.env.REACT_APP_SUPPORT_PHONE_NUMBER || 'unknown';
export const HEALTH_DEPARTMENT_SUPPORT_EMAIL =
  process.env.REACT_APP_SUPPORT_EMAIL || 'unknown';

// Styles
export const MOBILE_BREAKPOINT = 600;
export const IS_MOBILE = window.innerWidth <= MOBILE_BREAKPOINT;
