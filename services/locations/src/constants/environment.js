export const IS_DEV = process.env.NODE_ENV === 'development';
export const API_PATH = process.env.REACT_APP_API_PATH || '/api';

// Styles
export const MOBILE_BREAKPOINT = 720;
export const TABLET_BREAKPOINT = 992;
export const MAX_MOBILE_BREAKPOINT = 450;
export const IS_MOBILE = window.innerWidth <= MOBILE_BREAKPOINT;
