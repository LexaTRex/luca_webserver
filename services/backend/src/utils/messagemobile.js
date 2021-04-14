const config = require('config');
const axios = require('axios');
const HttpsProxyAgent = require('https-proxy-agent');

const httpsProxy = config.get('proxy.https');

const messagemobile = axios.create({
  httpsAgent: httpsProxy ? new HttpsProxyAgent(httpsProxy) : undefined,
  baseURL: config.get('messagemobile.gateway'),
  headers: {
    Authorization: `Bearer ${config.get('messagemobile.accessKey')}`,
    'Content-Type': 'application/json',
  },
  proxy: false,
  keepAlive: true,
  timeout: 30000,
  maxSockets: 1,
});

const sendSMSTan = async (phone, tan) => {
  const response = await messagemobile.post('/messages', {
    content: {
      '@type': 'Text',
      text: {
        data: `Deine Luca-TAN ist: ${tan}`,
      },
    },
    consumer: [
      {
        id: `${phone}`,
      },
    ],
  });

  return response.data.id;
};

module.exports = {
  sendSMSTan,
};
