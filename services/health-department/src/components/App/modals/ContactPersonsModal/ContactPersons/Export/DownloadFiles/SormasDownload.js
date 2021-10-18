import React from 'react';
import moment from 'moment';
import FileSaver from 'file-saver';
import { useIntl } from 'react-intl';

import { logDownload } from 'network/api';
import { createCSV } from 'utils/exports/csv';
import { getFormattedDateTime } from 'utils/time';

import {
  showErrorNotification,
  formatAdditionalData,
  getSanitizedFilename,
} from './helpers';

import { DownloadButton } from '../Export.styled';

const getSormasDownloadDataFromTraces = (traces, location, intl) => [
  [
    'caseIdExternalSystem', // 0
    'caseOrEventInformation',
    'disease', // 2
    'diseaseDetails', // 3
    'reportDateTime', // 4
    'reportLat',
    'reportLon',
    'reportLatLonAccuracy',
    'region',
    'district',
    'community', // 10
    'lastContactDate', // 11
    'contactIdentificationSource', // 12
    'contactIdentificationSourceDetails',
    'tracingApp', // 14
    'tracingAppDetails', // 15
    'contactProximity',
    'contactProximityDetails',
    'contactCategory',
    'contactClassification', // 19
    'contactStatus', // 20
    'followUpStatus', // 21
    'followUpComment',
    'followUpUntil',
    'overwriteFollowUpUntil',
    'description', // 25
    'relationToCase',
    'relationDescription',
    'externalID',
    'highPriority',
    'immunosuppressiveTherapyBasicDisease', // 30
    'immunosuppressiveTherapyBasicDiseaseDetails',
    'careForPeopleOver60',
    'quarantine',
    'quarantineTypeDetails',
    'quarantineFrom',
    'quarantineTo',
    'person.firstName', // 37
    'person.lastName', // 38
    'person.nickname',
    'person.mothersName', // 40
    'person.mothersMaidenName',
    'person.fathersName',
    'person.sex', // 43
    'person.birthdateDD',
    'person.birthdateMM',
    'person.birthdateYYYY',
    'person.approximateAge',
    'person.approximateAgeType',
    'person.approximateAgeReferenceDate',
    'person.placeOfBirthRegion', // 50
    'person.placeOfBirthDistrict',
    'person.placeOfBirthCommunity',
    'person.placeOfBirthFacilityType',
    'person.placeOfBirthFacility',
    'person.placeOfBirthFacilityDetails',
    'person.gestationAgeAtBirth',
    'person.birthWeight',
    'person.presentCondition',
    'person.deathDate',
    'person.causeOfDeath', // 60
    'person.causeOfDeathDisease',
    'person.causeOfDeathDetails',
    'person.deathPlaceType',
    'person.deathPlaceDescription',
    'person.burialDate',
    'person.burialPlaceDescription',
    'person.burialConductor',
    'person.phone', // 68
    'person.phoneOwner',
    'person.address.region', // 70
    'person.address.district',
    'person.address.community',
    'person.address.details',
    'person.address.city', // 74
    'person.address.areaType',
    'person.address.latitude',
    'person.address.longitude',
    'person.address.latLonAccuracy',
    'person.address.postalCode', // 79
    'person.address.street', // 80
    'person.address.houseNumber', // 81
    'person.address.additionalInformation',
    'person.address.addressType', // 83
    'person.address.addressTypeDetails',
    'person.address.facilityType',
    'person.address.facility',
    'person.address.facilityDetails',
    'person.emailAddress', // 88
    'person.educationType',
    'person.educationDetails', // 90
    'person.occupationType',
    'person.occupationDetails',
    'person.generalPractitionerDetails',
    'person.passportNumber',
    'person.nationalHealthId',
    'person.symptomJournalStatus',
    'person.externalId',
    'quarantineHelpNeeded',
    'quarantineOrderedVerbally',
    'quarantineOrderedOfficialDocument', // 100
    'quarantineOrderedVerballyDate',
    'quarantineOrderedOfficialDocumentDate',
    'quarantineHomePossible',
    'quarantineHomePossibleComment',
    'quarantineHomeSupplyEnsured',
    'quarantineHomeSupplyEnsuredComment',
    'quarantineExtended',
    'quarantineReduced',
    'quarantineOfficialOrderSent',
    'quarantineOfficialOrderSentDate', // 110
    'additionalDetails',
    'epiData.exposureDetailsKnown',
    'epiData.contactWithSourceCaseKnown',
    'epiData.highTransmissionRiskArea',
    'epiData.largeOutbreaksArea',
    'epiData.areaInfectedAnimals',
    'healthConditions.diabetes',
    'healthConditions.chronicLiverDisease',
    'healthConditions.malignancyChemotherapy',
    'healthConditions.chronicPulmonaryDisease', // 120
    'healthConditions.chronicKidneyDisease',
    'healthConditions.chronicNeurologicCondition',
    'healthConditions.cardiovascularDiseaseIncludingHypertension',
    'healthConditions.immunodeficiencyIncludingHiv',
    'healthConditions.otherConditions',
    'sormasToSormasOriginInfo.organizationId',
    'sormasToSormasOriginInfo.senderName',
    'sormasToSormasOriginInfo.senderEmail',
    'sormasToSormasOriginInfo.senderPhoneNumber',
    'sormasToSormasOriginInfo.ownershipHandedOver', // 130
    'sormasToSormasOriginInfo.comment',
    'ownershipHandedOver',
    'returningTraveler',
  ],
  ...traces
    .map(({ userData, checkin, checkout, additionalData }) => {
      try {
        const entry = new Array(134);
        entry[2] = 'CORONAVIRUS';
        entry[3] = 'COVID-19';
        entry[4] = moment().format('DD.MM.YYYY');
        entry[11] = checkin ? moment.unix(checkin).format('DD.MM.YYYY') : '';
        entry[12] = 'TRACING_APP';
        entry[14] = 'OTHER';
        entry[15] = 'luca';
        entry[19] = 'UNCONFIRMED';
        entry[20] = 'ACTIVE';
        entry[21] = 'FOLLOW_UP';
        entry[25] = `${location.name} - ${location.streetName} ${
          location.streetNr
        } - ${location.zipCode} ${location.state} - ${getFormattedDateTime(
          checkin
        )} ${intl.formatMessage({
          id: 'sormas.to',
        })} ${
          checkout
            ? getFormattedDateTime(checkout)
            : intl.formatMessage({
                id: 'sormas.unknown',
              })
        } - ${formatAdditionalData(additionalData, intl)} `;
        entry[37] =
          userData?.fn ??
          intl.formatMessage({
            id: 'contactPersonTable.unregistredBadgeUser',
          });
        entry[38] =
          userData?.ln ??
          intl.formatMessage({
            id: 'contactPersonTable.unregistredBadgeUser',
          });
        entry[43] = 'UNKNOWN';
        entry[68] = userData?.pn;
        entry[74] = userData?.c;
        entry[79] = userData?.pc;
        entry[80] = userData?.st;
        entry[81] = userData?.hn;
        entry[83] = 'HOME';
        entry[88] = userData?.e;
        return entry;
      } catch {
        showErrorNotification(intl);
        return null;
      }
    })
    .filter(entry => entry !== null),
];

export const SormasDownload = ({ traces, location }) => {
  const intl = useIntl();

  const download = () => {
    try {
      const data = createCSV(
        getSormasDownloadDataFromTraces(traces, location, intl),
        true
      );
      const filename = getSanitizedFilename(location.name, 'sormas.csv');
      const blob = new Blob(
        [
          new Uint8Array([0xef, 0xbb, 0xbf]), // UTF-8 BOM
          data,
        ],
        { type: 'text/csv;charset=utf-8' }
      );
      FileSaver.saveAs(blob, filename);

      logDownload({
        type: 'sormas',
        transferId: location.transferId,
        amount: traces.length,
      });
    } catch {
      showErrorNotification(intl);
    }
  };
  return (
    <DownloadButton onClick={download}>
      {intl.formatMessage({ id: 'download.sormas' })}
    </DownloadButton>
  );
};
