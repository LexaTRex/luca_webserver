import React, { useEffect, useState } from 'react';
import { useIntl } from 'react-intl';

// Api
import { getHealthDepartment } from 'network/api';

// Components
import { VerificationTag } from 'components/App/VerificationTag';
import { VersionFooter } from 'components/App/VersionFooter';
import { Divider } from 'components/general';
import { BackButton } from './BackButton';
import { ProfileOverview } from './ProfileOverview';
import { DownloadSigningTool } from './DownloadSigningTool';
import { AuditLogsDownloads } from './AuditLogsDownloads';
import { ChangePasswordView } from './ChangePasswordView';
import {
  ProfileWrapper,
  StyledChildWrapper,
  Header,
  VerificationTagWrapper,
  VersionFooterWrapper,
  InformationWrapper,
} from './Profile.styled';
import { ContactInformation } from './ContactInformation';

export const Profile = ({ profileData }) => {
  const intl = useIntl();
  const [department, setDepartment] = useState(null);

  useEffect(() => {
    if (!profileData) return;
    getHealthDepartment(profileData.departmentId)
      .then(newDepartment => {
        setDepartment(newDepartment);
      })
      .catch(error => console.error(error));
  }, [profileData]);

  if (!department) return null;

  return (
    <>
      <ProfileWrapper>
        <StyledChildWrapper>
          <BackButton />
          <Header>
            {intl.formatMessage({ id: 'navigation.profile' })}
            <VerificationTagWrapper>
              <VerificationTag />
            </VerificationTagWrapper>
          </Header>
          <DownloadSigningTool department={department} />
          <ProfileOverview me={profileData} department={department} />
        </StyledChildWrapper>
        <Divider />
        <StyledChildWrapper>
          <ChangePasswordView />
        </StyledChildWrapper>
      </ProfileWrapper>

      <InformationWrapper>
        {profileData.isAdmin && (
          <>
            <Header>
              {intl.formatMessage({
                id: 'navigation.comprehensiveInformation',
              })}
            </Header>
            <ContactInformation department={department} />
            <StyledChildWrapper>
              <AuditLogsDownloads />
            </StyledChildWrapper>
          </>
        )}
        <VersionFooterWrapper>
          <VersionFooter />
        </VersionFooterWrapper>
      </InformationWrapper>
    </>
  );
};
