import { getSORMASRestURL } from 'utils/sormas';
import { getFormattedDate, getFormattedTime } from 'utils/time';
import { SUPPORTED_SORMAS_VERSION } from 'constants/sormas';

export function getSormasClient(host, username, password) {
  const SORMAS_REST_API = getSORMASRestURL(host);
  const headers = {
    'Content-Type': 'application/json',
    Authorization: `Basic ${btoa(`${username}:${password}`)}`,
  };

  const checkVersion = (version = SUPPORTED_SORMAS_VERSION) =>
    fetch(`${SORMAS_REST_API}/info/checkcompatibility?appVersion=${version}`, {
      method: 'GET',
      headers,
    })
      .then(response => response.text())
      .then(text => text === '"COMPATIBLE"');

  const getActiveUUIDs = () =>
    fetch(`${SORMAS_REST_API}/cases/uuids`, {
      method: 'GET',
      headers,
    }).then(response => response.json());

  const getCaseByUUID = uuid =>
    fetch(`${SORMAS_REST_API}/cases/query`, {
      headers,
      method: 'POST',
      body: JSON.stringify([uuid]),
    })
      .then(response => response.json())
      .then(results => results[0]);

  const personsPush = (traces, currentTime = Date.now()) =>
    fetch(`${SORMAS_REST_API}/persons/push`, {
      headers,
      method: 'POST',
      body: JSON.stringify(
        traces.map(trace => ({
          uuid: trace.uuid,
          firstName: trace.userData.fn,
          lastName: trace.userData.ln,
          emailAddress: trace.userData.e,
          phone: trace.userData.pn,
          address: {
            uuid: trace.uuid,
            city: trace.userData.c,
            changeDate: currentTime,
            creationDate: currentTime,
            street: trace.userData.st,
            postalCode: trace.userData.pc,
            houseNumber: trace.userData.hn,
            addressType: 'HOME',
          },
        }))
      ),
    });

  const contactsPush = (
    caseId,
    reportingUserId,
    locationName,
    traces,
    currentTime = Date.now()
  ) =>
    fetch(`${SORMAS_REST_API}/contacts/push`, {
      headers,
      method: 'POST',
      body: JSON.stringify(
        traces.map(trace => ({
          uuid: trace.uuid,
          caze: {
            uuid: caseId,
          },
          disease: 'CORONAVIRUS',
          reportDateTime: currentTime,
          reportingUser: {
            uuid: reportingUserId,
          },
          contactClassification: 'UNCONFIRMED',
          person: {
            uuid: trace.uuid,
          },
          healthConditions: {
            creationDate: currentTime,
            uuid: trace.uuid,
          },
          contactProximity: 'SAME_ROOM',
          contactProximityDetails: `Besuch bei ${locationName} am ${getFormattedDate(
            trace.checkin
          )}${getFormattedTime(trace.checkin)} ${
            trace.checkout &&
            `und ${getFormattedDate(trace.checkout)}${getFormattedTime(
              trace.checkout
            )}`
          }`,
          tracingApp: 'OTHER',
          tracingAppDetails: 'LUCA app',
          contactIdentificationSource: 'TRACING_APP',
          contactIdentificationSourceDetails: 'Übermittelt mit LUCA',
          contactCategory: 'LOW_RISK',
          followUpStatus: 'FOLLOW_UP',
          followUpComment: `Telefon Nummer aus luca ${trace.userData.pn}`,
          changeDate: currentTime,
          relationToCase: 'SAME_ENVIRONMENT',
          relationDescription: 'Gleiche Veranstaltung zur selben Zeit',
        }))
      ),
    });

  return {
    checkVersion,
    getActiveUUIDs,
    getCaseByUUID,
    personsPush,
    contactsPush,
  };
}
