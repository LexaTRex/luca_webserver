import React, { useEffect, useState } from 'react';
import { useQuery, useQueryClient } from 'react-query';
import { useIntl } from 'react-intl';
import { notification, Steps } from 'antd';
import { useHistory } from 'react-router';

import { BASE_GROUP_ROUTE, BASE_LOCATION_ROUTE } from 'constants/routes';

import { useModal } from 'components/hooks/useModal';
import { getBaseLocationFromGroup } from 'utils/group';

import { createLocation as createLocationRequest, getGroup } from 'network/api';

import { AutomaticCheckout } from 'components/App/modals/generalOnboarding/AutomaticCheckout';
import { TableInput } from 'components/App/modals/generalOnboarding/TableInput';
import { AverageCheckinTime } from 'components/App/modals/generalOnboarding/AverageCheckinTime';
import {
  ADDRESS_INPUT_STEP,
  AUTOMATIC_CHECKOUT_STEP,
  BASE_ADDRESS_INDICATOR,
  BASE_TYPE,
  BUILDING_TYPE,
  COMPLETE_STEP,
  getBaseLocationPayload,
  getRestaurantLocationPayload,
  IS_INDOOR_STEP,
  AVERAGE_CHECKIN_TIME_STEP,
  NAME_INPUT_STEP,
  PHONE_INPUT_STEP,
  QR_CODES_STEP,
  RESTAURANT_TYPE,
  ROOM_TYPE,
  SELECT_LOCATION_STEP,
  TABLE_INPUT_STEP,
} from './CreateLocationModal.helper';

import { SelectLocationType } from './steps/SelectLocationType';
import { NameInput } from './steps/NameInput';
import { AddressInput } from './steps/AddressInput';
import { PhoneInput } from './steps/PhoneInput';
import { Complete } from './steps/Complete';
import { QRDownload } from './steps/QRDownload';
import { IndoorInput } from '../generalOnboarding/IndoorInput';

export const CreateLocationModal = ({ groupId }) => {
  const intl = useIntl();
  const history = useHistory();
  const queryClient = useQueryClient();
  const [, closeModal] = useModal();
  const [currentStep, setCurrentStep] = useState(0);
  const [locationType, setLocationType] = useState(null);
  const [locationName, setLocationName] = useState(null);
  const [address, setAddress] = useState(null);
  const [phone, setPhone] = useState(null);
  const [isIndoor, setIsIndoor] = useState(true);
  const [averageCheckinTime, setAverageCheckinTime] = useState(null);
  const [tableCount, setTableCount] = useState(null);
  const [radius, setRadius] = useState(null);
  const [location, setLocation] = useState(null);
  const [baseLocation, setBaseLocation] = useState(null);

  const { isLoading, error, data: group } = useQuery(`group/${groupId}`, () =>
    getGroup(groupId)
  );

  const nextStep = () => setCurrentStep(currentStep + 1);
  const previousStep = () => setCurrentStep(currentStep - 1);

  const onDone = () => {
    history.push(
      `${BASE_GROUP_ROUTE}${groupId}${BASE_LOCATION_ROUTE}${location.uuid}`
    );
    closeModal();
  };

  const handleServerError = () => {
    notification.error({
      message: intl.formatMessage({
        id: 'notification.createLocation.error',
      }),
    });
    closeModal();
  };

  const handleResponse = response => {
    if (!response) {
      handleServerError();
    }
    notification.success({
      message: intl.formatMessage({
        id: 'notification.createLocation.success',
      }),
    });
    setLocation(response);
    queryClient.invalidateQueries(`group/${groupId}`);
  };

  const createBaseLocation = () => {
    const createBaseLocationPayload = getBaseLocationPayload(
      groupId,
      locationName,
      phone,
      address,
      baseLocation,
      radius,
      locationType,
      isIndoor,
      averageCheckinTime
    );
    createLocationRequest(createBaseLocationPayload)
      .then(response => {
        handleResponse(response);
      })
      .catch(() => {
        handleServerError();
      });
  };

  const createRestaurantLocation = () => {
    const createRestaurantLocationPayload = getRestaurantLocationPayload(
      groupId,
      locationName,
      phone,
      address,
      baseLocation,
      radius,
      tableCount,
      locationType,
      isIndoor,
      averageCheckinTime
    );

    createLocationRequest(createRestaurantLocationPayload)
      .then(response => {
        handleResponse(response);
      })
      .catch(() => {
        handleServerError();
      });
  };

  const createLocation = () => {
    switch (locationType) {
      case RESTAURANT_TYPE:
        return createRestaurantLocation();
      case ROOM_TYPE:
      case BUILDING_TYPE:
      case BASE_TYPE:
        return createBaseLocation();
      default:
        return null;
    }
  };

  const finishSteps = [
    ...((
      address === BASE_ADDRESS_INDICATOR
        ? baseLocation.lat && baseLocation.lng
        : address?.lat && address?.lng
    )
      ? [
          {
            id: AUTOMATIC_CHECKOUT_STEP,
            content: (
              <AutomaticCheckout
                radius={radius}
                setRadius={setRadius}
                next={nextStep}
                back={previousStep}
              />
            ),
          },
        ]
      : []),
    {
      id: COMPLETE_STEP,
      content: (
        <Complete
          next={nextStep}
          createLocation={createLocation}
          back={previousStep}
          location={location}
          done={onDone}
        />
      ),
    },
    {
      id: QR_CODES_STEP,
      content: <QRDownload location={location} done={onDone} group={group} />,
    },
  ];

  const restaurantSteps = [
    {
      id: TABLE_INPUT_STEP,
      content: (
        <TableInput
          tableCount={tableCount}
          setTableCount={setTableCount}
          next={nextStep}
          back={previousStep}
        />
      ),
    },
  ];

  const baseSteps = [
    {
      id: SELECT_LOCATION_STEP,
      content: (
        <SelectLocationType setLocationType={setLocationType} next={nextStep} />
      ),
    },
    {
      id: NAME_INPUT_STEP,
      content: (
        <NameInput
          locationType={locationType}
          locationName={locationName}
          setLocationName={setLocationName}
          next={nextStep}
          back={previousStep}
          groupId={groupId}
        />
      ),
    },
    {
      id: ADDRESS_INPUT_STEP,
      content: (
        <AddressInput
          baseLocation={baseLocation}
          locationType={locationType}
          address={address}
          setAddress={setAddress}
          next={nextStep}
          back={previousStep}
        />
      ),
    },
    {
      id: PHONE_INPUT_STEP,
      content: (
        <PhoneInput
          phone={phone}
          setPhone={setPhone}
          next={nextStep}
          back={previousStep}
        />
      ),
    },
    {
      id: AVERAGE_CHECKIN_TIME_STEP,
      content: (
        <AverageCheckinTime
          averageCheckinTime={averageCheckinTime}
          setAverageCheckinTime={setAverageCheckinTime}
          next={nextStep}
          back={previousStep}
        />
      ),
    },
    {
      id: IS_INDOOR_STEP,
      content: (
        <IndoorInput
          isIndoor={isIndoor}
          setIsIndoor={setIsIndoor}
          next={nextStep}
          back={previousStep}
        />
      ),
    },
  ];

  const getSteps = () => {
    switch (locationType) {
      case RESTAURANT_TYPE:
        return [...baseSteps, ...restaurantSteps, ...finishSteps];
      case ROOM_TYPE:
      case BUILDING_TYPE:
      case BASE_TYPE:
        return [...baseSteps, ...finishSteps];
      default:
        return [...baseSteps];
    }
  };

  const steps = getSteps();

  useEffect(() => {
    if (isLoading || error || baseLocation) return;
    setBaseLocation(getBaseLocationFromGroup(group));
  }, [isLoading, error, baseLocation, group]);

  if (isLoading || error) return null;

  return (
    <>
      <Steps
        progressDot={() => null}
        current={currentStep}
        style={{ margin: 0 }}
      >
        {steps.map(step => (
          <Steps.Step key={step.id} />
        ))}
      </Steps>
      {steps[currentStep].content}
    </>
  );
};
