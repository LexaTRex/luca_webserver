import {
  enterEmail,
  enterName,
  setNewPassword,
  clearPasswordFields,
  registerDoesNotExist,
  confirmNewAccountRegistration,
  getNewAccountButton,
  getPasswordSubmitButton,
  isValidationErrorShown,
  getSetPassword,
  getLegalTerms,
} from '../authentication.helper';

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
  SOME_OTHER_INVALID_PASSWORD,
} from '../../constants/inputs';

import { DELETE_UNKOWN_OPERATOR } from '../../constants/databaseQueries';

import {
  AVV_CHECKBOX,
  TERMS_AND_CONDITIONS_CHECKBOX,
  FINISH_REGISTER,
  LEGAL_TERMS_SUBMIT_BUTTON,
  END_REGISTRATION_BUTTON,
  EMAIL_FIELD,
} from '../../constants/selectorKeys';

import { REGISTER_ROUTE } from '../../constants/routes';

import { shouldBeVisible } from '../../utils/assertions';
import { getByCy, getDOMElement } from '../../utils/selectors';

describe('Authentication', () => {
  before(() => cy.executeQuery(DELETE_UNKOWN_OPERATOR));
  beforeEach(() => {
    cy.visit(REGISTER_ROUTE);
  });

  describe('Registration', () => {
    it('registers a new user and handles errors', () => {
      // Enter new email
      enterEmail(NEW_E2E_EMAIL);
      getNewAccountButton().click();
      // Confirm mail correct
      confirmNewAccountRegistration();
      // Enter name
      enterName(NEW_E2E_FIRST_NAME, NEW_E2E_LAST_NAME);
      // Set password - Starting with error handling
      shouldBeVisible(getSetPassword());
      // No input
      getPasswordSubmitButton().click();
      isValidationErrorShown();
      // Incorrect PW repeat
      setNewPassword(NEW_E2E_VALID_PASSWORD, SOME_OTHER_INVALID_PASSWORD);
      isValidationErrorShown();
      clearPasswordFields();
      // PW too short
      setNewPassword(TOO_SHORT_PASSWORD, TOO_SHORT_PASSWORD);
      isValidationErrorShown();
      clearPasswordFields();
      // PW has no number
      setNewPassword(NO_NUMBER_PASSWORD, NO_NUMBER_PASSWORD);
      isValidationErrorShown();
      clearPasswordFields();
      // PW has no uppercase
      setNewPassword(NO_UPPER_CASE_PASSWORD, NO_UPPER_CASE_PASSWORD);
      isValidationErrorShown();
      clearPasswordFields();
      // PW has no lowercase
      setNewPassword(NO_LOWER_CASE_PASSWORD, NO_LOWER_CASE_PASSWORD);
      isValidationErrorShown();
      clearPasswordFields();
      // PW has no special char
      setNewPassword(NO_SPECIAL_CHAR_PASSWORD, NO_SPECIAL_CHAR_PASSWORD);
      isValidationErrorShown();
      clearPasswordFields();
      // Set password - Happy case
      setNewPassword(NEW_E2E_VALID_PASSWORD, NEW_E2E_VALID_PASSWORD);
      // Set legal - Starting with error handling
      shouldBeVisible(getLegalTerms());
      // None accepted
      registerDoesNotExist();
      //  No legals
      getByCy(AVV_CHECKBOX).check();
      registerDoesNotExist();
      // No AVV
      getByCy(AVV_CHECKBOX).uncheck();
      getByCy(TERMS_AND_CONDITIONS_CHECKBOX).check();
      registerDoesNotExist();
      // Set legals - Happy case
      getByCy(AVV_CHECKBOX).check();
      getByCy(LEGAL_TERMS_SUBMIT_BUTTON).click();
      // Finish
      shouldBeVisible(getByCy(FINISH_REGISTER));
      getByCy(END_REGISTRATION_BUTTON).click();
      shouldBeVisible(getDOMElement(EMAIL_FIELD));
    });
  });
});
