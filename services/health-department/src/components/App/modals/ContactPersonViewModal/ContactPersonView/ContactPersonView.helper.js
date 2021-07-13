/* eslint-disable max-lines, complexity */
import React from 'react';
import moment from 'moment';
import { notification } from 'antd';
import FileSaver from 'file-saver';
import { useIntl } from 'react-intl';
import sanitize from 'sanitize-filename';
import ReactExport from 'react-data-export';
import { sanitizeForCSV } from 'utils/sanitizer';
import {
  getFormattedDate,
  getFormattedTime,
  getFormattedDateTime,
} from 'utils/time';
import { createCSV } from 'utils/exports/csv';

import { DownloadButton } from './ContactPersonView.styled';

const {
  ExcelFile,
  ExcelFile: { ExcelSheet, ExcelColumn },
} = ReactExport;

const TABLE_KEY = 'table';
const MINUTE_SECONDS = 60;

function showErrorNotification(intl) {
  notification.error({
    message: intl.formatMessage({
      id: 'modal.contactPersonView.download.error',
    }),
  });
}

export const filterForTimeOverlap = (
  decryptedTraces,
  minTimeOverlap,
  indexPersonData
) => {
  const minTimeOverlapSeconds = minTimeOverlap * MINUTE_SECONDS;
  if (minTimeOverlap < 0) return decryptedTraces;
  if (!indexPersonData) return decryptedTraces;
  const indexCaseTrace = decryptedTraces.find(
    trace => trace.userData?.pn === indexPersonData.pn
  );
  if (!indexCaseTrace || !indexCaseTrace.checkout) return decryptedTraces;
  const filteredDecryptedTraces = [{ ...indexCaseTrace, isIndexCase: true }];
  decryptedTraces.forEach(compareTrace => {
    if (indexCaseTrace.traceId === compareTrace.traceId) return;
    if (!compareTrace.checkout) {
      filteredDecryptedTraces.push(compareTrace);
      return;
    }
    const overlapStart = Math.max(indexCaseTrace.checkin, compareTrace.checkin);
    const overlapEnd = Math.min(indexCaseTrace.checkout, compareTrace.checkout);

    const overlapTime = overlapEnd - overlapStart;
    if (overlapTime >= minTimeOverlapSeconds) {
      filteredDecryptedTraces.push(compareTrace);
    }
  });

  return filteredDecryptedTraces;
};

export const formatAdditionalDataKey = (key, intl) =>
  key === TABLE_KEY
    ? intl.formatMessage({
        id: 'contactPersonTable.additionalData.table',
      })
    : key;

const formatAdditionalData = (additionalData, intl) => {
  if (!additionalData) {
    return '';
  }
  return Object.keys(additionalData)
    .map(key => `${formatAdditionalDataKey(key, intl)}: ${additionalData[key]}`)
    .join(' / ');
};

const setUnregistredBadgeUser = intl =>
  intl.formatMessage({
    id: 'contactPersonTable.unregistredBadgeUser',
  });

const getExcelDownloadDataFromTraces = (traces, intl) =>
  traces
    // eslint-disable-next-line complexity
    .map(({ userData, additionalData, checkin, checkout }) => {
      try {
        return {
          firstName: userData ? sanitizeForCSV(userData.fn) : '',
          lastName: userData
            ? sanitizeForCSV(userData.ln)
            : setUnregistredBadgeUser(intl),
          phone: userData ? sanitizeForCSV(userData.pn) : '',
          email: userData ? sanitizeForCSV(userData.e) : '',
          street: userData ? sanitizeForCSV(userData.st) : '',
          houseNumber: userData ? sanitizeForCSV(userData.hn) : '',
          city: userData ? sanitizeForCSV(userData.c) : '',
          postalCode: userData ? sanitizeForCSV(userData.pc) : '',
          checkinDate: checkin ? getFormattedDate(checkin) : '',
          checkinTime: checkin ? getFormattedTime(checkin) : '',
          checkoutDate: checkout ? getFormattedDate(checkout) : '',
          checkoutTime: checkout ? getFormattedTime(checkout) : '',
          additionalData,
        };
      } catch {
        showErrorNotification(intl);
        return null;
      }
    })
    .filter(entry => entry !== null);

const columnKeys = [
  'firstName',
  'lastName',
  'phone',
  'email',
  'street',
  'houseNumber',
  'city',
  'postalCode',
  'checkinDate',
  'checkinTime',
  'checkoutDate',
  'checkoutTime',
];

const locationKeys = {
  streetName: 'location.street',
  streetNr: 'location.streetNumber',
  zipCode: 'location.postalCode',
  city: 'location.city',
  firstName: 'locationOwner.firstName',
  lastName: 'locationOwner.lastName',
  phone: 'locationOwner.phone',
};

export const ExcelDownload = ({ traces, location }) => {
  const intl = useIntl();

  return (
    <ExcelFile
      filename={sanitize(`${location.name}_luca`)}
      element={<DownloadButton type="button">Download Excel</DownloadButton>}
    >
      <ExcelSheet
        data={getExcelDownloadDataFromTraces(traces, intl)}
        name={sanitizeForCSV(`${location.groupName} - ${location.name}`)}
      >
        <ExcelColumn
          label={intl.formatMessage({ id: 'contactPersonTable.locationName' })}
          value={() => sanitizeForCSV(location.name)}
        />
        <ExcelColumn
          label={intl.formatMessage({ id: 'history.label.locationCategory' })}
          value={() =>
            intl.formatMessage({
              id: `history.location.category.${location.type}`,
            })
          }
        />
        <ExcelColumn
          label={intl.formatMessage({ id: 'history.label.areaDetails' })}
          value={() =>
            location.isIndoor
              ? intl.formatMessage({ id: 'history.label.indoor' })
              : intl.formatMessage({ id: 'history.label.outdoor' })
          }
        />
        {Object.entries(locationKeys).map(([key, value]) => (
          <ExcelColumn
            label={intl.formatMessage({
              id: `contactPersonTable.${value}`,
            })}
            value={() => sanitizeForCSV(location[key])}
            key={key}
          />
        ))}
        {columnKeys.map(name => (
          <ExcelColumn
            label={intl.formatMessage({ id: `contactPersonTable.${name}` })}
            value={col => sanitizeForCSV(col[name])}
            key={name}
          />
        ))}
        <ExcelColumn
          label={intl.formatMessage({
            id: 'contactPersonTable.additionalData',
          })}
          value={col => {
            if (!col.additionalData) return '';
            const data = Object.keys(col.additionalData).map(
              key =>
                `${sanitizeForCSV(
                  formatAdditionalDataKey(key, intl)
                )}: ${sanitizeForCSV(col.additionalData[key])}`
            );
            return data.join();
          }}
        />
      </ExcelSheet>
    </ExcelFile>
  );
};

const getCSVDownloadDataFromTraces = (traces, location, intl) => [
  [
    intl.formatMessage({ id: 'contactPersonTable.locationName' }),
    intl.formatMessage({ id: 'history.label.locationCategory' }),
    intl.formatMessage({ id: 'history.label.areaDetails' }),
    intl.formatMessage({ id: 'contactPersonTable.location.street' }),
    intl.formatMessage({ id: 'contactPersonTable.location.streetNumber' }),
    intl.formatMessage({ id: 'contactPersonTable.location.postalCode' }),
    intl.formatMessage({ id: 'contactPersonTable.location.city' }),
    intl.formatMessage({ id: 'contactPersonTable.locationOwner.firstName' }),
    intl.formatMessage({ id: 'contactPersonTable.locationOwner.lastName' }),
    intl.formatMessage({ id: 'contactPersonTable.locationOwner.phone' }),
    intl.formatMessage({ id: 'contactPersonTable.firstName' }),
    intl.formatMessage({ id: 'contactPersonTable.lastName' }),
    intl.formatMessage({ id: 'contactPersonTable.phone' }),
    intl.formatMessage({ id: 'contactPersonTable.email' }),
    intl.formatMessage({ id: 'contactPersonTable.street' }),
    intl.formatMessage({ id: 'contactPersonTable.houseNumber' }),
    intl.formatMessage({ id: 'contactPersonTable.city' }),
    intl.formatMessage({ id: 'contactPersonTable.postalCode' }),
    intl.formatMessage({ id: 'contactPersonTable.checkinDate' }),
    intl.formatMessage({ id: 'contactPersonTable.checkinTime' }),
    intl.formatMessage({ id: 'contactPersonTable.checkoutDate' }),
    intl.formatMessage({ id: 'contactPersonTable.checkoutTime' }),
    intl.formatMessage({ id: 'contactPersonTable.additionalData' }),
  ],
  ...traces
    // eslint-disable-next-line complexity
    .map(({ userData, additionalData, checkin, checkout }) => {
      try {
        return [
          location.name,
          location.type
            ? intl.formatMessage({
                id: `history.location.category.${location.type}`,
              })
            : '',
          location.isIndoor
            ? intl.formatMessage({ id: 'history.label.indoor' })
            : intl.formatMessage({ id: 'history.label.outdoor' }),
          location.streetName,
          location.streetNr,
          location.zipCode,
          location.city,
          location.firstName,
          location.lastName,
          location.phone,
          userData?.fn,
          userData?.ln ?? setUnregistredBadgeUser(intl),
          userData?.pn,
          userData?.e,
          userData?.st,
          userData?.hn,
          userData?.c,
          userData?.pc,
          checkin ? getFormattedDate(checkin) : '',
          checkin ? getFormattedTime(checkin) : '',
          checkout ? getFormattedDate(checkout) : '',
          checkout ? getFormattedTime(checkout) : '',
          formatAdditionalData(additionalData, intl),
        ];
      } catch {
        showErrorNotification(intl);
        return null;
      }
    })
    .filter(entry => entry !== null),
];

export const CSVDownload = ({ traces, location }) => {
  const intl = useIntl();

  const download = () => {
    try {
      const data = createCSV(
        getCSVDownloadDataFromTraces(traces, location, intl)
      );
      const filename = sanitize(`${location.name}_luca.csv`);
      const blob = new Blob([data], { type: 'text/csv;charset=utf-8' });
      FileSaver.saveAs(blob, filename);
    } catch (error) {
      console.error(error);
      showErrorNotification(intl);
    }
  };

  return (
    <DownloadButton type="button" onClick={download}>
      Download CSV
    </DownloadButton>
  );
};

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
        entry[37] = userData?.fn ?? setUnregistredBadgeUser(intl);
        entry[38] = userData?.ln ?? setUnregistredBadgeUser(intl);
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
      const filename = sanitize(
        `${location.groupName} - ${location.name}_sormas.csv`
      );
      const blob = new Blob([data], { type: 'text/csv;charset=utf-8' });
      FileSaver.saveAs(blob, filename);
    } catch {
      showErrorNotification(intl);
    }
  };
  return (
    <DownloadButton type="button" onClick={download}>
      {intl.formatMessage({ id: 'download.sormas' })}
    </DownloadButton>
  );
};
