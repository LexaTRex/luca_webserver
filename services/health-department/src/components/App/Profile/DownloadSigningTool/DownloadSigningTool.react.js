import React from 'react';
import { useIntl } from 'react-intl';
import { useQuery } from 'react-query';
import { Button } from 'antd';

// Api
import { getSigningTool } from 'network/api';

import {
  Wrapper,
  ChildWrapper,
  ButtonWrapper,
  StyledHeadline,
  StyledText,
  VersionTag,
  buttonStyle,
} from './DownloadSigningTool.styled';

export const DownloadSigningTool = ({ department }) => {
  const intl = useIntl();

  const { isLoading, error, data: signingTool } = useQuery('signingTool', () =>
    getSigningTool()
  );

  if (
    (department.signedPublicHDEKP && department.signedPublicHDSKP) ||
    isLoading ||
    error ||
    signingTool.length === 0
  )
    return null;

  return (
    <Wrapper>
      <ChildWrapper>
        <StyledHeadline>
          {intl.formatMessage({ id: 'profile.signingTool.download.title' })}
        </StyledHeadline>
        <StyledText>
          {intl.formatMessage(
            { id: 'profile.signingTool.download.info' },
            { br: <br /> }
          )}
        </StyledText>
        <ButtonWrapper>
          <Button
            href={`${signingTool[0].downloadUrl}`}
            target="_blank"
            style={buttonStyle}
          >
            {intl.formatMessage(
              { id: 'profile.signingTool.download.button' },
              { version: `v${signingTool[0].version}` }
            )}
          </Button>
          <VersionTag>
            {intl.formatMessage(
              { id: 'profile.signingTool.download.hash' },
              { hash: signingTool[0].hash }
            )}
          </VersionTag>
        </ButtonWrapper>
      </ChildWrapper>
    </Wrapper>
  );
};
