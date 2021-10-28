import React from 'react';
import { Tick } from 'react-crude-animated-tick';

import { SuccessWrapper } from './Success.styled';

export const Success = () => (
  <SuccessWrapper>
    <Tick size={100} />
  </SuccessWrapper>
);
