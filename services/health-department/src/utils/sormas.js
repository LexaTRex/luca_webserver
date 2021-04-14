export function getSORMASRestURL(host) {
  return `https://${host}/sormas-rest`;
}

export function getSORMASCaseUIURL(host, sormasCaseId) {
  return `https://${host}/sormas-ui/#!cases/contacts/${sormasCaseId}`;
}
