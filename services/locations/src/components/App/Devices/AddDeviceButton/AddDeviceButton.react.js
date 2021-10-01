import React from 'react';
import { useIntl } from 'react-intl';
import { useQuery } from 'react-query';

import { usePrivateKey } from 'utils/privateKey';
import { getMe, getPrivateKeySecret } from 'network/api';

import { PrimaryButton } from 'components/general';
import { useModal } from 'components/hooks/useModal';
import { PrivateKeyLoader } from 'components/PrivateKeyLoader';
import { CreateDeviceModal } from 'components/App/modals/CreateDeviceModal';

import { AddDeviceWrapper } from './AddDevice.styled';

export function AddDeviceButton({ isCentered = false }) {
  const intl = useIntl();
  const { data: privateKeySecret } = useQuery(
    'privateKeySecret',
    getPrivateKeySecret
  );
  const { data: operator } = useQuery('me', () => getMe());

  const [openModal] = useModal();
  const [privateKey] = usePrivateKey(privateKeySecret);

  const openCreateDevice = operatorPrivateKey => {
    openModal({
      content: <CreateDeviceModal privateKey={operatorPrivateKey} />,
      emphasis: 'noHeader',
    });
  };

  const openPrivateKeyLoader = onSuccess => {
    openModal({
      title: intl.formatMessage({
        id: 'privateKey.modal.title',
      }),
      content: (
        <PrivateKeyLoader
          onSuccess={onSuccess}
          publicKey={operator.publicKey}
        />
      ),
      closable: true,
    });
  };

  const onCreateDevice = () => {
    if (privateKey) {
      openCreateDevice(privateKey);
    } else {
      openPrivateKeyLoader(openCreateDevice);
    }
  };

  return (
    <AddDeviceWrapper isCentered={isCentered}>
      <PrimaryButton onClick={onCreateDevice}>
        {intl.formatMessage({ id: 'device.addDevice' })}
      </PrimaryButton>
    </AddDeviceWrapper>
  );
}
