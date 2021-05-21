const config = require('config');
const axios = require('axios');
const HttpsProxyAgent = require('https-proxy-agent');
const parsePhoneNumber = require('libphonenumber-js/max');
const xmlParseString = require('xml2js').parseString;

const httpsProxy = config.get('proxy.https');

const getInternationalPhoneNumberFormat = phone => {
  const phoneNumber = parsePhoneNumber(phone, 'DE');
  if (!phoneNumber) {
    throw new Error('invalid phone number');
  }
  return phoneNumber.formatInternational().replace('+', '00').replace(/ /g, '');
};

const isFixedLinePhoneNumber = phoneNumber => {
  const phone = parsePhoneNumber(phoneNumber, 'DE');
  return phone.getType() === 'FIXED_LINE';
};

const addSpaces = number => number.split('').join(' ');

const createClient = baseURL => {
  return axios.create({
    httpsAgent: httpsProxy ? new HttpsProxyAgent(httpsProxy) : undefined,
    baseURL,
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    proxy: false,
    keepAlive: true,
    timeout: 60000,
    maxSockets: 1,
  });
};

const clients = [
  createClient(config.get('sinch.gateway1')),
  createClient(config.get('sinch.gateway2')),
];

let requestCount = 0;

const sendSMSTan = async (phone, tan) => {
  const payload = new URLSearchParams();
  payload.append('version', '4.0');
  payload.append('cid', config.get('sinch.cid'));
  payload.append('password', config.get('sinch.password'));
  if (isFixedLinePhoneNumber(phone)) {
    payload.append(
      'content',
      `Hallo! Das ist deine TAN für die Verifizierung im luca System: ${addSpaces(
        tan
      )}`
    );
  } else {
    payload.append('content', `Deine Luca-TAN ist: ${tan}`);
  }
  payload.append('from', 'luca');
  payload.append('to', getInternationalPhoneNumberFormat(phone));

  requestCount = (requestCount + 1) % clients.length;
  const response = await clients[Number(requestCount)].post('/sms', payload);

  return new Promise((resolve, reject) => {
    xmlParseString(response.data, (error, result) => {
      if (error) reject(error);
      if (!result.smsreport.msgid) throw new Error(response.data);
      resolve(result.smsreport.msgid[0]);
    });
  });
};

module.exports = {
  sendSMSTan,
};
