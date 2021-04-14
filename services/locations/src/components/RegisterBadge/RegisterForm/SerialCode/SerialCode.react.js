import React, { useState, useCallback, useLayoutEffect } from 'react';
import { useIntl } from 'react-intl';
import { Button, Input, notification } from 'antd';

import { getBadgeUser } from 'network/api';

import { decodeSerial } from './SerialCode.helper';

import {
  ContentWrapper,
  ContentTitle,
  ButtonRow,
  SubTitle,
} from '../RegisterForm.styled';

export const SerialCode = ({ next, title, setUserSecrets }) => {
  const intl = useIntl();
  const [serialInput, setSerialInput] = useState('');
  const [rawValue, setRawValue] = useState('');

  const notify = messageId =>
    notification.error({
      message: intl.formatMessage({
        id: messageId,
      }),
    });

  const handleNext = async () => {
    if (rawValue.length !== 12) {
      notify('error.registerBadge.serialNumber.tooShort');
      return;
    }

    const badgeInfo = await decodeSerial(rawValue);
    if (!badgeInfo) {
      notify('error.registerBadge.serialNumber');
      return;
    }

    try {
      const user = await getBadgeUser(badgeInfo.userId);
      if (user.data) {
        notify('error.registerBadge.alreadyRegistered');
        return;
      }
      setUserSecrets(badgeInfo);
      next();
    } catch {
      // If empty user does not exist, serial number is wrong or user is already registered
      notify('error.registerBadge.serialNumber');
    }
  };

  const onChange = useCallback(event => {
    const { value } = event.target;

    setRawValue(value.replaceAll('-', '').slice(0, 12));
  }, []);

  useLayoutEffect(() => {
    const finalString = [];

    for (let index = 0; index <= 3; index += 1) {
      finalString.push(rawValue.slice(index * 4, (index + 1) * 4));

      if (rawValue.length <= (index + 1) * 4) break;
    }

    setSerialInput(finalString.join('-'));
  }, [rawValue]);

  return (
    <ContentWrapper>
      <ContentTitle>{title}</ContentTitle>
      <SubTitle>
        {intl.formatMessage({ id: 'registerBadge.serialNumber.info' })}
      </SubTitle>
      <Input
        value={serialInput}
        placeholder={intl.formatMessage({
          id: 'registerBadge.serialNumber',
        })}
        onChange={onChange}
      />
      <ButtonRow>
        <Button
          onClick={handleNext}
          style={{
            color: 'black',
            backgroundColor: '#b8c0ca',
          }}
        >
          {intl.formatMessage({ id: 'registerBadge.next' })}
        </Button>
      </ButtonRow>
    </ContentWrapper>
  );
};
