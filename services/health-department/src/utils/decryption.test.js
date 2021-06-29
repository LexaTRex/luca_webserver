/* eslint sonarjs/no-duplicate-string: 0 */
import { bytesToHex } from '@lucaapp/crypto';
import { getEncryptedUserContactData } from 'network/api';

import {
  decryptAdditionalData,
  decryptDynamicDeviceTrace,
  decryptStaticDeviceTrace,
} from './decryption';
import {
  getDailyPrivateKey,
  getBadgePrivateKey,
  DECRYPT_DLIES_USING_HDEKP,
} from './cryptoKeyOperations';

jest.mock('./cryptoKeyOperations', () => ({
  getDailyPrivateKey: jest.fn(),
  getBadgePrivateKey: jest.fn(),
  DECRYPT_DLIES_USING_HDEKP: jest.fn(),
}));
jest.mock('network/api', () => ({
  getEncryptedUserContactData: jest.fn(),
}));

describe('utils / decryption', () => {
  describe('decryptStaticDeviceTrace', () => {
    const encryptedTrace = {
      additionalData: null,
      checkin: 1623936900,
      checkout: null,
      data: 'ZDpEsaTrXri6UasvtYozlEb+u0gpWGztaur4STHRMPQ=',
      deviceType: 2,
      keyId: 0,
      publicKey: 'AsAtPKGiaGu/8YzWafSN5QrAKCiqJEaTuJTlna+wVNYk',
      traceId: 'k2AwzQ7ta6Ih0PVWNuB7mw==',
      verification: '1nsMb+5k+es=',
      version: 4,
    };

    const encryptedUser = {
      data:
        'FtfOELK4OT794MA2Afxe767bumQwNUkGzCDuAEo8HO+0aHW/8YLz4Q0zcswJ+Py+58DeN/0atwIuPgkMyUOKbyRw679qQ/fKTsZK+E65ZgTyQ5J1F3P5SOngfvDYQS+aRgKZsW5uo/+fa+poFJr4I0DUYxhiE1uN+Y9qw77wmgnUG+EnGgACISwD',
      iv: 'lg+I1Ds59kTiHQYW7lhXFA==',
      mac: '3nphz2jmR7IAJvbpq7zc4DCWPnPoHT0VP3DRPG6z2dM=',
      publicKey: 'Ah40ITR2Ik+CCtbcaYW+7sog2SNZxuRQfdyTAk4/vXVR',
      signature:
        'MEYCIQCErQ88DqXFgMnul16WuKGoWu1pev9y+qoHAS/EFWVapQIhAMZnvUj6XqWmdi1j9Vog2LM9fBfvIdIq5huVQpSnXS0B',
      userId: '22d5f567-bec1-4b99-b62d-5c14aecf4f2d',
    };

    const expectedUserData = {
      v: '2',
      e: '',
      fn: 'Bernd',
      ln: 'Badger',
      pn: '015750000000',
      st: 'B-Straße',
      hn: '2',
      pc: '22222',
      c: 'Berlin',
      vs: 'm4KDwE cAXti 38aJQoMTQ ',
    };

    beforeEach(() => {
      getEncryptedUserContactData.mockClear();
      getBadgePrivateKey.mockResolvedValue(
        '2ef49459d67001f16836ec906dc664a49ceaafbba0721408d7abb393b0c31a40'
      );
    });

    describe('when dynamic device will be decrypted', () => {
      describe('with valid mac and verification', () => {
        it('decrypt user data successfully', async () => {
          getEncryptedUserContactData.mockResolvedValue(encryptedUser);
          const {
            userData,
            isInvalid,
            isDynamicDevice,
          } = await decryptStaticDeviceTrace(encryptedTrace);
          expect(getEncryptedUserContactData).toHaveBeenCalledTimes(1);

          expect(isInvalid).toBe(false);
          expect(userData).toEqual(expectedUserData);
          expect(isDynamicDevice).toBe(false);
        });
      });

      describe('with invalid verification', () => {
        it('return invalid user data', async () => {
          getEncryptedUserContactData.mockResolvedValue(encryptedUser);

          const encryptedTraceWithModifiedVerification = {
            ...encryptedTrace,
            verification: 'nooo',
          };

          const {
            userData,
            isInvalid,
            isDynamicDevice,
          } = await decryptStaticDeviceTrace(
            encryptedTraceWithModifiedVerification
          );
          expect(getEncryptedUserContactData).toHaveBeenCalledTimes(1);

          expect(isInvalid).toBe(true);
          expect(userData).toEqual(null);
          expect(isDynamicDevice).toBe(false);
        });
      });
      describe('with invalid mac', () => {
        it('return invalid user data', async () => {
          getEncryptedUserContactData.mockResolvedValue({
            ...encryptedUser,
            mac: "not the MAC you're looking for",
          });

          const {
            userData,
            isInvalid,
            isDynamicDevice,
          } = await decryptStaticDeviceTrace(encryptedTrace);
          expect(getEncryptedUserContactData).toHaveBeenCalledTimes(1);

          expect(isInvalid).toBe(true);
          expect(userData).toEqual(null);
          expect(isDynamicDevice).toBe(false);
        });
      });
    });
  });
  describe('decryptDynamicDeviceTrace', () => {
    const dailyPrivateKey =
      '4935ced7f8d2af1fecfec801a2525eb4ee0af77dacdee5fcc9177d1507569c2c';
    const encryptedUser = {
      data:
        'IqyA0cg1i/DS08suKa+2UtE5NFJEMn7k2GpMpSixEfiQT4rcsE75KD9qW9Gk5oiQ1zGtKBRa5i2OqCXVuT23DKGBTwzlPm2kMC7NaK6ZeU5eNy920G0lBIAvlFVh+3x+khM0buxwfJ/MMmzS6L6YodO2pxVh9SY=',
      iv: 'b3XwfwCUSUb2BGZctjbilQ==',
      mac: '+WGAT9Wxkta0MI+NtQRUD9K95V/YJ7cMAEds1REIDjM=',
      publicKey:
        'BAun8HLPiq1Of0l0C/NuJ10BvOziBnmjnQnrju7GsLLYqhK6jsGb3jPuj5ckjJTm0Fzdg5WzJOnEeYjKMUWiRno=',
      signature:
        'MEUCIG026uzWKpFDKlnIZaOR8nmRciZV+e49Flb0F29e0HHVAiEAtPSpeLIfmknVem1a2KqWkszeYVXgLw7zI9MOeXJt5hU=',
      userId: '4a4462a6-6684-4e24-9d38-415c74dd2f44',
    };
    const encryptedTrace = {
      additionalData: null,
      checkin: 1623928920,
      checkout: 1623929020,
      data: 'W9FvqFfUv2g0JZCLnrvtaCJugoLqWyu7vv+xc4voWC8=',
      deviceType: 3,
      keyId: 0,
      publicKey: 'AoX40jkRCHnBpP3YNHcu2q8EMnmeUAiaV/X9a4tk1rBY',
      traceId: '75T3YAkKDougPx6mfwxDzQ==',
      verification: 'mlwAh3rrtC4=',
      version: 3,
    };

    const expectedUserData = {
      c: 'Berlin',
      e: '',
      fn: 'Tamara',
      hn: '59',
      ln: 'Tester',
      pc: '10117',
      pn: '0049 170 1234567',
      st: 'Charlottenstraße',
      v: '3',
    };

    beforeEach(() => {
      getEncryptedUserContactData.mockClear();
      getDailyPrivateKey.mockResolvedValue(dailyPrivateKey);
    });

    describe('when dynamic device will be decrypted', () => {
      describe('with valid mac and verification', () => {
        it('decrypt user data successfully', async () => {
          getEncryptedUserContactData.mockResolvedValue(encryptedUser);
          const {
            userData,
            isInvalid,
            isDynamicDevice,
          } = await decryptDynamicDeviceTrace(encryptedTrace);
          expect(getEncryptedUserContactData).toHaveBeenCalledTimes(1);

          expect(isInvalid).toBe(false);
          expect(userData).toEqual(expectedUserData);
          expect(isDynamicDevice).toBe(true);
        });
      });
      describe('with invalid verification', () => {
        it('return invalid user data', async () => {
          getEncryptedUserContactData.mockResolvedValue(encryptedUser);

          const encryptedTraceWithModifiedVerification = {
            ...encryptedTrace,
            verification: 'nooo',
          };

          const {
            userData,
            isInvalid,
            isDynamicDevice,
          } = await decryptDynamicDeviceTrace(
            encryptedTraceWithModifiedVerification
          );
          expect(getEncryptedUserContactData).toHaveBeenCalledTimes(1);

          expect(isInvalid).toBe(true);
          expect(userData).toEqual(null);
          expect(isDynamicDevice).toBe(true);
        });
      });
      describe('with invalid mac', () => {
        it('return invalid user data', async () => {
          getEncryptedUserContactData.mockResolvedValue({
            ...encryptedUser,
            mac: "not the MAC you're looking for",
          });

          const {
            userData,
            isInvalid,
            isDynamicDevice,
          } = await decryptDynamicDeviceTrace(encryptedTrace);
          expect(getEncryptedUserContactData).toHaveBeenCalledTimes(1);

          expect(isInvalid).toBe(true);
          expect(userData).toEqual(null);
          expect(isDynamicDevice).toBe(true);
        });
      });
    });
  });

  describe('decryptAdditionalData', () => {
    const encryptedTrace = {
      additionalData: {
        publicKey:
          '04e2286d5a7269344e2fd66c11a87b9fcd99eafbcad620dfc94c88baadb8321709b5cabccf04b5f0d8a8f14a16d273961beef0238cb5fdf86da41588069e465d90',
        data: '4a0364d7bec1c53d6e486e',
        iv: 'aea0254733f294e402966f0955a93cdf',
        mac: '1b3111da5b6d214e9ed1458568b2ffce4c311fe968e02902bcf118af8047485a',
      },
    };
    const tableData = { table: 1 };

    beforeEach(() => {
      DECRYPT_DLIES_USING_HDEKP.mockClear();
    });

    describe('when additional data will be decrypted', () => {
      describe('with a valid trace', () => {
        it('return additional data', () => {
          DECRYPT_DLIES_USING_HDEKP.mockReturnValue(
            bytesToHex(JSON.stringify(tableData))
          );
          expect(decryptAdditionalData(encryptedTrace, false)).toEqual({
            table: '1',
          });
          expect(DECRYPT_DLIES_USING_HDEKP).toBeCalledTimes(1);
        });
      });
      describe('with a invalid trace', () => {
        it('return null', () => {
          DECRYPT_DLIES_USING_HDEKP.mockReturnValue(
            bytesToHex(JSON.stringify(tableData))
          );
          expect(decryptAdditionalData(encryptedTrace, true)).toEqual(null);
          expect(DECRYPT_DLIES_USING_HDEKP).toBeCalledTimes(0);
        });
      });
      describe('with a valid trace but with not expected additional data', () => {
        it('return null', () => {
          DECRYPT_DLIES_USING_HDEKP.mockReturnValue(
            bytesToHex(JSON.stringify({ table: true }))
          );
          expect(decryptAdditionalData(encryptedTrace, false)).toEqual(null);
          expect(DECRYPT_DLIES_USING_HDEKP).toBeCalledTimes(1);
        });
      });
    });
  });
});
