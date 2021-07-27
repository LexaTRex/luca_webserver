import React from 'react';

import { Col, Input, Row, Grid } from 'antd';

import { useAddressValidator } from 'components/hooks/useValidators';

import { FormItem } from '../FormItem';

const { useBreakpoint } = Grid;

export const AddressInput = ({ formFieldNames }) => {
  const screens = useBreakpoint();

  const {
    streetValidator,
    houseNoValidator,
    zipCodValidator,
    cityValidator,
  } = useAddressValidator();

  return (
    <>
      <Row gutter={16} wrap>
        <Col span={!screens.md ? 24 : 20}>
          <FormItem
            generatedUUID={formFieldNames.street}
            validator={streetValidator}
            fieldName="street"
            width="50%"
            isMandatory
          />
        </Col>
        <Col span={!screens.md ? 24 : 4}>
          <FormItem
            generatedUUID={formFieldNames.number}
            validator={houseNoValidator}
            fieldName="number"
            isMandatory
          />
        </Col>
      </Row>
      <Input.Group>
        <Row gutter={16}>
          <Col span={!screens.md ? 24 : 4}>
            <FormItem
              generatedUUID={formFieldNames.zip}
              validator={zipCodValidator}
              fieldName="zip"
              isMandatory
            />
          </Col>
          <Col span={!screens.md ? 24 : 20}>
            <FormItem
              generatedUUID={formFieldNames.city}
              validator={cityValidator}
              fieldName="city"
              isMandatory
            />
          </Col>
        </Row>
      </Input.Group>
    </>
  );
};
