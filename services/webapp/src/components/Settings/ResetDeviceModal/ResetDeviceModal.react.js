import React from 'react';
import { notification } from 'antd';
import { useIntl } from 'react-intl';
import {
  uuidToHex,
  bytesToHex,
  hexToBase64,
  SIGN_EC_SHA256_DER,
} from '@lucaapp/crypto';

import { deleteUser } from 'network/api';
import { getSecrets } from 'helpers/crypto';
import { ON_BOARDING_PATH } from 'constants/routes';
import { indexDB, USER_SECRET_PRIVATE_KEY } from 'db';

import {
  StyledContent,
  StyledHeadline,
  StyledInfoText,
  StyledContainer,
  StyledCancelButton,
  StyledSubmitButton,
  StyledModalContainer,
} from './ResetDeviceModal.styled';

export function ResetDeviceModal({ onClose }) {
  const { formatMessage } = useIntl();

  return (
    <StyledModalContainer>
      <StyledContainer>
        <StyledHeadline>
          {formatMessage({ id: 'Data.DeleteAccount.Title' })}
        </StyledHeadline>
        <StyledContent>
          <StyledInfoText>
            {formatMessage({ id: 'Data.DeleteAccount.Description' })}
          </StyledInfoText>
        </StyledContent>
        <StyledCancelButton
          id="cancel"
          tabIndex="1"
          onClick={async () => {
            try {
              const secrets = await getSecrets();
              const [{ userId }] = await indexDB.users.toArray();
              const userPrivateKey = secrets[USER_SECRET_PRIVATE_KEY];

              const signature = SIGN_EC_SHA256_DER(
                userPrivateKey,
                `${bytesToHex('DELETE_USER')}${uuidToHex(userId)}`
              );
              await deleteUser(userId, hexToBase64(signature));
              indexDB.delete();
              window.location.href = ON_BOARDING_PATH;
            } catch {
              onClose();
              notification.error({
                message: formatMessage({
                  id: 'error.headline',
                }),
              });
            }
          }}
        >
          {formatMessage({ id: 'Data.DeleteAccount.Confirm' })}
        </StyledCancelButton>
        <StyledSubmitButton id="delete" tabIndex="1" onClick={onClose}>
          {formatMessage({ id: 'Data.DeleteAccount.Cancel' })}
        </StyledSubmitButton>
      </StyledContainer>
    </StyledModalContainer>
  );
}
