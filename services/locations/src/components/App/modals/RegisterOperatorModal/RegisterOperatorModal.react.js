import React, { useState, useEffect } from 'react';
import { useIntl } from 'react-intl';
import { PrimaryButton } from 'components/general/Buttons.styled';
import { useQuery, useQueryClient } from 'react-query';

import { getPrivateKeySecret, storePublicKey } from 'network/api';
import { hexToBase64, EC_KEYPAIR_GENERATE } from '@lucaapp/crypto';
import { ConfirmPrivateKey } from './ConfirmPrivateKey';
import { DownloadPrivateKey } from './DownloadPrivateKey';

import { Wrapper, ButtonWrapper } from './RegisterOperatorModal.styled';

/**
 * Modal for registering a new location. Generates a new keypair and
 * uploads the public key to the backend.
 *
 * @see https://www.luca-app.de/securityoverview/processes/venue_registration.html#process
 */
export const RegisterOperatorModal = ({ onClose, operator }) => {
  const intl = useIntl();
  const queryClient = useQueryClient();
  const [keyPair, setKeyPair] = useState(null);
  const [hasDownloadedKey, setHasDownloadedKey] = useState(false);
  const [hasSavedKey, setHasSavedKey] = useState(false);

  useEffect(() => {
    const keys = EC_KEYPAIR_GENERATE();
    setKeyPair(keys);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const {
    data: privateKeySecret,
    isLoading,
    isError,
  } = useQuery('privateKeySecret', () => getPrivateKeySecret());

  const setOperatorKey = () => {
    storePublicKey({ publicKey: hexToBase64(keyPair.publicKey) })
      .then(() => {
        queryClient.invalidateQueries('me');
        onClose();
      })
      .catch(error => console.error(error));
  };

  if (isLoading || isError) {
    return null;
  }

  return (
    <Wrapper>
      <DownloadPrivateKey
        operator={operator}
        keyPair={keyPair}
        setHasDownloadedKey={setHasDownloadedKey}
        privateKeySecret={privateKeySecret}
      />
      <ConfirmPrivateKey
        hasDownloadedKey={hasDownloadedKey}
        setHasSavedKey={setHasSavedKey}
      />
      <ButtonWrapper multipleButtons>
        <PrimaryButton
          data-cy="finish"
          disabled={!hasSavedKey}
          onClick={setOperatorKey}
        >
          {intl.formatMessage({
            id: 'authentication.form.button.next',
          })}
        </PrimaryButton>
      </ButtonWrapper>
    </Wrapper>
  );
};
