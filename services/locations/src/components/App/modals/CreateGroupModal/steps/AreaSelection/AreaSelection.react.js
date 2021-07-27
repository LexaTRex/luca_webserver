import React, { useRef, useState } from 'react';

import { v4 as uuidv4 } from 'uuid';
import { useIntl } from 'react-intl';
import { Form, Input } from 'antd';
import { PlusCircleOutlined } from '@ant-design/icons';
import {
  PrimaryButton,
  SecondaryButton,
} from 'components/general/Buttons.styled';

import bin from 'assets/bin.svg';

import { useLocationNameValidator } from 'components/hooks/useValidators';

import { YesNoSelection } from '../../../generalOnboarding/YesNoSelection';

import {
  Header,
  Wrapper,
  Description,
  ButtonWrapper,
} from '../../../generalOnboarding/Onboarding.styled';
import {
  AddArea,
  TrashIcon,
  AddAreaText,
  RemoveButton,
  InputContainer,
  AddAreaWrapper,
  FormItemWrapper,
} from './AreaSelection.styled';
import { IndoorToggle } from '../../../../Dashboard/IndoorToggle';

export const AreaSelection = ({ groupType, setAreas, next, back }) => {
  const intl = useIntl();
  const formReference = useRef(null);
  const locationNameValidator = useLocationNameValidator('locationName');
  const [isAreaSelection, setIsAreaSelection] = useState(false);
  const [temporaryAreas, setTemporaryAreas] = useState([]);

  const onYes = () => {
    setIsAreaSelection(true);
    setTemporaryAreas([{ id: uuidv4() }]);
  };

  const onFinish = values => {
    const areas = temporaryAreas.map(area => ({
      name: values[`area${area.id}`],
      isIndoor: values[`area${area.id}-type`],
    }));
    const areasWithName = areas.filter(area => area.name !== undefined);
    setAreas(areasWithName);
    next();
  };

  const indoorToggleHandler = (target, value) => {
    formReference.current.setFieldsValue({
      [target]: value,
    });
  };

  return (
    <Wrapper>
      <Header>
        {intl.formatMessage({
          id: `modal.createGroup.areaSelection.${groupType}.title`,
        })}
      </Header>
      {!isAreaSelection ? (
        <>
          <Description>
            {intl.formatMessage({
              id: `modal.createGroup.areaSelection.${groupType}.description`,
            })}
          </Description>
          <YesNoSelection onYes={onYes} onNo={next} onBack={back} />
        </>
      ) : (
        <>
          <Form onFinish={onFinish} ref={formReference}>
            {temporaryAreas.map((temporaryArea, index) => (
              <FormItemWrapper key={temporaryArea.id}>
                <InputContainer width="63%" marginRight="16px">
                  <Form.Item
                    label={intl.formatMessage(
                      { id: 'area' },
                      { key: index + 1 }
                    )}
                    name={`area${temporaryArea.id}`}
                    rules={locationNameValidator}
                  >
                    <Input autoFocus data-cy="areaNameInput" />
                  </Form.Item>
                </InputContainer>

                <InputContainer width="37%">
                  <Form.Item
                    label={intl.formatMessage({
                      id: 'settings.location.indoorToggle.description.label',
                    })}
                    name={`area${temporaryArea.id}-type`}
                    rules={[
                      {
                        required: true,
                        message: intl.formatMessage({
                          id: 'error.isIndoor',
                        }),
                      },
                    ]}
                  >
                    <IndoorToggle
                      callback={value =>
                        indoorToggleHandler(
                          `area${temporaryArea.id}-type`,
                          value
                        )
                      }
                    />
                  </Form.Item>
                </InputContainer>
                <RemoveButton
                  style={{ marginTop: 6 }}
                  onClick={() => {
                    setTemporaryAreas([
                      ...temporaryAreas.slice(0, index),
                      ...temporaryAreas.slice(index + 1, temporaryAreas.length),
                    ]);
                  }}
                >
                  <TrashIcon src={bin} />
                </RemoveButton>
              </FormItemWrapper>
            ))}
            <AddAreaWrapper>
              <AddArea
                onClick={() =>
                  setTemporaryAreas([...temporaryAreas, { id: uuidv4() }])
                }
              >
                <AddAreaText>
                  {intl.formatMessage({ id: 'modal.createGroup.addArea' })}
                </AddAreaText>
                <PlusCircleOutlined style={{ fontSize: 20 }} />
              </AddArea>
            </AddAreaWrapper>
            <ButtonWrapper multipleButtons>
              <SecondaryButton onClick={back}>
                {intl.formatMessage({
                  id: 'authentication.form.button.back',
                })}
              </SecondaryButton>
              <PrimaryButton htmlType="submit">
                {intl.formatMessage({
                  id: 'authentication.form.button.next',
                })}
              </PrimaryButton>
            </ButtonWrapper>
          </Form>
        </>
      )}
    </Wrapper>
  );
};
