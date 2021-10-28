import { loginHealthDepartment } from '../../helper/api/auth.helper';
import { verifyLoggedIn } from '../../helper/ui/login.helper';

import {
  ANT_MODAL,
  ANT_NOTIFICATION_NOTICE,
} from '../../constants/selectorKeys';

import { getDOMElement } from '../../utils/selectors';
import { shouldBeVisible } from '../../utils/assertions';
import {
  uploadHealthDepartmentPrivateKeyFileLargeSize,
  uploadWrongHealthDepartmentPrivateKeyFile,
  uploadWrongHealthDepartmentPrivateKeyFileType,
  uploadWrongHealthDepartmentPrivateKeyFileTypeReUploadCorrectFile,
} from '../../helper/ui/handlePrivateKeyFile';

describe('Authentication', () => {
  describe('Health Department / Authentication / Login / Private key upload', () => {
    describe('When uploading a wrong key', () => {
      describe('When Uploading private key file that is too large', () => {
        it('A notification occours stating that the key is too large', () => {
          loginHealthDepartment();
          uploadHealthDepartmentPrivateKeyFileLargeSize();
          shouldBeVisible(
            getDOMElement(ANT_NOTIFICATION_NOTICE, { timeout: 10000 })
          );
          shouldBeVisible(getDOMElement(ANT_MODAL));
          cy.logoutHD();
        });
      });
      describe('When uploading a Private key that has the wrong key format', () => {
        it('A notification occours stating that a wrong key file has been uploaded', () => {
          loginHealthDepartment();
          uploadWrongHealthDepartmentPrivateKeyFileType();
          shouldBeVisible(
            getDOMElement(ANT_NOTIFICATION_NOTICE, { timeout: 10000 })
          );
          shouldBeVisible(getDOMElement(ANT_MODAL));
          cy.logoutHD();
        });
      });
      describe('When uploading a wrong Private key', () => {
        it('it will reject the private key file and a notification should occur stating that a wrong key has been uploaded', () => {
          loginHealthDepartment();
          uploadWrongHealthDepartmentPrivateKeyFile();
          shouldBeVisible(
            getDOMElement(ANT_NOTIFICATION_NOTICE, { timeout: 10000 })
          );
          shouldBeVisible(getDOMElement(ANT_MODAL));
          cy.logoutHD();
        });
      });
    });
    describe('Try again key Re-upload', () => {
      describe('When uploading a Wrong private key and afterwards re-upload a correct private key', () => {
        it('it should reject the key upload and a notification should show stating that a wrong key has been uploaded, after that the correct private key is being uploaded and a notification occurs stating the the private key has been successfully uploaded as well the modal should close', () => {
          loginHealthDepartment();
          uploadWrongHealthDepartmentPrivateKeyFileTypeReUploadCorrectFile();
          verifyLoggedIn();
          cy.logoutHD();
        });
      });
    });
  });
});
