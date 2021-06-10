import { useIntl } from 'react-intl';

const isSupportedLanguage = lang => lang === 'de' || lang === 'en';

export const getLanguage = () => {
  const language = navigator.language.split(/[_-]/)[0];
  if (isSupportedLanguage(language)) {
    return language;
  }
  return 'en';
};

export const useFormatMessage = () => {
  const intl = useIntl();
  return id => intl.formatMessage({ id });
};
