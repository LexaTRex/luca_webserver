const moment = require('moment');

module.exports = {
  debug: true,
  loglevel: 'info',
  hostname: 'localhost',
  skipSmsVerification: true,
  port: 8080,
  cookies: {
    // DEV ONLY TOKEN
    secret: 'NJrbMwHlI2uILDVkN0w6Aw==',
    maxAge: moment.duration(15, 'minutes').as('ms'),
  },
  db: {
    host: 'database',
    host_read1: 'database',
    host_read2: 'database',
    host_read3: 'database',
    username: 'luca',
    password: 'lcadmin',
    database: 'luca-backend',
  },
  redis: {
    hostname: 'redis',
    password:
      // DEV ONLY TOKEN
      'ConqsCqWd]eaR82wv%C.iDdRybor8Ms2bM*h=m?V3@x2w^UxKA9pEjMjHn^y7?78',
  },
  mailjet: {
    secretKey: '',
    apiKey: '',
    token: '',
  },
  messagemobile: {
    accessKey: '',
    gateway: '',
  },
  sinch: {
    cid: '',
    password: '',
    gateway1: '',
    gateway2: '',
  },
  luca: {
    traces: {
      maximumRequestablePeriod: moment.duration(24, 'hours').as('hours'),
      maxAge: moment.duration(28, 'days').as('hours'),
      maxDuration: moment.duration(24, 'hours').as('hours'),
    },
    smsChallenges: {
      maxAge: moment.duration(45, 'days').as('hours'),
    },
    userTransfers: {
      maxAge: moment.duration(1, 'hours').as('hours'),
    },
    locationTransferTraces: {
      maxAge: moment.duration(28, 'days').as('hours'),
    },
    locations: {
      maxAge: moment.duration(28, 'days').as('hours'),
    },
    operators: {
      deleted: {
        maxAgeHours: moment.duration(28, 'days').as('hours'),
      },
    },
    users: {
      maxAge: moment.duration(28, 'days').as('hours'),
    },
    testRedeems: {
      defaultMaxAge: moment.duration(72, 'hours').as('hours'),
      maxAge: moment.duration(1, 'years').as('hours'),
    },
  },
  emails: {
    expiry: moment.duration(24, 'hours').as('hours'),
  },
  proxy: {
    http: null,
    https: null,
  },
  keys: {
    daily: {
      max: 28,
      minKeyAge: moment.duration(24, 'hours').as('hours'),
    },
    badge: {
      targetKeyId: 1,
      // DEV ONLY
      private: 'qzbym5WwwkbSQ9BJvIdGZIjdh9p72HwQseZXbDs+AbU=',
      attestation: {
        // DEV ONLY
        v3:
          'BDxaTgQ9VLl1I3VMdfT+dtLz+/EaEgAoYmn22/PFABpgFPvEh5dst2Ns20YufsofVyDE/Z+eBBBVYOOjEG40dA8=',
        v4:
          'BDxaTgQ9VLl1I3VMdfT+dtLz+/EaEgAoYmn22/PFABpgFPvEh5dst2Ns20YufsofVyDE/Z+eBBBVYOOjEG40dA8=',
      },
    },
  },
  certs: {
    dtrust: {
      root: `-----BEGIN CERTIFICATE-----
MIIETjCCAzagAwIBAgIDD+UpMA0GCSqGSIb3DQEBCwUAMFMxCzAJBgNVBAYTAkRF
MRUwEwYDVQQKDAxELVRydXN0IEdtYkgxLTArBgNVBAMMJEQtVFJVU1QgTGltaXRl
ZCBCYXNpYyBSb290IENBIDEgMjAxOTAeFw0xOTA2MTkwODE1NTFaFw0zNDA2MTkw
ODE1NTFaMFMxCzAJBgNVBAYTAkRFMRUwEwYDVQQKDAxELVRydXN0IEdtYkgxLTAr
BgNVBAMMJEQtVFJVU1QgTGltaXRlZCBCYXNpYyBSb290IENBIDEgMjAxOTCCASIw
DQYJKoZIhvcNAQEBBQADggEPADCCAQoCggEBAN81X083S74JbInkPxAL5tQg5SOF
ttjX/rviq7s4HG4zBvUF4KgwqXysC+mA5nRwEkFXnI6ZQTB8M0DI6vSBnpAOghZN
QgXFu07WsQWOTTlywst138t1t6YU8QPUVb1UbxiVu4WtycFaq98Rbfcsu6YIoENB
gjeXZRJPzxPhIf1oLtSkgBihX/7eVxZdVRGzAtuMZP9TqI3bQpZ1yY/7Od54ra4Q
SPy2La4VOqUSAyS2yRreugLL8aqSt7dh+YsDSgtHEn2HgrunptIFN45kVM4PEOHx
/gi5lpZ+pKRmLuoXMmvBUwa/HlySSV7bVv6xfHFZjjs3YjXvZh+8StvEY9cCAwEA
AaOCASkwggElMA8GA1UdEwEB/wQFMAMBAf8wHQYDVR0OBBYEFONo4hcITMmOHGJE
DKkpkQJiC6OTMA4GA1UdDwEB/wQEAwIBBjCB4gYDVR0fBIHaMIHXMIGJoIGGoIGD
hoGAbGRhcDovL2RpcmVjdG9yeS5kLXRydXN0Lm5ldC9DTj1ELVRSVVNUJTIwTGlt
aXRlZCUyMEJhc2ljJTIwUm9vdCUyMENBJTIwMSUyMDIwMTksTz1ELVRydXN0JTIw
R21iSCxDPURFP2NlcnRpZmljYXRlcmV2b2NhdGlvbmxpc3QwSaBHoEWGQ2h0dHA6
Ly9jcmwuZC10cnVzdC5uZXQvY3JsL2QtdHJ1c3RfbGltaXRlZF9iYXNpY19yb290
X2NhXzFfMjAxOS5jcmwwDQYJKoZIhvcNAQELBQADggEBALzcGA/9SQuKkkdFSUT+
8mU4RTV7PWB3DpmqNt9kcB00oYqohwCyRXJygjcN/lNHi4828us0H7DtGdl2CQp4
WbTcWtdBbjwaU0XH/FXdtxgo9BzM/VVfFUZUai8CtlDn6fJjLhVmPWQtX1EByEe/
ulEwyxHipVD5pI1dY+ctdqXtWZ+HsudvZC5a/CFS/hElq2yTlS2SuKeTovGGM8GB
Y+XI16N3w/ItEjnQJJNPxPRfNjQdvhicaujXEOErHP8UGWgCJ+aDGboSq2dVbczE
m4DnKPXpWydVWZLI9d6a1RUWwmB9GD1/JKvxPThbwkHnWixlLkSKKr7uMaiWGaCX
oVQ=
-----END CERTIFICATE-----`,
      basic: `-----BEGIN CERTIFICATE-----
MIIFuTCCBKGgAwIBAgIDD+VKMA0GCSqGSIb3DQEBCwUAMFMxCzAJBgNVBAYTAkRF
MRUwEwYDVQQKDAxELVRydXN0IEdtYkgxLTArBgNVBAMMJEQtVFJVU1QgTGltaXRl
ZCBCYXNpYyBSb290IENBIDEgMjAxOTAeFw0xOTA4MjAxMjMyMjJaFw0zNDA2MTkw
ODE1NTFaMFAxCzAJBgNVBAYTAkRFMRUwEwYDVQQKDAxELVRydXN0IEdtYkgxKjAo
BgNVBAMMIUQtVFJVU1QgTGltaXRlZCBCYXNpYyBDQSAxLTIgMjAxOTCCASIwDQYJ
KoZIhvcNAQEBBQADggEPADCCAQoCggEBANxlUGXW81Y2JG/BtEO5dlbELYat4Zx9
5b4RUux5scPTZX3wrEW+PK4EwQCvV8FH0SoDatOJcFiGduX2r29c0aFFyVKu6xHF
DApYNYV99+z5TiqXFdVkOUti56r10KsaO3FkcgAt4wDFgYd0dDseYo2SQqpKeqFR
QMVQVdLCt66yU8qbiaZ/sL2pcNsJMD/DkEV/axpTwzzk6H+kGUIJ+jpKpYw2pMFF
wYlqW91ICfLtTHvJqFb3DZ7yFNSiXgYBYH9R142vjflh1vg+GuqORiTLi/AhIjlb
3XUAFIZzJ77+PLQprYlRHGGBMaJ+3VbI+hWPTHpwVt6wHNVcfHUnA3kCAwEAAaOC
ApcwggKTMB8GA1UdIwQYMBaAFONo4hcITMmOHGJEDKkpkQJiC6OTMIIBMgYIKwYB
BQUHAQEEggEkMIIBIDBABggrBgEFBQcwAYY0aHR0cDovL2xpbWl0ZWQtYmFzaWMt
cm9vdC1jYS0xLTIwMTkub2NzcC5kLXRydXN0Lm5ldDBTBggrBgEFBQcwAoZHaHR0
cDovL3d3dy5kLXRydXN0Lm5ldC9jZ2ktYmluL0QtVFJVU1RfTGltaXRlZF9CYXNp
Y19Sb290X0NBXzFfMjAxOS5jcnQwgYYGCCsGAQUFBzAChnpsZGFwOi8vZGlyZWN0
b3J5LmQtdHJ1c3QubmV0L0NOPUQtVFJVU1QlMjBMaW1pdGVkJTIwQmFzaWMlMjBS
b290JTIwQ0ElMjAxJTIwMjAxOSxPPUQtVHJ1c3QlMjBHbWJILEM9REU/Y0FDZXJ0
aWZpY2F0ZT9iYXNlPzAYBgNVHSAEETAPMA0GCysGAQQBpTQCg3QBMIHcBgNVHR8E
gdQwgdEwgc6ggcuggciGgYBsZGFwOi8vZGlyZWN0b3J5LmQtdHJ1c3QubmV0L0NO
PUQtVFJVU1QlMjBMaW1pdGVkJTIwQmFzaWMlMjBSb290JTIwQ0ElMjAxJTIwMjAx
OSxPPUQtVHJ1c3QlMjBHbWJILEM9REU/Y2VydGlmaWNhdGVyZXZvY2F0aW9ubGlz
dIZDaHR0cDovL2NybC5kLXRydXN0Lm5ldC9jcmwvZC10cnVzdF9saW1pdGVkX2Jh
c2ljX3Jvb3RfY2FfMV8yMDE5LmNybDAdBgNVHQ4EFgQU0A0+3Aiv40EIZuDc8vqZ
ai3fGLkwDgYDVR0PAQH/BAQDAgEGMBIGA1UdEwEB/wQIMAYBAf8CAQAwDQYJKoZI
hvcNAQELBQADggEBAH8NXqPrIcKiZC51vfxvajB1HhFnRFFN/G3ZU4yR7XI+uGec
DjR8tOHdFYFmZG4qbDl70ZuRG4bs6H8cvfWyo1NmWZqjAkr6o1kIRTnFwn4JsssJ
7HR2RmJ4ar0C9miIk9sTNLwKy1/kBvCFqssdKdQwBSi85KRxPFYvv+vnMCvSL0Ob
+65q6V7QzvCk7ojiSrcfvHS8QnHJE9ReFRKD4KXAd7+OcZc1K3Mf+uNNHt3CP3ie
DN9K90sI81IWucEeN2NYvw/tJNDH5L4Ah3cn8XzxQVzOfAnn1isf2pci1IEj5f3Y
9JA7LYLLeH7n4+E5JWRiIUAhqNhQTchmwKLdR+E=
-----END CERTIFICATE-----`,
    },
  },
};
