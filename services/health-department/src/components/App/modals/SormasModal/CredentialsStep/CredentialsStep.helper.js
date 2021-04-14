const FIELD_REQUIRED_ERROR = 'modal.sormas.credentialstep.fieldRequired';

export const getConnectionFields = intl => [
  {
    name: 'host',
    type: 'text',
    placeholder: 'SORMAS URL',
    rules: [
      {
        required: true,
        message: intl.formatMessage({
          id: FIELD_REQUIRED_ERROR,
        }),
      },
      {
        type: 'url',
        message: intl.formatMessage({
          id: 'modal.sormas.credentialstep.validUrl',
        }),
      },
    ],
    autoFocus: true,
  },
  {
    name: 'username',
    type: 'text',
    placeholder: intl.formatMessage({
      id: 'modal.sormas.credentialstep.username',
    }),
    rules: [
      {
        required: true,
        message: intl.formatMessage({
          id: FIELD_REQUIRED_ERROR,
        }),
      },
    ],
  },
  {
    name: 'password',
    type: 'password',
    placeholder: intl.formatMessage({
      id: 'modal.sormas.credentialstep.password',
    }),
    rules: [
      {
        required: true,
        message: intl.formatMessage({
          id: FIELD_REQUIRED_ERROR,
        }),
      },
    ],
  },
];
