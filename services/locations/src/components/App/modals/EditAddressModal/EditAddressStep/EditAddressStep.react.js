import React from 'react';
import { useIntl } from 'react-intl';
import {
  Wrapper,
  Description,
} from 'components/App/modals/generalOnboarding/Onboarding.styled';
import { GooglePlacesWrapper } from 'components/App/modals/generalOnboarding/GooglePlacesWrapper';
import { notification } from 'antd';
import { updateAddress } from 'network/api';

import { EditAddressManual } from 'components/App/modals/generalOnboarding/AddressForm/EditAddressManual';
import { EditAddressGoogle } from 'components/App/modals/generalOnboarding/AddressForm/EditAddressGoogle';

export const EditAddressStep = ({
  close,
  locationId,
  refetch,
  googleEnabled,
  isGroup,
}) => {
  const intl = useIntl();

  const finishStep = addressData => {
    const addressDataWithAdditionalInfo = {
      ...addressData,
      state: null,
      radius: 0,
      lng: null,
      lat: null,
    };

    updateAddress({
      locationId,
      data: googleEnabled ? addressData : addressDataWithAdditionalInfo,
    })
      .then(response => {
        if (response.status >= 400 && response.status <= 500)
          throw new Error('ERROR');
        refetch();
        notification.success({
          message: intl.formatMessage({
            id: isGroup
              ? 'notification.updateGroup.success'
              : 'notification.updateArea.success',
          }),
          className: 'editLocationSuccess',
        });
        close();
      })
      .catch(() => {
        notification.error({
          message: intl.formatMessage({
            id: isGroup
              ? 'notification.updateGroup.error'
              : 'notification.updateArea.error',
          }),
        });
      });
  };

  return (
    <Wrapper>
      <Description>
        {intl.formatMessage({
          id: 'modal.addressInput.help.description',
        })}
      </Description>
      <GooglePlacesWrapper enabled={googleEnabled}>
        {googleEnabled ? (
          <EditAddressGoogle
            close={close}
            refetch={refetch}
            finishStep={finishStep}
          />
        ) : (
          <EditAddressManual
            close={close}
            refetch={refetch}
            finishStep={finishStep}
          />
        )}
      </GooglePlacesWrapper>
    </Wrapper>
  );
};
