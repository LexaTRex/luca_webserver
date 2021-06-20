export const getFormElements = intl => [
  {
    key: 'firstName',
    rules: [
      {
        required: true,
        whitespace: true,
        message: intl.formatMessage({
          id: 'userManagement.error.firstName',
        }),
      },
    ],
  },
  {
    key: 'lastName',
    rules: [
      {
        required: true,
        whitespace: true,
        message: intl.formatMessage({
          id: 'userManagement.error.lastName',
        }),
      },
    ],
  },
  {
    key: 'phone',
    rules: [
      {
        required: true,
        whitespace: true,
        message: intl.formatMessage({
          id: 'userManagement.error.phone',
        }),
      },
    ],
  },
  {
    key: 'email',
    rules: [
      {
        required: true,
        message: intl.formatMessage({
          id: 'userManagement.error.email',
        }),
      },
      {
        type: 'email',
        message: intl.formatMessage({
          id: 'userManagement.error.emailInvalid',
        }),
      },
    ],
  },
];
