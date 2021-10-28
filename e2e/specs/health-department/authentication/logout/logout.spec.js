/* eslint-disable */
import { loginHealthDepartment } from '../../helper/api/auth.helper';
import { addHealthDepartmentPrivateKeyFile } from '../../helper/ui/handlePrivateKeyFile';

describe('Health Department / Authentication / Logout', () => {
  beforeEach(() => {
    loginHealthDepartment();
    addHealthDepartmentPrivateKeyFile();
  });
  describe('when an operator logs out', () => {
    it('logs the user out successfully', () => {
      cy.logoutHD().then(response => {
        expect(response.status).to.eq(204);
      });
    });
  });
});
