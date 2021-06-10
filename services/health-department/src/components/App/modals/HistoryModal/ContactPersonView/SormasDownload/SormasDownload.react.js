import React from 'react';
import { useIntl } from 'react-intl';
import { SormasDownloadLink } from './SormasDownload.helper';

export const SormasDownload = ({ traces, location }) => {
  const intl = useIntl();

  return (
    <>
      <SormasDownloadLink traces={traces} location={location}>
        {intl.formatMessage({ id: 'download.sormas' })}
      </SormasDownloadLink>
    </>
  );
};
