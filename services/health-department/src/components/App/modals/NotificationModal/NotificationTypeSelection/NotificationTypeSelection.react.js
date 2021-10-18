import React from 'react';
import { useIntl } from 'react-intl';

import { RISK_LEVEL_2, RISK_LEVEL_3 } from 'constants/riskLevels';

import {
  Section,
  SwitchWrapper,
  StyledSwitch,
  SwitchDescription,
} from '../NotificationModal.styled';

export const NotificationTypeSelection = ({ setLevel, level }) => {
  const intl = useIntl();

  const setRiskLevel2 = checked =>
    checked ? setLevel(RISK_LEVEL_2) : setLevel(RISK_LEVEL_3);

  const setRiskLevel3 = checked =>
    checked ? setLevel(RISK_LEVEL_3) : setLevel(RISK_LEVEL_2);

  return (
    <Section>
      <SwitchWrapper>
        <StyledSwitch
          checked={level === RISK_LEVEL_2}
          onChange={setRiskLevel2}
        />
        <SwitchDescription>
          {intl.formatMessage({
            id: 'modal.notification.selection.potentialInfectionRisk',
          })}
        </SwitchDescription>
      </SwitchWrapper>
      <SwitchWrapper>
        <StyledSwitch
          checked={level === RISK_LEVEL_3}
          onChange={setRiskLevel3}
        />
        <SwitchDescription>
          {intl.formatMessage({
            id: 'modal.notification.selection.elevatedInfectionRisk',
          })}
        </SwitchDescription>
      </SwitchWrapper>
    </Section>
  );
};
