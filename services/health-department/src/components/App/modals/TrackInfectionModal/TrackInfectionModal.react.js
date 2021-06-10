import React, { useState, useRef } from 'react';
import { useIntl } from 'react-intl';
import { useQueryClient } from 'react-query';
import { Form, Button, notification, Popconfirm } from 'antd';
import { QuestionCircleOutlined } from '@ant-design/icons';

import {
  initiateUserTracingProcess,
  initiateStaticUserTracingProcess,
  EMPTY_HISTORY,
  INVALID_VERSION,
  DECRYPTION_FAILED,
} from 'utils/cryptoOperations';

// Hooks
import { useModal } from 'components/hooks/useModal';

import {
  NewTrackingWrapper,
  Info,
  Divider,
  SubmitWrapper,
  ItemWrapper,
  StyledInput,
  StyledFormItem,
  buttonStyle,
} from './TrackInfectionModal.styled';

import { getTanRules, TAN_SECTION_LENGTH } from './InfectionModal.helper';

export const TrackInfectionModal = () => {
  const intl = useIntl();
  const queryClient = useQueryClient();
  const formReference = useRef(null);
  const [isLoading, setIsLoading] = useState(false);
  const [, closeModal] = useModal();

  const inputReference0 = useRef(null);
  const inputReference1 = useRef(null);
  const inputReference2 = useRef(null);
  const inputReferences = { inputReference0, inputReference1, inputReference2 };

  const handleMoveToNextInput = event => {
    const index = Number.parseInt(event.currentTarget.dataset.index, 10);
    if (event.target.value.length >= TAN_SECTION_LENGTH && index + 1 <= 2) {
      inputReferences[`inputReference${index + 1}`].current.focus();
    }
  };

  const refetchProcesses = () => {
    queryClient.invalidateQueries('processes');
    setIsLoading(false);
    closeModal();
  };

  const onSubmit = () => {
    formReference.current
      .validateFields()
      .then(() => {
        formReference.current.submit();
      })
      .catch(() => {
        notification.error({
          message: intl.formatMessage({
            id: 'modal.trackInfection.error.invalidTanFormat',
          }),
        });
      });
  };

  const handleResponse = response => {
    if (response === EMPTY_HISTORY) {
      notification.info({
        message: intl.formatMessage({
          id: 'modal.trackInfection.error.emptyUserTracing',
        }),
      });
    }
    if (response === INVALID_VERSION) {
      notification.error({
        message: intl.formatMessage({
          id: 'modal.trackInfection.error.invalidVersion',
        }),
      });
    }
    if (response === DECRYPTION_FAILED) {
      notification.error({
        message: intl.formatMessage({
          id: 'modal.trackInfection.error.decryptionFailed',
        }),
      });
    }
  };

  const onFinish = values => {
    const { tanChunk0, tanChunk1, tanChunk2 } = values;
    const tan = tanChunk0 + tanChunk1 + tanChunk2;
    const lang = intl.locale;
    setIsLoading(true);
    if (tan.endsWith('1')) {
      initiateUserTracingProcess(tan, lang)
        .then(response => {
          handleResponse(response);

          refetchProcesses();
        })
        .catch(() => {
          setIsLoading(false);
          notification.error({
            message: intl.formatMessage({
              id: 'modal.trackInfection.error.userTracing',
            }),
          });
        });
    } else {
      initiateStaticUserTracingProcess(tan, lang)
        .then(response => {
          handleResponse(response);
          refetchProcesses();
        })
        .catch(error => {
          console.error(error);
          setIsLoading(false);
          notification.error({
            message: intl.formatMessage({
              id: 'modal.trackInfection.error.staticTracing',
            }),
          });
        });
    }
  };

  return (
    <NewTrackingWrapper>
      <Info>{intl.formatMessage({ id: 'modal.trackInfection.info' })}</Info>
      <Form
        onFinish={onFinish}
        ref={formReference}
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
        validateMessages={null}
      >
        <ItemWrapper>
          <StyledFormItem
            name="tanChunk0"
            style={{ width: '30%', margin: 0 }}
            rules={getTanRules(intl, inputReference0)}
            validateTrigger={['onBlur', 'onFocus']}
            normalize={value => value.toUpperCase()}
          >
            <StyledInput
              maxLength={TAN_SECTION_LENGTH}
              onChange={handleMoveToNextInput}
              data-index={0}
              ref={inputReference0}
              placeholder={intl.formatMessage({
                id: 'tan',
              })}
              autoFocus
            />
          </StyledFormItem>
          <Divider> - </Divider>
          <StyledFormItem
            name="tanChunk1"
            style={{ width: '30%', margin: 0 }}
            rules={getTanRules(intl, inputReference1)}
            validateTrigger={['onBlur', 'onFocus']}
            normalize={value => value.toUpperCase()}
          >
            <StyledInput
              maxLength={TAN_SECTION_LENGTH}
              onChange={handleMoveToNextInput}
              data-index={1}
              ref={inputReference1}
            />
          </StyledFormItem>
          <Divider> - </Divider>
          <StyledFormItem
            name="tanChunk2"
            style={{ width: '30%', margin: 0 }}
            rules={getTanRules(intl, inputReference2)}
            validateTrigger={['onBlur', 'onFocus']}
            normalize={value => value.toUpperCase()}
          >
            <StyledInput
              maxLength={TAN_SECTION_LENGTH}
              onChange={handleMoveToNextInput}
              data-index={2}
              ref={inputReference2}
            />
          </StyledFormItem>
        </ItemWrapper>

        <SubmitWrapper>
          <Form.Item style={{ margin: '0 0 0 12px' }}>
            <Popconfirm
              placement="top"
              onConfirm={onSubmit}
              title={intl.formatMessage({
                id: 'modal.trackInfection.confirmation',
              })}
              okText={intl.formatMessage({
                id: 'modal.trackInfection.confirmButton',
              })}
              cancelText={intl.formatMessage({
                id: 'modal.trackInfection.declineButton',
              })}
              icon={<QuestionCircleOutlined style={{ color: 'red' }} />}
            >
              <Button style={buttonStyle} loading={isLoading}>
                {intl.formatMessage({ id: 'modal.trackInfection.button' })}
              </Button>
            </Popconfirm>
          </Form.Item>
        </SubmitWrapper>
      </Form>
    </NewTrackingWrapper>
  );
};
