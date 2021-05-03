import {
  NEW_E2E_EMAIL,
  NEW_E2E_FIRST_NAME,
  NEW_E2E_LAST_NAME,
  NEW_E2E_VALID_PASSWORD,
  TOO_SHORT_PASSWORD,
  NO_NUMBER_PASSWORD,
  NO_UPPER_CASE_PASSWORD,
  NO_LOWER_CASE_PASSWORD,
  NO_SPECIAL_CHAR_PASSWORD,
  enterEmail,
  enterName,
  setNewPassword,
  setLegals,
} from '../authentication.helper';

describe('Autentication', () => {
  beforeEach(() => {
    cy.visit('/');
  });
  describe('Register', () => {
    it('asks for registration with an unknown email', () => {
      enterEmail(NEW_E2E_EMAIL);
      cy.get('#password').should('not.exist');
      cy.getByCy('confirmRegister').should('exist');
    });
    it('collects the user name', () => {
      enterEmail(NEW_E2E_EMAIL);
      // Confirm
      cy.get('button[type=submit]').click();
      // Enter name
      enterName(NEW_E2E_FIRST_NAME, NEW_E2E_LAST_NAME);
      cy.getByCy('setPassword').should('exist');
    });
    describe('Setting password', { retries: 3 }, () => {
      describe('Password meets criteria', () => {
        it('sets the password ', () => {
          enterEmail(NEW_E2E_EMAIL);
          // Confirm
          cy.get('button[type=submit]').click();
          // Enter name
          enterName(NEW_E2E_FIRST_NAME, NEW_E2E_LAST_NAME);
          // Set password
          setNewPassword(NEW_E2E_VALID_PASSWORD, NEW_E2E_VALID_PASSWORD);
          cy.get('button[type=submit]').click();
          cy.getByCy('legalTerms').should('exist');
        });
      });
      describe('Password does not meet criteria', () => {
        describe('Password not set', () => {
          it('does not set the password ', () => {
            enterEmail(NEW_E2E_EMAIL);
            // Confirm
            cy.get('button[type=submit]').click();
            // Enter name
            enterName(NEW_E2E_FIRST_NAME, NEW_E2E_LAST_NAME);
            // Set no password
            cy.get('button[type=submit]').click();
            cy.getByCy('legalTerms').should('not.exist');
          });
        });
        describe('Wrong password confirmation', () => {
          it('does not set the password ', () => {
            enterEmail(NEW_E2E_EMAIL);
            // Confirm
            cy.get('button[type=submit]').click();
            // Enter name
            enterName(NEW_E2E_FIRST_NAME, NEW_E2E_LAST_NAME);
            // Set password
            setNewPassword(NEW_E2E_VALID_PASSWORD, 'Some0therVal1dPassword!');
            cy.getByCy('legalTerms').should('not.exist');
          });
        });
        describe('Password too short', () => {
          it('does not set the password ', () => {
            enterEmail(NEW_E2E_EMAIL);
            // Confirm
            cy.get('button[type=submit]').click();
            // Enter name
            enterName(NEW_E2E_FIRST_NAME, NEW_E2E_LAST_NAME);
            // Set password
            setNewPassword(TOO_SHORT_PASSWORD, TOO_SHORT_PASSWORD);
            cy.getByCy('legalTerms').should('not.exist');
          });
        });
        describe('Password with no number', () => {
          it('does not set the password ', () => {
            enterEmail(NEW_E2E_EMAIL);
            // Confirm
            cy.get('button[type=submit]').click();
            // Enter name
            enterName(NEW_E2E_FIRST_NAME, NEW_E2E_LAST_NAME);
            // Set password
            setNewPassword(NO_NUMBER_PASSWORD, NO_NUMBER_PASSWORD);
            cy.getByCy('legalTerms').should('not.exist');
          });
        });
        describe('Password with no upper case char', () => {
          it('does not set the password ', () => {
            enterEmail(NEW_E2E_EMAIL);
            // Confirm
            cy.get('button[type=submit]').click();
            // Enter name
            enterName(NEW_E2E_FIRST_NAME, NEW_E2E_LAST_NAME);
            // Set password
            setNewPassword(NO_UPPER_CASE_PASSWORD, NO_UPPER_CASE_PASSWORD);
            cy.getByCy('legalTerms').should('not.exist');
          });
        });
        describe('Password with no lower case char', () => {
          it('does not set the password ', () => {
            enterEmail(NEW_E2E_EMAIL);
            // Confirm
            cy.get('button[type=submit]').click();
            // Enter name
            enterName(NEW_E2E_FIRST_NAME, NEW_E2E_LAST_NAME);
            // Set password
            setNewPassword(NO_LOWER_CASE_PASSWORD, NO_LOWER_CASE_PASSWORD);
            cy.getByCy('legalTerms').should('not.exist');
          });
        });
        describe('Password with no special char', () => {
          it('does not set the password ', () => {
            enterEmail(NEW_E2E_EMAIL);
            // Confirm
            cy.get('button[type=submit]').click();
            // Enter name
            enterName(NEW_E2E_FIRST_NAME, NEW_E2E_LAST_NAME);
            // Set password
            setNewPassword(NO_SPECIAL_CHAR_PASSWORD, NO_SPECIAL_CHAR_PASSWORD);
            cy.getByCy('legalTerms').should('not.exist');
          });
        });
      });
    });
    describe('Accept legals', () => {
      describe('Not all legals accepted', () => {
        describe('Terms not accepted', () => {
          it('does not set the legals', () => {
            enterEmail(NEW_E2E_EMAIL);
            // Confirm
            cy.get('button[type=submit]').click();
            // Enter name
            enterName(NEW_E2E_FIRST_NAME, NEW_E2E_LAST_NAME);
            // Set password
            setNewPassword(NEW_E2E_VALID_PASSWORD, NEW_E2E_VALID_PASSWORD);
            // Set legal
            setLegals(false, true);
            cy.getByCy('finishRegister').should('not.exist');
          });
        });
        describe('AVV not accepted', () => {
          it('does not set the legals', () => {
            enterEmail(NEW_E2E_EMAIL);
            // Confirm
            cy.get('button[type=submit]').click();
            // Enter name
            enterName(NEW_E2E_FIRST_NAME, NEW_E2E_LAST_NAME);
            // Set password
            setNewPassword(NEW_E2E_VALID_PASSWORD, NEW_E2E_VALID_PASSWORD);
            // Set legal
            setLegals(true, false);
            cy.getByCy('finishRegister').should('not.exist');
          });
        });
        describe('Both not accepted', () => {
          it('does not set the legals', () => {
            enterEmail(NEW_E2E_EMAIL);
            // Confirm
            cy.get('button[type=submit]').click();
            // Enter name
            enterName(NEW_E2E_FIRST_NAME, NEW_E2E_LAST_NAME);
            // Set password
            setNewPassword(NEW_E2E_VALID_PASSWORD, NEW_E2E_VALID_PASSWORD);
            // Set legal
            setLegals(false, false);
            cy.getByCy('finishRegister').should('not.exist');
          });
        });
      });
      describe('All legals accepted', () => {
        it('finishes the rgistration', () => {
          enterEmail(NEW_E2E_EMAIL);
          // Confirm
          cy.get('button[type=submit]').click();
          // Enter name
          enterName(NEW_E2E_FIRST_NAME, NEW_E2E_LAST_NAME);
          // Set password
          setNewPassword(NEW_E2E_VALID_PASSWORD, NEW_E2E_VALID_PASSWORD);
          // Set legal
          setLegals(true, true);
          cy.getByCy('finishRegister').should('exist');
          cy.get('button').click();
          cy.get('#email').should('exist');
        });
      });
    });
  });
});
