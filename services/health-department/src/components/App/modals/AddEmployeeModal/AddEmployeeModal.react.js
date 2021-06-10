import React, { useState } from 'react';
import { AddEmployeeForm } from './AddEmployeeForm';
import { ConfirmPassword } from './ConfirmPassword';

export const AddEmployeeModal = () => {
  const [newUserPassword, setNewUserPassword] = useState(null);

  return (
    <>
      {!newUserPassword ? (
        <AddEmployeeForm setNewUserPassword={setNewUserPassword} />
      ) : (
        <ConfirmPassword password={newUserPassword} />
      )}
    </>
  );
};
