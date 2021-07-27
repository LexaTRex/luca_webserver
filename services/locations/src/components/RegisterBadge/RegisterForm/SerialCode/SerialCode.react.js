import React, { useRef } from 'react';
import { useIntl } from 'react-intl';
import { Form, Input, notification } from 'antd';
import { PrimaryButton } from 'components/general';

import { getBadgeUser } from 'network/api';

import {
  decodeSerial,
  SERIAL_NUMBER_SECTION_LENGTH,
  getSerialNumberRules,
} from './SerialCode.helper';

import {
  ContentWrapper,
  ContentTitle,
  ButtonRow,
  SubTitle,
  Divider,
  ItemWrapper,
} from '../RegisterForm.styled';

export const SerialCode = ({ next, title, setUserSecrets }) => {
  const intl = useIntl();
  const inputReference0 = useRef(null);
  const inputReference1 = useRef(null);
  const inputReference2 = useRef(null);
  const inputReferences = { inputReference0, inputReference1, inputReference2 };

  const handleMoveToNextInput = event => {
    const index = Number.parseInt(event.currentTarget.dataset.index, 10);
    if (
      event.target.value.length >= SERIAL_NUMBER_SECTION_LENGTH &&
      index + 1 <= 2
    ) {
      inputReferences[`inputReference${index + 1}`].current.focus();
    }
  };

  const notify = messageId =>
    notification.error({
      message: intl.formatMessage({
        id: messageId,
      }),
    });

  const handleNextStep = async () => {
    const tanChunk0 = inputReference0.current.state.value;
    const tanChunk1 = inputReference1.current.state.value;
    const tanChunk2 = inputReference2.current.state.value;
    const serialNumber = tanChunk0 + tanChunk1 + tanChunk2;
    if (serialNumber.length !== 12) {
      notify('error.registerBadge.serialNumber.tooShort');
      return;
    }

    const badgeInfo = await decodeSerial(serialNumber);
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

  return (
    <ContentWrapper>
      <ContentTitle>{title}</ContentTitle>
      <SubTitle>
        {intl.formatMessage({ id: 'registerBadge.serialNumber.info' })}
      </SubTitle>

      <ItemWrapper>
        <Form.Item
          name="tanChunk0"
          style={{ width: '30%', margin: 0 }}
          rules={getSerialNumberRules(intl, inputReference0)}
          validateTrigger={['onBlur', 'onFocus']}
          normalize={value => value.toUpperCase()}
        >
          <Input
            maxLength={SERIAL_NUMBER_SECTION_LENGTH}
            onChange={handleMoveToNextInput}
            data-index={0}
            ref={inputReference0}
            autoFocus
          />
        </Form.Item>
        <Divider> - </Divider>
        <Form.Item
          name="tanChunk1"
          style={{ width: '30%', margin: 0 }}
          normalize={value => value.toUpperCase()}
          rules={getSerialNumberRules(intl, inputReference1)}
          validateTrigger={['onBlur', 'onFocus']}
        >
          <Input
            maxLength={SERIAL_NUMBER_SECTION_LENGTH}
            onChange={handleMoveToNextInput}
            data-index={1}
            ref={inputReference1}
          />
        </Form.Item>
        <Divider> - </Divider>
        <Form.Item
          name="tanChunk2"
          style={{ width: '30%', margin: 0 }}
          normalize={value => value.toUpperCase()}
          rules={getSerialNumberRules(intl, inputReference2)}
          validateTrigger={['onBlur', 'onFocus']}
        >
          <Input
            maxLength={SERIAL_NUMBER_SECTION_LENGTH}
            onChange={handleMoveToNextInput}
            data-index={2}
            ref={inputReference2}
          />
        </Form.Item>
      </ItemWrapper>
      <ButtonRow>
        <PrimaryButton onClick={handleNextStep}>
          {intl.formatMessage({ id: 'registerBadge.next' })}
        </PrimaryButton>
      </ButtonRow>
    </ContentWrapper>
  );
};
