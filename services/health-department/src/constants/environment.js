export const IS_DEV = process.env.NODE_ENV === 'development';
export const API_PATH = process.env.REACT_APP_API_PATH || '/api';

export const HOSTNAME = window.location.origin;

// Styles
export const MOBILE_BREAKPOINT = 600;
export const IS_MOBILE = window.innerWidth <= MOBILE_BREAKPOINT;
