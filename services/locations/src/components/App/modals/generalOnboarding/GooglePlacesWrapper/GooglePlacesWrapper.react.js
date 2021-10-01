import React from 'react';
import { LoadScript } from '@react-google-maps/api';
import { GOOGLE_LIBRARIES, GOOGLE_MAPS_API_KEY } from 'constants/googleApi';

export const GooglePlacesWrapper = ({ enabled, children }) =>
  enabled ? (
    <LoadScript
      googleMapsApiKey={GOOGLE_MAPS_API_KEY}
      libraries={GOOGLE_LIBRARIES}
    >
      {children}
    </LoadScript>
  ) : (
    children
  );
