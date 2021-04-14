import { notification } from 'antd';

export const handleResponse = (response, intl, form) => {
  switch (response.status) {
    case 204: {
      notification.success({
        message: intl.formatMessage({
          id: 'profile.changePassword.success',
        }),
      });
      form.resetFields();

      break;
    }
    case 400: {
      notification.error({
        message: intl.formatMessage({
          id: 'profile.changePassword.error.weakPassword',
        }),
      });

      break;
    }
    case 403: {
      notification.error({
        message: intl.formatMessage({
          id: 'profile.changePassword.error.wrongPassword',
        }),
      });

      break;
    }
    case 500: {
      notification.error({
        message: intl.formatMessage({
          id: 'profile.changePassword.error.wrongUser',
        }),
      });

      break;
    }
    default:
  }
};
