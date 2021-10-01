import {
  usePersonNameValidator,
  usePhoneValidator,
  useEmailValidator,
} from 'components/hooks/useValidators';

export const useFormElements = () => [
  {
    key: 'firstName',
    rules: usePersonNameValidator('firstName'),
  },
  {
    key: 'lastName',
    rules: usePersonNameValidator('lastName'),
  },
  {
    key: 'phone',
    rules: usePhoneValidator('phone'),
  },
  {
    key: 'email',
    rules: useEmailValidator('email'),
  },
];
