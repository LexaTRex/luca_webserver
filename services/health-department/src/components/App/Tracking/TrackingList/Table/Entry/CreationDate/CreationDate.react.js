import React from 'react';
import { getFormattedDate } from 'utils/time';

export const CreationDate = ({ createdAt }) => {
  return <>{getFormattedDate(createdAt)}</>;
};
