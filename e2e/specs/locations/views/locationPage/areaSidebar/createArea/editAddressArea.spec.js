import { loginLocations } from '../../../../utils/auth';
import {
  E2E_DEFAULT_LOCATION_GROUP,
  NEW_RESTAURANT_LOCATION,
  RESTAURANT_ADDRESS,
  RESTAURANT_TYPE,
} from '../../../../constants/locations';
import { E2E_PHONE_NUMBER } from '../../../../constants/users';
import {
  changeAddressManually,
  changeAddressViaGoogleApi,
  openAreaOverviewSettings,
  saveAddress,
  checkRadiusExists,
  createNewArea,
  deleteCreateArea,
} from './editAddressArea.helper';

describe('Update address for an area', () => {
  beforeEach(() => {
    loginLocations();
    createNewArea(
      E2E_DEFAULT_LOCATION_GROUP,
      RESTAURANT_TYPE,
      NEW_RESTAURANT_LOCATION,
      E2E_PHONE_NUMBER
    );
    cy.getByCy('openSettings').click();
  });
  after(() => {
    deleteCreateArea(NEW_RESTAURANT_LOCATION);
  });

  describe('Update address manually', { retries: 3 }, () => {
    it('can update the address manually', () => {
      openAreaOverviewSettings();
      changeAddressManually();

      saveAddress();
      checkRadiusExists();
    });
  });
  describe('Update address via Google API', { retries: 3 }, () => {
    it('can update the address using Google API', () => {
      openAreaOverviewSettings(true);
      changeAddressViaGoogleApi(RESTAURANT_ADDRESS);

      saveAddress();

      checkRadiusExists(true);
    });
  });
  describe(
    'Can update the address multiple times without affecting the radius checker',
    { retries: 3 },
    () => {
      it('update manually and afterwards via Google Api', () => {
        openAreaOverviewSettings();
        changeAddressManually();

        saveAddress();

        openAreaOverviewSettings(true);
        changeAddressViaGoogleApi(RESTAURANT_ADDRESS);
        saveAddress();

        checkRadiusExists(true);
      });
      it(
        'update via Google Api and afterwards manually',
        { retries: 3 },
        () => {
          openAreaOverviewSettings(true);
          changeAddressViaGoogleApi(RESTAURANT_ADDRESS);
          saveAddress();

          checkRadiusExists(true);

          cy.getByCy('openSettings').click();
          openAreaOverviewSettings();
          changeAddressManually();
          saveAddress();

          checkRadiusExists();
        }
      );
    }
  );
});
