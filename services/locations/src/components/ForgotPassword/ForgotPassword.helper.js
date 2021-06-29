import { AUTHENTICATION_ROUTE, FORGOT_PASSWORD_ROUTE } from 'constants/routes';

export const messageForResponse = statusCode => {
  const responses = {
    404: {
      message: 'notification.forgotPassword.invalidUser',
      route: FORGOT_PASSWORD_ROUTE,
    },
    412: {
      message: 'notification.forgotPassword.inactiveUser',
      route: FORGOT_PASSWORD_ROUTE,
    },
    204: {
      message: 'notification.forgotPassword.success',
      route: AUTHENTICATION_ROUTE,
    },
  };

  if (responses[statusCode]) return responses[statusCode];

  return {
    message: 'notification.forgotPassword.error',
    route: FORGOT_PASSWORD_ROUTE,
  };
};
