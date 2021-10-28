import { shouldBeVisible, shouldNotExist } from '../utils/assertions';
import { getByCy, getDOMElement } from '../utils/selectors';

import {
  EMAIL_FIELD,
  CONFIRM_REGISTER_BUTTON,
  ANT_VALIDATION_ERROR,
  CREATE_NEW_ACCOUNT_BUTTON,
  SET_PASSWORD_SUBMIT_BUTTON,
  SET_PASSWORD,
  LEGAL_TERMS,
  LEGAL_TERMS_SUBMIT_BUTTON,
  CONFIRM_REGISTER,
  REGISTER_FIRST_NAME,
  REGISTER_LAST_NAME,
  CONFIRM_NAME_BUTTON,
  PASSWORD,
  SET_PASSWORD_FIELD,
  SET_PASSWORD_CONFIRM_FIELD,
  FINISH_REGISTER,
  LOGIN_SUBMIT_BUTTON,
} from '../constants/selectorKeys';

export const isValidationErrorShown = () =>
  shouldBeVisible(getDOMElement(ANT_VALIDATION_ERROR));

export const enterEmail = email => {
  getDOMElement(EMAIL_FIELD).type(email);
};

export const getNewAccountButton = () => getByCy(CREATE_NEW_ACCOUNT_BUTTON);

export const confirmNewAccountRegistration = () => {
  // wait for transition to next step
  shouldBeVisible(getByCy(CONFIRM_REGISTER));
  // Confirm
  getByCy(CONFIRM_REGISTER_BUTTON).click();
};

export const enterName = (firstName, lastName) => {
  getByCy(REGISTER_FIRST_NAME).type(firstName);
  getByCy(REGISTER_LAST_NAME).type(lastName);
  getByCy(CONFIRM_NAME_BUTTON).click();
};

export const getSetPassword = () => getByCy(SET_PASSWORD);

export const getPasswordSubmitButton = () =>
  getByCy(SET_PASSWORD_SUBMIT_BUTTON);

export const enterPassword = password => {
  getDOMElement(PASSWORD).type(password);
  getByCy(LOGIN_SUBMIT_BUTTON).click();
};

export const setNewPassword = (password, confirmPassword) => {
  getByCy(SET_PASSWORD_FIELD).type(password);
  getByCy(SET_PASSWORD_CONFIRM_FIELD).type(confirmPassword);
  getPasswordSubmitButton().click();
};

export const clearPasswordFields = () => {
  getByCy(SET_PASSWORD_FIELD).clear();
  getByCy(SET_PASSWORD_CONFIRM_FIELD).clear();
};

export const getLegalTerms = () => getByCy(LEGAL_TERMS);

export const registerDoesNotExist = () => {
  getByCy(LEGAL_TERMS_SUBMIT_BUTTON).click();
  shouldNotExist(getByCy(FINISH_REGISTER));
};
