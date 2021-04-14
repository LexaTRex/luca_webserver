import React, { useEffect, useState } from 'react';
import { useIntl } from 'react-intl';
import { useQuery } from 'react-query';
import { Spin, message } from 'antd';
import { CloseOutlined } from '@ant-design/icons';
import { getContactPersons } from 'network/api';

import { decryptTrace } from 'utils/cryptoOperations';

import { Header } from './Header';
import { Table } from './Table';
import { ContactViewWrapper } from './ContactPersonView.styled';

const CloseButtonStyles = {
  position: 'absolute',
  top: 12,
  right: 12,

  fontSize: 16,
  cursor: 'pointer',
  color: 'black',
};

const ContactPersonViewRaw = ({ location, onClose }) => {
  const intl = useIntl();
  const [traces, setTraces] = useState(null);

  const {
    isLoading,
    error,
    data: contactPersons,
  } = useQuery(
    `contactPersons${location.transferId}`,
    () => getContactPersons(location.transferId),
    { refetchOnWindowFocus: false }
  );

  useEffect(() => {
    if (isLoading) {
      return;
    }

    async function decryptTraces() {
      const hideMessage = message.loading(
        intl.formatMessage({ id: 'message.decryptingData' }),
        0
      );

      const decryptedTraces = await Promise.all(
        contactPersons.traces.map(trace =>
          decryptTrace(trace).catch(() => ({ isInvalid: true }))
        )
      );

      setTraces(decryptedTraces.filter(user => !user.isInvalid));
      hideMessage();
    }

    decryptTraces();
  }, [isLoading, contactPersons, intl]);

  if (error || !traces) return null;

  return (
    <ContactViewWrapper>
      <CloseOutlined onClick={onClose} style={CloseButtonStyles} />
      {isLoading ? (
        <Spin />
      ) : (
        <>
          <Header traces={traces} location={location} />
          <Table traces={traces} />
        </>
      )}
    </ContactViewWrapper>
  );
};

export const ContactPersonView = React.memo(ContactPersonViewRaw);
