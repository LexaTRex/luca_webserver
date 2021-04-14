import React, { useState, useCallback } from 'react';
import { useIntl } from 'react-intl';
import { Form, notification } from 'antd';
import { Autocomplete } from '@react-google-maps/api';

import { StyledInput } from './LocationSearch.styled';

export const LocationSearch = ({
  formReference,
  setFilled,
  setDisabled,
  setIsError,
  isError,
}) => {
  const intl = useIntl();
  const [map, setMap] = useState(null);

  const onLoad = useCallback(mapInstance => {
    setMap(mapInstance);
  }, []);

  const autofillForm = place => {
    const address = {
      streetName: '',
      streetNr: '',
      zipCode: '',
      city: '',
      state: '',
    };
    place.address_components.forEach(addressComponent => {
      if (addressComponent.types.includes('street_number')) {
        address.streetNr = addressComponent.long_name;
      }
      if (addressComponent.types.includes('route')) {
        address.streetName = addressComponent.long_name;
      }
      if (addressComponent.types.includes('postal_code')) {
        address.zipCode = addressComponent.long_name;
      }
      if (addressComponent.types.includes('locality')) {
        address.city = addressComponent.long_name;
      }
      if (addressComponent.types.includes('administrative_area_level_1')) {
        address.state = addressComponent.long_name;
      }
    });

    if (isError) {
      setIsError(false);
    }

    if (!place.geometry.location.lat() || !place.geometry.location.lng()) {
      setIsError(true);
      notification.error({
        message: intl.formatMessage({
          id: 'autocomplete.fill.title',
        }),
        description: intl.formatMessage({
          id: 'autocomplete.fill.notSupported.description',
        }),
      });
    }

    const autofill = {
      locationName: place.name,
      phone: place.formatted_phone_number,
      streetName: address.streetName,
      streetNr: address.streetNr,
      zipCode: address.zipCode,
      city: address.city,
      state: address.state,
      lat: place.geometry.location.lat(),
      lng: place.geometry.location.lng(),
    };
    formReference.current.setFieldsValue(autofill);

    if (Object.values(address).some(entry => !entry)) {
      setDisabled(false);
    }
    setFilled(true);
  };

  const onPlaceChanged = () => {
    const place = map.getPlace();

    if (!Object.keys(place).includes('address_components')) {
      notification.error({
        message: intl.formatMessage({ id: 'autocomplete.fill.title' }),
        description: intl.formatMessage({
          id: 'autocomplete.fill.description',
        }),
      });

      return;
    }

    autofillForm(place);
  };

  return (
    <Autocomplete onLoad={onLoad} onPlaceChanged={onPlaceChanged}>
      <Form.Item name="googleApi">
        <StyledInput
          id="locationSearch"
          placeholder={intl.formatMessage({
            id: 'createLocation.form.find',
          })}
          autoFocus
        />
      </Form.Item>
    </Autocomplete>
  );
};
