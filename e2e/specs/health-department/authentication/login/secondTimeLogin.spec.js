import { loginHealthDepartment } from '../../helper/api/auth.helper';
import { verifyLoggedIn } from '../../helper/ui/login.helper';
import { addHealthDepartmentPrivateKeyFile } from '../../helper/ui/handlePrivateKeyFile';

describe('Authentication', () => {
  describe('Health Department / Authentication / Login', () => {
    describe('when a user login for the second time', () => {
      it('ask to upload private key and redirect to tracking page', () => {
        loginHealthDepartment();
        addHealthDepartmentPrivateKeyFile();
        verifyLoggedIn();
        cy.logoutHD();
      });
    });
  });
});
