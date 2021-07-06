const config = require('config');
const axios = require('axios');
const HttpsProxyAgent = require('https-proxy-agent');

const httpsProxy = config.get('proxy.https');

const gtx = axios.create({
  httpsAgent: httpsProxy ? new HttpsProxyAgent(httpsProxy) : undefined,
  baseURL: `${config.get('gtx.gateway')}/${config.get('gtx.authKey')}`,
  headers: {
    'Content-Type': 'application/json',
  },
  proxy: false,
  keepAlive: true,
  timeout: 30000,
  maxSockets: 1,
});

const sendSMSTan = async (phone, tan) => {
  const response = await gtx.post('/json', {
    from: 'luca',
    to: phone,
    text: `Deine Luca-TAN ist: ${tan}`,
  });

  return response.data['message-id'];
};

module.exports = {
  sendSMSTan,
};
