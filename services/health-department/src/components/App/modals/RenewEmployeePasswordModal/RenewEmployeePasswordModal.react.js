import React, { useState } from 'react';

import { CreateNewPassword } from './CreateNewPassword';
import { ConfirmNewPassword } from './ConfirmNewPassword';

export const RenewEmployeePasswordModal = ({ employee }) => {
  const [newUserPassword, setNewUserPassword] = useState(null);

  return (
    <>
      {!newUserPassword ? (
        <CreateNewPassword
          employee={employee}
          setNewUserPassword={setNewUserPassword}
        />
      ) : (
        <ConfirmNewPassword password={newUserPassword} />
      )}
    </>
  );
};
