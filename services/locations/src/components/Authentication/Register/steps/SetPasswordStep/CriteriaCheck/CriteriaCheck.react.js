import React from 'react';
import { MinusOutlined, CheckOutlined } from '@ant-design/icons';

import { IS_MOBILE } from 'constants/environment';

import { Criteria, CriteriaIcon } from './CriteriaCheck.styled';
import { useCriteria } from './CriteriaCheck.helper';

export const CriteriaCheck = ({ check }) => {
  const criterion = useCriteria(check);

  return (
    <>
      {!IS_MOBILE &&
        criterion.map(criteria => (
          <Criteria key={criteria.type} passedCriteria={criteria.ok}>
            <CriteriaIcon>
              {criteria.ok ? <CheckOutlined /> : <MinusOutlined />}
            </CriteriaIcon>
            <div>{criteria.intl}</div>
          </Criteria>
        ))}
    </>
  );
};
