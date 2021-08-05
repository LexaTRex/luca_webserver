import React, { useMemo } from 'react';
import { useIntl } from 'react-intl';
import { RequestContent } from '../../ShareData.styled';
import {
  StyledLabel,
  StyledValue,
  StyledHealthDepartment,
} from '../ShareDataStep.styled';
import { VerificationTag } from './VerificationTag';

export const HealthDepartmentInfo = ({ transfers }) => {
  const intl = useIntl();

  const healthDepartments = useMemo(() => {
    const departments = {};

    if (!transfers) return [];

    for (const transfer of transfers) {
      departments[transfer.department.name] = transfer.department;
    }

    return Object.values(departments);
  }, [transfers]);

  return (
    <RequestContent>
      <StyledLabel>
        {intl.formatMessage({ id: 'shareData.inquiringHD' })}
      </StyledLabel>
      {healthDepartments.map(healthDepartment => (
        <StyledValue key={healthDepartment.name}>
          <StyledHealthDepartment>
            {healthDepartment.name}
            <VerificationTag healthDepartment={healthDepartment} />
          </StyledHealthDepartment>
        </StyledValue>
      ))}
    </RequestContent>
  );
};
