import React, { useState } from 'react';
import { useIntl } from 'react-intl';
import { useQueryClient } from 'react-query';
import { useHistory } from 'react-router';
import { Steps, notification } from 'antd';

import { BASE_GROUP_ROUTE, BASE_LOCATION_ROUTE } from 'constants/routes';

import { createGroup as createGroupRequest } from 'network/api';
import { useModal } from 'components/hooks/useModal';

import { TableInput } from '../generalOnboarding/TableInput';
import {
  RESTAURANT_TYPE,
  NURSING_HOME_TYPE,
  HOTEL_TYPE,
  BASE_TYPE,
  STORE_TYPE,
  SELECT_GROUP_STEP,
  NAME_INPUT_STEP,
  ADDRESS_INPUT_STEP,
  PHONE_INPUT_STEP,
  TABLE_INPUT_STEP,
  AUTOMATIC_CHECKOUT_STEP,
  COMPLETE_STEP,
  QR_CODES_STEP,
  PATIENT_STEP,
  AREA_SELECTION_STEP,
  getNursingHomeGroupPayload,
  getRestaurantGroupPayload,
  getBaseGroupPayload,
} from './CreateGroupModal.helper';

import { SelectGroupType } from './steps/SelectGroupType';
import { NameInput } from './steps/NameInput';
import { AddressInput } from './steps/AddressInput';
import { PhoneInput } from './steps/PhoneInput';
import { PatientInput } from './steps/PatientInput';
import { AreaSelection } from './steps/AreaSelection';
import { AutomaticCheckout } from './steps/AutomaticCheckout';
import { Complete } from './steps/Complete';
import { QRDownload } from './steps/QRDownload';

export const CreateGroupModal = () => {
  const intl = useIntl();
  const history = useHistory();
  const queryClient = useQueryClient();
  const [, closeModal] = useModal();
  const [currentStep, setCurrentStep] = useState(0);
  const [groupType, setGroupType] = useState(null);
  const [groupName, setGroupName] = useState(null);
  const [address, setAddress] = useState(null);
  const [phone, setPhone] = useState(null);
  const [tableCount, setTableCount] = useState(null);
  const [patientRequired, setPatientRequired] = useState(null);
  const [areas, setAreas] = useState([]);
  const [radius, setRadius] = useState(null);
  const [group, setGroup] = useState(null);

  const nextStep = () => setCurrentStep(currentStep + 1);
  const previousStep = () => setCurrentStep(currentStep - 1);

  const onDone = () => {
    history.push(
      `${BASE_GROUP_ROUTE}${group.groupId}${BASE_LOCATION_ROUTE}${group.location.locationId}`
    );
    closeModal();
  };

  const handleResponse = response => {
    queryClient.invalidateQueries('groups');
    notification.success({
      message: intl.formatMessage({
        id: 'notification.createGroup.success',
      }),
    });
    setGroup(response);
  };

  const handleServerError = () => {
    notification.error({
      message: intl.formatMessage({
        id: 'notification.createGroup.error',
      }),
    });
    closeModal();
  };

  const createBaseGroup = () => {
    const createBaseGroupPayload = getBaseGroupPayload(
      groupName,
      phone,
      address,
      radius,
      areas,
      groupType
    );

    createGroupRequest(createBaseGroupPayload)
      .then(response => {
        handleResponse(response);
      })
      .catch(() => {
        handleServerError();
      });
  };

  const createNursingHomeGroup = () => {
    const createNursingHomeGroupPayload = getNursingHomeGroupPayload(
      intl,
      groupName,
      phone,
      address,
      radius,
      patientRequired,
      groupType
    );

    createGroupRequest(createNursingHomeGroupPayload)
      .then(response => {
        handleResponse(response);
      })
      .catch(() => {
        handleServerError();
      });
  };

  const createRestaurantGroup = () => {
    const createRestaurantGroupPayload = getRestaurantGroupPayload(
      groupName,
      phone,
      address,
      radius,
      tableCount,
      groupType
    );
    createGroupRequest(createRestaurantGroupPayload)
      .then(response => {
        handleResponse(response);
      })
      .catch(() => {
        handleServerError();
      });
  };

  const createGroup = () => {
    switch (groupType) {
      case RESTAURANT_TYPE:
        return createRestaurantGroup();
      case NURSING_HOME_TYPE:
        return createNursingHomeGroup();
      case HOTEL_TYPE:
      case STORE_TYPE:
      case BASE_TYPE:
        return createBaseGroup();
      default:
        return null;
    }
  };

  const nursingHomeSteps = [
    {
      id: PATIENT_STEP,
      content: (
        <PatientInput
          setPatientRequired={setPatientRequired}
          next={nextStep}
          back={previousStep}
        />
      ),
    },
  ];

  const hotelSteps = [
    {
      id: AREA_SELECTION_STEP,
      content: (
        <AreaSelection
          groupType={groupType}
          areas={areas}
          setAreas={setAreas}
          next={nextStep}
          back={previousStep}
        />
      ),
    },
  ];

  const finishSteps = [
    ...(address?.lat && address?.lng
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
          createGroup={createGroup}
          back={previousStep}
          group={group}
          done={onDone}
        />
      ),
    },
    {
      id: QR_CODES_STEP,
      content: <QRDownload group={group} done={onDone} />,
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
      id: SELECT_GROUP_STEP,
      content: <SelectGroupType setGroupType={setGroupType} next={nextStep} />,
    },
    {
      id: NAME_INPUT_STEP,
      content: (
        <NameInput
          groupType={groupType}
          groupName={groupName}
          setGroupName={setGroupName}
          next={nextStep}
          back={previousStep}
        />
      ),
    },
    {
      id: ADDRESS_INPUT_STEP,
      content: (
        <AddressInput
          groupType={groupType}
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
  ];

  const getSteps = () => {
    switch (groupType) {
      case RESTAURANT_TYPE:
        return [...baseSteps, ...restaurantSteps, ...finishSteps];
      case NURSING_HOME_TYPE:
        return [...baseSteps, ...nursingHomeSteps, ...finishSteps];
      case HOTEL_TYPE:
      case STORE_TYPE:
      case BASE_TYPE:
        return [...baseSteps, ...hotelSteps, ...finishSteps];
      default:
        return [...baseSteps];
    }
  };

  const steps = getSteps();

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
