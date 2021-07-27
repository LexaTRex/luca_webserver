import React from 'react';
import { useIntl } from 'react-intl';

import {
  AdditionalDataWrapper,
  ContentWrapper,
  DataName,
} from './AdditionalData.styled';

export const AdditionalData = ({ trace }) => {
  const intl = useIntl();
  const getAdditionalDataName = key => {
    if (key !== 'table') return key;
    // localize special additional data attributes
    return intl.formatMessage({
      id: 'contactPersonTable.additionalData.table',
    });
  };

  let additionalDataSource;
  if (trace.additionalData) {
    additionalDataSource = Object.entries(trace.additionalData).map(
      (dataPair, index) => ({
        index,
        name: getAdditionalDataName(dataPair[0]),
        content: dataPair[1],
      })
    );
  }
  return (
    <AdditionalDataWrapper>
      {additionalDataSource ? (
        additionalDataSource.map(data => (
          <ContentWrapper key={data.index}>
            <DataName>{data.name}</DataName>
            <div>{data.content}</div>
          </ContentWrapper>
        ))
      ) : (
        <div>{intl.formatMessage({ id: 'traceTable.noAdditionalData' })}</div>
      )}
    </AdditionalDataWrapper>
  );
};
