import React from 'react';
import { useIntl } from 'react-intl';
import { useQuery } from 'react-query';
import { UploadKeyFileModal } from 'components/App/modals/UploadKeyFileModal';
import { RegisterHealthDepartmentModal } from 'components/App/modals/RegisterHealthDepartmentModal';
import { useModal } from 'components/hooks/useModal';
import {
  isHdekpInMemory,
  rekeyBadgeKeypairs,
  rekeyDailyKeypairs,
  rotateBadgeKeypairs,
  rotateDailyKeypair,
} from 'utils/cryptoKeyOperations';
import { getKeys } from 'network/api';

const rotateKeys = () => {
  return Promise.all([
    rotateDailyKeypair(),
    rotateBadgeKeypairs(),
    rekeyBadgeKeypairs(),
    rekeyDailyKeypairs(),
  ]).catch(console.error);
};

const promptForKeyFile = (openModal, intl, keysData) =>
  new Promise(resolve => {
    openModal({
      title: intl.formatMessage({
        id: 'modal.uploadKeyModal.title',
      }),
      content: (
        <UploadKeyFileModal keysData={keysData} onFinish={() => resolve()} />
      ),
      wide: false,
      closable: false,
    });
  });

const promptForRegistration = (openModal, intl) =>
  new Promise(resolve => {
    openModal({
      title: intl.formatMessage({
        id: 'modal.registerHealthDepartment.title',
      }),
      content: <RegisterHealthDepartmentModal onFinish={() => resolve()} />,
      closable: false,
    });
  });

export const useKeyLoader = () => {
  const intl = useIntl();
  const [openModal] = useModal();

  const { data: keysData, isLoading, error } = useQuery(
    'keysAndKeyFile',
    () =>
      getKeys().then(async keys => {
        if (isHdekpInMemory()) {
          return keys;
        }
        await (keys.publicHDEKP
          ? promptForKeyFile(openModal, intl, keys)
          : promptForRegistration(openModal, intl));
        return keys;
      }),
    {
      refetchOnWindowFocus: false,
      onSuccess: () => rotateKeys(),
    }
  );

  return { keysData, error, isLoading };
};
