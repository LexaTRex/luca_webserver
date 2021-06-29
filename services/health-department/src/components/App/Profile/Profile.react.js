import React, { useEffect, useState } from 'react';
import { useIntl } from 'react-intl';

// Api
import { getHealthDepartment } from 'network/api';

// Components
import { BackButton } from './BackButton';
import { ProfileOverview } from './ProfileOverview';
import { ChangePasswordView } from './ChangePasswordView';
import {
  ProfileWrapper,
  StyledChildWrapper,
  ProfileHeader,
} from './Profile.styled';

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
          <ProfileHeader>
            {intl.formatMessage({ id: 'navigation.profile' })}
          </ProfileHeader>
          <ProfileOverview me={profileData} department={department} />
        </StyledChildWrapper>
        <StyledChildWrapper>
          <ChangePasswordView />
        </StyledChildWrapper>
      </ProfileWrapper>
    </>
  );
};
