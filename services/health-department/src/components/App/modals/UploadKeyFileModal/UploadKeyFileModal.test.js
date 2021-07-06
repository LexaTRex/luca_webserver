import React from 'react';
import { notification } from 'antd';

import { getPrivateKeySecret } from 'network/api';
import { render, waitToBeCalled } from 'utils/testing';

import { Simulate } from 'react-dom/test-utils';
import { GET_RANDOM_BYTES, hexToBase64 } from '@lucaapp/crypto';

import { UploadKeyFileModal } from './UploadKeyFileModal.react';

const fileName = 'healthDepartmentKeyFile.luca';
const fileType = 'text/plain;charset=utf-8';
const PRIVATE_KEY_SECRET =
  'b98b82948f121abc06dfa393780bbfd930a2c1e679f3485d2f888461b673389d';
const CORRECT_KEY_FILE = new File(
  [
    'eyJpdiI6Ii9DUlNSYW40d1pCWnl4YWNKL2RYQUdIc1MxUmV1dXZIcmNMZ3hHdjQ3QVE9IiwidGFnIjoiSWNjNTV4Vy9aYTBxTzU5MU5nMktIdz09IiwiZGF0YSI6ImJFOUtYdzZCRGdhNzBRd3BYZk5zSGkyS3locUI3MHBZbWVJR09QVnFmTlR0LzQ1VXYyamdtVHI5eE9GcDNJQ3dmWWpJZTBXUmVQTS9TazlsdVFhNzVxanhNSTl6bVg1TjNzQVhaMGlwRUZTY0p0TXRLMk5JUlo2UFRJLzhQazVRRlE4RUtsL1AvaEVMN01ONVNlSzNVM09mQWlaL01FcmZqb1hwRi9kVFNpT1FYR0dBd1ozRmdZY0h0UHpXQndVWWNjZExwMWVnVVE9PSIsInYiOjJ9',
  ],
  fileName,
  {
    type: fileType,
  }
);
const WRONG_PRIVATE_KEY_FILE = new File(
  [
    'eyJpdiI6IjdKeGJRUkpnT0hyQVQvQTJlOWo4MDA2S3RQSVc4b3NkbnZmYVZhSzg4UEE9IiwidGFnIjoiWkNMcjNjTUFyVVFCZERDU2YwU2ZoUT09IiwiZGF0YSI6Ino3SWlVQmwzc0xaclVQN3I4Rnh5YTFtd0xBR3BkR3Jzb0luN1pFR2lEQWdzSkJ4dXVuKy9LNFpyRmhXZHIxNktnVE9zQnBrdGQ4b2tuU29RTkhIOG9sWUlnaFAxOVVBRFppVVpmYVkxeWVFUVpHc3doc1BkV2RmTGpXazhDTmZNWTY1RG1iKzAyTGU2Ump2QWpuK3VWQ1IrYlUrY2lVVzBTcWlGMHk5M21pa1FpY2VhSGVhZU5FZ1R3TG1aL2Zpc3Baa2FhVXR1cGc9PSIsInYiOjJ9',
  ],
  fileName,
  {
    type: fileType,
  }
);
const TO_LARGE_PRIVATE_KEY_FILE = new File(
  [hexToBase64(GET_RANDOM_BYTES(4000))],
  fileName,
  {
    type: fileType,
  }
);

const keysData = {
  publicHDSKP:
    'BN32cwutIlhd3xAN5QCL0j2skHiJQAu5hJoynRHf6MCiRyl/VFaTjwcGzbPb41cItP7hd7kj2Zar/VWNQujexOo=',
  publicHDEKP:
    'BKJfZINfbhh9EmXgQlRKVYkkVSPbRWA16qusin7EAlZDypj4gQledX76vgYBZNwE/UO9ZHMd7pjsGUIECe1+KTM=',
};

jest.mock('network/api', () => ({
  getPrivateKeySecret: jest.fn(),
}));

jest.mock('antd', () => ({
  ...jest.requireActual('antd'),
  notification: {
    error: jest.fn(),
  },
}));

describe('components / App / modals / UploadKeyFileModal', () => {
  beforeEach(() => {
    getPrivateKeySecret.mockResolvedValue(PRIVATE_KEY_SECRET);
    notification.error.mockClear();
  });
  describe('when modal renders the first time', () => {
    it('calls getPrivateKeySecret', () => {
      render(<UploadKeyFileModal keysData={keysData} />);
      expect(getPrivateKeySecret).toBeCalledTimes(1);
    });
  });
  describe('when upload a wrong private key file', () => {
    it('show invalid file error notification', async () => {
      const { findByTestId } = render(
        <UploadKeyFileModal keysData={keysData} />
      );
      const fileInput = await findByTestId('fileUpload');
      Simulate.change(fileInput, {
        target: { files: [WRONG_PRIVATE_KEY_FILE] },
      });
      await waitToBeCalled(notification.error);
      expect(notification.error.mock.calls[0][0].message).toBe(
        'Ungültige Schlüsseldatei'
      );
    });
  });
  describe('when upload private file with a size of 4000 bytes', () => {
    it('called a to large file error notification', async () => {
      const { findByTestId } = render(
        <UploadKeyFileModal keysData={keysData} />
      );
      const fileInput = await findByTestId('fileUpload');
      Simulate.change(fileInput, {
        target: { files: [TO_LARGE_PRIVATE_KEY_FILE] },
      });
      await waitToBeCalled(notification.error);
      expect(notification.error.mock.calls[0][0].message).toBe(
        'Die hochgeladene Datei war zu groß.'
      );
    });
  });
  describe('when the correct file is uploaded', () => {
    it('called onFinish', done => {
      const onFinish = () => done();
      const { findByTestId } = render(
        <UploadKeyFileModal keysData={keysData} onFinish={onFinish} />
      );
      findByTestId('fileUpload')
        .then(fileInput => {
          Simulate.change(fileInput, { target: { files: [CORRECT_KEY_FILE] } });
        })
        .catch(done);
    });
  });
});
