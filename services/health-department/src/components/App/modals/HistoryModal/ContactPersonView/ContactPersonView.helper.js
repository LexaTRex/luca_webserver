import React from 'react';
import moment from 'moment';
import { CSVLink } from 'react-csv';
import { useIntl } from 'react-intl';
import ReactExport from 'react-data-export';
import { filterTraceData } from 'utils/sanitizer';
import { getFormattedDate, getFormattedTime } from 'utils/time';

const {
  ExcelFile,
  ExcelFile: { ExcelSheet, ExcelColumn },
} = ReactExport;

const TABLE_KEY = 'table';
const MINUTE_SECONDS = 60;

export const filterForTimeOverlap = (
  decryptedTraces,
  minTimeOverlap,
  indexPersonData
) => {
  if (minTimeOverlap < 0) return decryptedTraces;
  const filteredDecryptedTraces = [];
  const indexPerson = decryptedTraces.find(
    trace => trace.userData.pn === indexPersonData.pn
  );
  if (!indexPerson) return decryptedTraces;
  decryptedTraces.forEach(compareTrace => {
    const firstCheckout =
      indexPerson.checkout < compareTrace.checkout
        ? indexPerson.checkout
        : compareTrace.checkout;
    const stayTime = firstCheckout - compareTrace.checkin;
    const timeOverlapSeconds = minTimeOverlap * MINUTE_SECONDS;
    if (
      indexPerson.traceId !== compareTrace.traceId &&
      indexPerson.checkin <= (compareTrace.checkout || indexPerson.checkout) &&
      indexPerson.checkout >= compareTrace.checkin &&
      stayTime >= timeOverlapSeconds
    ) {
      filteredDecryptedTraces.push(compareTrace);
    }
  });

  filteredDecryptedTraces.push(indexPerson);
  return filteredDecryptedTraces;
};

export const formatAdditionalDataKey = (key, intl) =>
  key === TABLE_KEY
    ? intl.formatMessage({
        id: 'contactPersonTable.additionalData.table',
      })
    : key;

const setUnregistredBadgeUser = intl =>
  intl.formatMessage({
    id: 'contactPersonTable.unregistredBadgeUser',
  });

const getExcelDownloadDataFromTraces = (traces, intl) =>
  traces
    .map(({ userData, isDynamicDevice, ...other }) => ({
      ...other,
      userData: filterTraceData(userData, isDynamicDevice),
    }))
    // eslint-disable-next-line complexity
    .map(({ userData, additionalData, checkin, checkout }) => ({
      firstname: userData ? userData.fn : '',
      lastname: userData ? userData.ln : setUnregistredBadgeUser(intl),
      phone: userData ? userData.pn : '',
      email: userData ? userData.e : '',
      street: userData ? userData.st : '',
      houseNumber: userData ? userData.hn : '',
      city: userData ? userData.c : '',
      postalCode: userData ? userData.pc : '',
      checkinDate: checkin ? getFormattedDate(checkin) : '',
      checkinTime: checkin ? getFormattedTime(checkin) : '',
      checkoutDate: checkout ? getFormattedDate(checkout) : '',
      checkoutTime: checkout ? getFormattedTime(checkout) : '',
      additionalData,
    }));

export const ExcelDownload = ({ traces, location }) => {
  const intl = useIntl();

  return (
    <ExcelFile
      filename={`${location.name}_luca`}
      element={
        <button
          type="button"
          style={{
            color: 'black',
            border: 'none',
            textDecoration: 'underline',
            backgroundColor: 'white',
            padding: 0,
          }}
        >
          Download Excel
        </button>
      }
    >
      <ExcelSheet
        data={getExcelDownloadDataFromTraces(traces, intl)}
        name={`${location.groupName} - ${location.name}`}
      >
        <ExcelColumn
          label={intl.formatMessage({ id: 'contactPersonTable.locationName' })}
          value={() => location.name}
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
        <ExcelColumn
          label={intl.formatMessage({
            id: 'contactPersonTable.location.street',
          })}
          value={() => location.streetName}
        />
        <ExcelColumn
          label={intl.formatMessage({
            id: 'contactPersonTable.location.streetNumber',
          })}
          value={() => location.streetNr}
        />
        <ExcelColumn
          label={intl.formatMessage({
            id: 'contactPersonTable.location.postalCode',
          })}
          value={() => location.zipCode}
        />
        <ExcelColumn
          label={intl.formatMessage({
            id: 'contactPersonTable.location.city',
          })}
          value={() => location.city}
        />
        <ExcelColumn
          label={intl.formatMessage({
            id: 'contactPersonTable.locationOwner.firstName',
          })}
          value={() => location.firstName}
        />
        <ExcelColumn
          label={intl.formatMessage({
            id: 'contactPersonTable.locationOwner.lastName',
          })}
          value={() => location.lastName}
        />
        <ExcelColumn
          label={intl.formatMessage({
            id: 'contactPersonTable.locationOwner.phone',
          })}
          value={() => location.phone}
        />
        <ExcelColumn
          label={intl.formatMessage({ id: 'contactPersonTable.firstName' })}
          value={col => col?.firstname}
        />
        <ExcelColumn
          label={intl.formatMessage({ id: 'contactPersonTable.lastName' })}
          value={col => col?.lastname}
        />
        <ExcelColumn
          label={intl.formatMessage({ id: 'contactPersonTable.phone' })}
          value={col => col?.phone}
        />
        <ExcelColumn
          label={intl.formatMessage({ id: 'contactPersonTable.email' })}
          value={col => col?.email}
        />
        <ExcelColumn
          label={intl.formatMessage({ id: 'contactPersonTable.street' })}
          value={col => col?.street}
        />

        <ExcelColumn
          label={intl.formatMessage({ id: 'contactPersonTable.houseNumber' })}
          value={col => col?.houseNumber}
        />

        <ExcelColumn
          label={intl.formatMessage({ id: 'contactPersonTable.city' })}
          value={col => col?.city}
        />

        <ExcelColumn
          label={intl.formatMessage({ id: 'contactPersonTable.postalCode' })}
          value={col => col?.postalCode}
        />

        <ExcelColumn
          label={intl.formatMessage({ id: 'contactPersonTable.checkinDate' })}
          value={col => col?.checkinDate}
        />
        <ExcelColumn
          label={intl.formatMessage({ id: 'contactPersonTable.checkinTime' })}
          value={col => col?.checkinTime}
        />
        <ExcelColumn
          label={intl.formatMessage({ id: 'contactPersonTable.checkoutDate' })}
          value={col => col?.checkoutDate}
        />
        <ExcelColumn
          label={intl.formatMessage({ id: 'contactPersonTable.checkoutTime' })}
          value={col => col?.checkoutTime}
        />
        <ExcelColumn
          label={intl.formatMessage({
            id: 'contactPersonTable.additionalData',
          })}
          value={col => {
            if (!col.additionalData) return '';
            const data = Object.keys(col.additionalData).map(
              key =>
                `${formatAdditionalDataKey(key, intl)}: ${
                  col.additionalData[key]
                }`
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
    .map(({ userData, isDynamicDevice, ...other }) => ({
      ...other,
      userData: filterTraceData(userData, isDynamicDevice),
    }))
    // eslint-disable-next-line complexity
    .map(({ userData, additionalData, checkin, checkout }) => [
      location.name ? location.name : '',
      location.type
        ? intl.formatMessage({
            id: `history.location.category.${location.type}`,
          })
        : '',
      location.isIndoor
        ? intl.formatMessage({ id: 'history.label.indoor' })
        : intl.formatMessage({ id: 'history.label.outdoor' }),
      location.streetName ? location.streetName : '',
      location.streetNr ? location.streetNr : '',
      location.zipCode ? location.zipCode : '',
      location.city ? location.city : '',
      location.firstName ? location.firstName : '',
      location.lastName ? location.lastName : '',
      location.phone ? location.phone : '',
      userData ? userData.fn : '',
      userData ? userData.ln : setUnregistredBadgeUser(intl),
      userData ? userData.pn : '',
      userData ? userData.e : '',
      userData ? userData.st : '',
      userData ? userData.hn : '',
      userData ? userData.c : '',
      userData ? userData.pc : '',
      checkin ? getFormattedDate(checkin) : '',
      checkin ? getFormattedTime(checkin) : '',
      checkout ? getFormattedDate(checkout) : '',
      checkout ? getFormattedTime(checkout) : '',
      additionalData
        ? Object.keys(additionalData).map(
            key =>
              `${formatAdditionalDataKey(key, intl)}: ${additionalData[key]}`
          )
        : null,
    ]),
];

export const CSVDownload = ({ traces, location }) => {
  const intl = useIntl();
  return (
    <CSVLink
      data={getCSVDownloadDataFromTraces(traces, location, intl)}
      filename={`${location.name}_luca.csv`}
    >
      Download CSV
    </CSVLink>
  );
};

const formatAdditionalData = (additionalData, intl) => {
  if (!additionalData) {
    return '';
  }
  return Object.keys(additionalData)
    .map(key => `${formatAdditionalDataKey(key, intl)}: ${additionalData[key]}`)
    .join(' / ');
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
    .map(({ userData, isDynamicDevice, ...other }) => ({
      ...other,
      userData: filterTraceData(userData, isDynamicDevice),
    }))
    .map(({ userData, checkin, additionalData }) => {
      const entry = new Array(134);
      entry[2] = 'CORONAVIRUS';
      entry[3] = 'COVID-19';
      entry[4] = moment().format('DD.MM.YYYY');
      entry[11] = moment.unix(checkin).format('DD.MM.YYYY');
      entry[12] = 'TRACING_APP';
      entry[14] = 'OTHER';
      entry[15] = 'luca';
      entry[19] = 'UNCONFIRMED';
      entry[20] = 'ACTIVE';
      entry[21] = 'FOLLOW_UP';
      entry[25] = `${location.name} / ${location.streetName} ${
        location.streetNr
      } / ${location.zipCode} ${location.state} / ${formatAdditionalData(
        additionalData,
        intl
      )}`;
      entry[37] = userData ? userData.fn : '';
      entry[38] = userData ? userData.ln : setUnregistredBadgeUser(intl);
      entry[43] = 'UNKNOWN';
      entry[68] = userData ? userData.pn : '';
      entry[74] = userData ? userData.c : '';
      entry[79] = userData ? userData.pc : '';
      entry[80] = userData ? userData.st : '';
      entry[81] = userData ? userData.hn : '';
      entry[83] = 'HOME';
      entry[88] = userData ? userData.e : '';
      return entry.map(field => field?.trim() || '');
    }),
];

export const SormasDownload = ({ traces, location }) => {
  const intl = useIntl();
  return (
    <CSVLink
      data={getSormasDownloadDataFromTraces(traces, location, intl)}
      separator=";"
      filename={`${location.groupName} - ${location.name}_sormas.csv`}
    >
      {intl.formatMessage({ id: 'download.sormas' })}
    </CSVLink>
  );
};
