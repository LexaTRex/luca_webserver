import { useIntl } from 'react-intl';
import { useCallback } from 'react';

export function useContactDataRules() {
  const intl = useIntl();
  return useCallback(
    fieldName =>
      fieldName
        ? [
            {
              required: true,
              message: intl.formatMessage(
                {
                  id: 'contactDataForm.pleaseEnter',
                },
                {
                  fieldName: intl.formatMessage({
                    id: `contactDataForm.${fieldName}`,
                  }),
                }
              ),
            },
          ]
        : [
            {
              required: true,
              message: intl.formatMessage({
                id: 'contactDataForm.isRequired',
              }),
            },
          ],
    [intl]
  );
}
