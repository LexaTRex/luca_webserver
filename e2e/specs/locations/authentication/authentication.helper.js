export const NEW_E2E_EMAIL = 'unknown@nexenio.com';
export const NEW_E2E_FIRST_NAME = 'E2E';
export const NEW_E2E_LAST_NAME = 'User';
export const NEW_E2E_VALID_PASSWORD = 'Nexenio123!';

export const TOO_SHORT_PASSWORD = 'Abc1!';
export const NO_NUMBER_PASSWORD = 'Abcdefghi!';
export const NO_UPPER_CASE_PASSWORD = 'abcdefghi1!';
export const NO_LOWER_CASE_PASSWORD = 'ABCDEFGHI1!';
export const NO_SPECIAL_CHAR_PASSWORD = 'ABCDEFGHI1';

export const enterEmail = email => {
  cy.get('#email').type(email);
};

export const confirmNewAccountRegistration = () => {
  // wait for transition to next step
  cy.getByCy('confirmRegister');
  // Confirm
  cy.get('button[type=submit]').click();
};

export const enterPassword = password => {
  cy.get('#password').type(password);
  cy.get('button[type=submit]').click();
};

export const enterName = (firstName, lastName) => {
  cy.get('#firstName').type(firstName);
  cy.get('#lastName').type(lastName);
  cy.get('button[type=submit]').click();
};

export const setNewPassword = (password, confirmPassword) => {
  cy.get('#password').type(password);
  cy.get('#passwordConfirm').type(confirmPassword);
  cy.get('button[type=submit]').click();
};

export const setLegals = (terms, avv) => {
  if (terms) {
    cy.get('#termsAndConditions').click();
  }
  if (avv) {
    cy.get('#avv').click();
  }
  cy.get('button[type=submit]').click();
};
