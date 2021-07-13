import faker from 'faker';

faker.locale = 'de';

export function fillForm({
  firstName = faker.name.firstName(),
  lastName = faker.name.lastName(),
  street = faker.address.streetName(),
  houseNumber = faker.address.streetAddress(),
  zip = faker.address.zipCode(),
  city = faker.address.city(),
  phoneNumber = faker.phone.phoneNumber('0049176#######'),
  email = faker.internet.email(),
} = {}) {
  cy.getByCy('firstName').type(firstName);
  cy.getByCy('lastName').type(lastName);
  cy.getByCy('street').type(street);
  cy.getByCy('number').type(houseNumber);
  cy.getByCy('city').type(city);
  cy.getByCy('zip').type(zip);
  cy.getByCy('phone').type(phoneNumber);
  cy.getByCy('email').type(email);
  cy.getByCy('acceptAGB').check();
  cy.getByCy('contactSubmit').click();
  cy.get('.ant-form-item-has-error').should('not.exist');
  cy.get('.ant-notification-notice').should('exist');

  // Wait for form clean up
  cy.wait(1000);

  return {
    firstName,
    lastName,
    street,
    houseNumber,
    zip,
    city,
    phoneNumber,
    email,
  };
}
