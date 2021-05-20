import React from 'react';
import { useHistory, useLocation } from 'react-router-dom';

import { AUTHENTICATION_ROUTE } from 'constants/routes';
import { PrivateKeyLoader } from 'components/PrivateKeyLoader';

import { RequestContent, StepLabel, SubHeader } from '../ShareData.styled';

export const PrivateKeyStep = ({ next, title, setPrivateKey, publicKey }) => {
  const history = useHistory();
  const location = useLocation();

  const handleError = () => {
    history.push(`${AUTHENTICATION_ROUTE}?redirect=${location.pathname}`);
  };

  return (
    <RequestContent>
      <StepLabel>1/2</StepLabel>
      <SubHeader>{title}</SubHeader>
      <PrivateKeyLoader
        publicKey={publicKey}
        onSuccess={privateKey => {
          setPrivateKey(privateKey);
          setTimeout(next, 750);
        }}
        onError={handleError}
        infoTextId="shareData.privateKeyStep.info"
      />
    </RequestContent>
  );
};
