import { removeHealthDepartmentPrivateKeyFile } from '../../health-department/helper/ui/login.helper';

export const removeHDPrivateKeyFile = () => {
  cy.request('POST', '/api/internal/end2end/clean');
  removeHealthDepartmentPrivateKeyFile();
};
