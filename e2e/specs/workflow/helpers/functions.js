import { removeHealthDepartmentPrivateKeyFile } from '../../health-department/helper/ui/handlePrivateKeyFile';

export const removeHDPrivateKeyFile = () => {
  cy.request({
    method: 'POST',
    url: '/api/internal/end2end/clean',
    headers: {
      'internal-access-authorization': 'bHVjYTpBOTNrcE01em1DdHZ2dEhO',
    },
  });
  removeHealthDepartmentPrivateKeyFile();
};
