export const deleteCreateArea = NEW_RESTAURANT_LOCATION => {
  cy.getByCy(`location-${NEW_RESTAURANT_LOCATION}`).click();
  cy.getByCy('openSettings').click();
  cy.getByCy('deleteLocation').should('exist');
  cy.getByCy('deleteLocation').click();
  cy.get('.ant-popover-buttons .ant-btn-primary').click();
  // Success notification
  cy.get('.successDeletedNotification').should('exist');
};

export const createNewArea = (
  E2E_DEFAULT_LOCATION_GROUP,
  RESTAURANT_TYPE,
  NEW_RESTAURANT_LOCATION,
  E2E_PHONE_NUMBER
) => {
  //create new area
  cy.get('#groupList').then($groupList => {
    if (
      $groupList.find(`div[data-cy=location-${NEW_RESTAURANT_LOCATION}]`)
        .length > 0
    ) {
      //delete area if exists
      deleteCreateArea(NEW_RESTAURANT_LOCATION);
    }
  });

  cy.getByCy(`createLocation-${E2E_DEFAULT_LOCATION_GROUP}`).click();
  cy.getByCy(RESTAURANT_TYPE).click();
  cy.get('#locationName').type(NEW_RESTAURANT_LOCATION);
  cy.getByCy('nextStep').click();
  // Keep address
  cy.getByCy('yes').click();
  cy.get('#phone').type(E2E_PHONE_NUMBER);
  cy.getByCy('nextStep').click();
  // Proceed by skipping average checkin time
  cy.getByCy('nextStep').click();
  // Select indoor
  cy.getByCy('indoorSelection').click();
  cy.getByCy('selectIndoor').click();
  cy.get('button[type=submit]').click();
  // No tables
  cy.getByCy('no').click();
  // Disable auto checkout
  cy.getByCy('no').click();
  // Create Area
  cy.getByCy('done').click();
  // No qr codes
  cy.getByCy('no').click();
  // Check if Area got created
  cy.getByCy(`location-${NEW_RESTAURANT_LOCATION}`);
};

export const openAreaOverviewSettings = enableGoogle => {
  cy.getByCy('editAddress').click();
  cy.get('.ant-modal-content').should('be.visible');
  cy.getByCy(enableGoogle ? 'yes' : 'no').click();
};

export const saveAddress = () => {
  cy.getByCy('saveAddress').click();
  cy.get('.ant-notification').should('be.visible');
};

export const changeAddressManually = () => {
  cy.get('#streetName').type('CharlottenStraße');
  cy.get('#streetNr').type('59');
  cy.get('#zipCode').type('11017');
  cy.get('#city').type('Berlin');
};

export const checkRadiusExists = shouldExist => {
  if (shouldExist) {
    cy.getByCy('toLocationOverview', { timeout: 4000 }).click();
    cy.getByCy('locationCard-checkoutRadius').should('exist').click();
    cy.getByCy('activateCheckoutRadius').click();
    cy.get('#radius').should('exist').should('have.value', 50);
  } else {
    cy.getByCy('toLocationOverview', { timeout: 4000 }).click();
    cy.getByCy('locationCard-checkoutRadius').should('not.exist');
  }
};

export const changeAddressViaGoogleApi = RESTAURANT_ADDRESS => {
  // Enter location
  cy.get('#locationSearch').type(RESTAURANT_ADDRESS);
  // Select from Google Api
  cy.get('.pac-container > div:first-of-type', { timeout: 6000 }).should(
    'be.visible'
  );
  cy.get('.pac-container > div:first-of-type', { timeout: 6000 }).click();
  // Expect fields to be filled out and disabled
  cy.get('#streetName').should('exist');
  cy.get('#streetNr').should('exist');
  cy.get('#zipCode').should('exist');
  cy.get('#city').should('exist');
  cy.get('#streetName').should('be.disabled');
  cy.get('#streetNr').should('be.disabled');
  cy.get('#zipCode').should('be.disabled');
  cy.get('#city').should('be.disabled');
};
