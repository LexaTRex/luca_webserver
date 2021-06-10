import React, { useEffect, useState } from 'react';

// Api
import { getHealthDepartment } from 'network/api';

// Components
import { ProfileOverview } from './ProfileOverview';
import { ChangePasswordView } from './ChangePasswordView';
import { ProfileWrapper, StyledChildWrapper } from './Profile.styled';

export const Profile = ({ profileData }) => {
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
          <ProfileOverview me={profileData} department={department} />
        </StyledChildWrapper>
        <StyledChildWrapper>
          <ChangePasswordView />
        </StyledChildWrapper>
      </ProfileWrapper>
    </>
  );
};
