import React, { useState } from 'react';

import { v4 as uuidv4 } from 'uuid';
import { useIntl } from 'react-intl';
import { Button, Form, Input } from 'antd';
import { PlusCircleOutlined } from '@ant-design/icons';

import bin from 'assets/bin.svg';

import { YesNoSelection } from '../../../generalOnboarding/YesNoSelection';

import {
  Header,
  Wrapper,
  Description,
  ButtonWrapper,
  nextButtonStyles,
  backButtonStyles,
} from '../../../generalOnboarding/Onboarding.styled';
import {
  AddArea,
  TrashIcon,
  AddAreaText,
  RemoveButton,
  InputContainer,
  AddAreaWrapper,
} from './AreaSelection.styled';

export const AreaSelection = ({ groupType, setAreas, next, back }) => {
  const intl = useIntl();
  const [isAreaSelection, setIsAreaSelection] = useState(false);
  const [temporaryAreas, setTemporaryAreas] = useState([]);

  const onYes = () => {
    setIsAreaSelection(true);
    setTemporaryAreas([{ id: uuidv4() }]);
  };

  const onFinish = values => {
    const areas = temporaryAreas.map(area => values[`area${area.id}`]);
    const areasWithName = areas.filter(area => area !== undefined);
    setAreas(areasWithName);
    next();
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
          <Form onFinish={onFinish}>
            {temporaryAreas.map((temporaryArea, index) => (
              <Form.Item
                key={temporaryArea.id}
                label={intl.formatMessage({ id: 'area' }, { key: index + 1 })}
                name={`area${temporaryArea.id}`}
              >
                <InputContainer>
                  <Input autoFocus />
                  <RemoveButton
                    onClick={() => {
                      setTemporaryAreas([
                        ...temporaryAreas.slice(0, index),
                        ...temporaryAreas.slice(
                          index + 1,
                          temporaryAreas.length
                        ),
                      ]);
                    }}
                  >
                    <TrashIcon src={bin} />
                  </RemoveButton>
                </InputContainer>
              </Form.Item>
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
              <Button style={backButtonStyles} onClick={back}>
                {intl.formatMessage({
                  id: 'authentication.form.button.back',
                })}
              </Button>
              <Button style={nextButtonStyles} htmlType="submit">
                {intl.formatMessage({
                  id: 'authentication.form.button.next',
                })}
              </Button>
            </ButtonWrapper>
          </Form>
        </>
      )}
    </Wrapper>
  );
};
