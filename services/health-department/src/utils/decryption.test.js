import sjson from 'secure-json-parse';

const { decryptUser, additionalDataSchema } = require('./decryption');

it('decrypts user data as expected', () => {
  const testUserData = {
    data:
      'cKaohjdLONeW/qT95TgLNNiD6hYiRTMUHFQV4T9N6ghi+qce+JF8zS4wjekFKGXsjjw7ADea1bVOZux2VS9abXdOECYKItEECSFoUDqvVk7zvH6YLN00HXPthMRcf5DvbKHiuQu991QK5C8=',
    iv: 'mo6XrA2cj0lc7g9xXobOWg==',
    mac: 'JqqcWhWdCPoK0l3NzuQV57y0IOrE+zWv/RP9O4M+CsU=',
    publicKey:
      'BOL49WFd1PCRZmKlSNssBbwD8nGid3Bu7cFLn9KTEsvG4K/TfdcEhZ9Cx3QHd/DZ8GtiLK/qophU96h6hhQ97dU=',
    signature:
      'MEQCIBMlwdZJc/HzUUskZrPyRwRt8WDOsEjvzWh4P9fwx1qOAiAq8N7xtDduFfdWIZc1U8MRlF6yTtJeaY6iSP918mGpHw==',
    userId: 'abd7c225-94e3-4cb7-962d-19443dceea14',
  };
  const testUserEncryptionKey = 'bc8a55c95afc69e9a91798db947e813b';

  const testUserDecrypted = {
    c: 'Test',
    e: '',
    fn: 'Chris',
    hn: '1',
    ln: 'Android',
    pc: '10000',
    pn: '017772034437',
    st: 'Test',
    v: '3',
  };
  expect(decryptUser(testUserData, testUserEncryptionKey)).toEqual({
    isInvalid: false,
    userData: testUserDecrypted,
  });
});

it('additional data schema works as expected', () => {
  const decrAdd1 = '{"table":1, "My Questions?": "Quo enim laborum Oc"}';
  const decrAddO1 = {
    'My Questions ': 'Quo enim laborum Oc',
    table: '1',
  };
  const decrAdd2 = '{"My Questions?": "Quo enim laborum Oc"}';
  const decrAddO2 = {
    'My Questions ': 'Quo enim laborum Oc',
  };

  expect(additionalDataSchema.parse(sjson.parse(decrAdd1))).toEqual(decrAddO1);
  expect(additionalDataSchema.parse(sjson.parse(decrAdd2))).toEqual(decrAddO2);
});
