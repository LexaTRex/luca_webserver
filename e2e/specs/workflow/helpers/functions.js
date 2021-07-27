import {removeHealthDepartmentPrivateKeyFile} from "../../health-department/helper/ui/login.helper";

export const clean = () => {
  cy.request('POST', '/api/internal/end2end/clean');
  removeHealthDepartmentPrivateKeyFile();
};
