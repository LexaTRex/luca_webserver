import React from 'react';
import { useIntl } from 'react-intl';
import ReactExport from 'react-data-export';
import { sanitizeForCSV } from 'utils/sanitizer';

import { SecondaryButton } from 'components/general';

const {
  ExcelFile,
  ExcelFile: { ExcelSheet, ExcelColumn },
} = ReactExport;

export const EmailToUuidListDownload = ({ employees }) => {
  const intl = useIntl();

  return (
    <ExcelFile
      filename={intl.formatMessage({ id: 'profile.auditLog.downloadFileName' })}
      element={
        <SecondaryButton>
          {intl.formatMessage({
            id: 'profile.auditLogs.downloadUserList',
          })}
        </SecondaryButton>
      }
    >
      <ExcelSheet
        data={employees}
        name={intl.formatMessage({ id: 'profile.auditLog.downloadFileName' })}
      >
        <ExcelColumn
          label={intl.formatMessage({ id: 'profile.auditLog.email' })}
          value={col => sanitizeForCSV(col.email)}
        />
        <ExcelColumn
          label={intl.formatMessage({ id: 'profile.auditLog.uuid' })}
          value={col => sanitizeForCSV(col.uuid)}
        />
      </ExcelSheet>
    </ExcelFile>
  );
};
