export const TAN_SECTION_LENGTH = 4;

export const getTanRules = (intl, reference) => [
  () => ({
    validator: async (rule, value) => {
      if (reference.current.state.focused) {
        return Promise.resolve();
      }
      if (
        !reference.current.state.focused &&
        (!value || value.length < TAN_SECTION_LENGTH)
      ) {
        return Promise.reject(
          intl.formatMessage({
            id: 'modal.trackInfection.tan.error.min',
          })
        );
      }
      return null;
    },
  }),
];
