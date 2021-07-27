import React from 'react';
import { useIntl } from 'react-intl';
import { useQuery } from 'react-query';
import { getVersion } from 'network/static';

import { PrimaryButton } from 'general';
import { useModal } from 'components/hooks/useModal';
import { GITLAB_LINK } from 'constants/links';
import { Wrapper, Description, Version, Link } from './VersionModal.styled';

export const VersionModal = () => {
  const intl = useIntl();
  const [, closeModal] = useModal();
  const { isSuccess, data: info } = useQuery('version', getVersion);

  return (
    <Wrapper>
      <Link target="_blank" href={GITLAB_LINK} rel="noopener noreferrer">
        {intl.formatMessage({ id: 'location.footer.repository' })}
      </Link>
      <Description>
        <Version>
          {isSuccess && (
            <>
              <span>luca scanner</span>
              <br />
              <span>{`(${info.version}#${info.commit})`}</span>
            </>
          )}
        </Version>
      </Description>
      <PrimaryButton onClick={() => closeModal()}>
        {intl.formatMessage({
          id: 'location.modal.okay',
        })}
      </PrimaryButton>
    </Wrapper>
  );
};
