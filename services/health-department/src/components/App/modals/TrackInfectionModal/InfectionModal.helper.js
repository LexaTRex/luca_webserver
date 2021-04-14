export const TAN_SECTION_LENGTH = 4;

export const getTanRules = intl => [
  {
    required: true,
    message: intl.formatMessage({
      id: 'modal.trackInfection.tan.error.required',
    }),
  },
  {
    min: TAN_SECTION_LENGTH,
    message: intl.formatMessage({
      id: 'modal.trackInfection.tan.error.min',
    }),
  },
];
