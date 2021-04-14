export const AUTHENTICATION_ROUTE = '/';
export const FORGOT_PASSWORD_ROUTE = '/forgotPassword';
export const RESET_PASSWORD_ROUTE = '/resetPassword/:requestId';
export const APP_ROUTE = '/app';
export const LICENSES_ROUTE = `/licenses`;

export const BASE_GROUP_ROUTE = `${APP_ROUTE}/group/`;

export const BASE_LOCATION_ROUTE = '/location/';
export const GROUP_ROUTE = `${BASE_GROUP_ROUTE}:groupId`;
export const LOCATION_ROUTE = `${BASE_GROUP_ROUTE}:groupId${BASE_LOCATION_ROUTE}:locationId`;

export const GROUP_SETTINGS_ROUTE = `${APP_ROUTE}/group/settings/:groupId`;
export const BASE_GROUP_SETTINGS_ROUTE = `${APP_ROUTE}/group/settings/`;

export const BASE_LOCATION_SETTINGS_ROUTE = `${BASE_LOCATION_ROUTE}settings/`;
export const LOCATION_SETTINGS_ROUTE = `${BASE_GROUP_ROUTE}:groupId${BASE_LOCATION_SETTINGS_ROUTE}:locationId`;

export const REGISTER_BADGE_WITH_ID_ROUTE = '/registerBadge/:registratorId';
export const REGISTER_BADGE_ROUTE = '/registerBadge';
export const BASE_SHARE_DATA_ROUTE = `/shareData/`;
export const GROUP_SHARE_DATA_ROUTE = `${BASE_SHARE_DATA_ROUTE}group/:transferGroupId`;
export const SHARE_DATA_ROUTE = `${BASE_SHARE_DATA_ROUTE}:transferId`;
export const PROFILE_ROUTE = `${APP_ROUTE}/profile`;
export const LOCATIONS_ROUTE = `${APP_ROUTE}/locations`;
export const BASE_DATA_TRANSFER_ROUTE = `${APP_ROUTE}/dataTransfers/`;
export const ACTIVATION_BASE = '/activation/';
export const ACTIVATION_ROUTE = `${ACTIVATION_BASE}:activationId`;
export const ACTIVATE_EMAIL_BASE = '/activateEmail/';
export const ACTIVATE_EMAIL_ROUTE = `${ACTIVATE_EMAIL_BASE}:activationId`;
export const QR_CODE_DOCUMENT_ROUTE = `${APP_ROUTE}/qrCodes/:id`;

export const HOSTNAME = window.location.origin;
