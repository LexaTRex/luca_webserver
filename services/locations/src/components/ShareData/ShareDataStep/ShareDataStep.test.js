import React from 'react';

import { render, screen, fireEvent } from 'utils/testing';
import { shareData } from 'network/api';
import { notification } from 'antd';

import { ShareDataStep } from './ShareDataStep.react';

jest.mock('network/api', () => ({
  shareData: jest.fn(() => ({ status: 204 })),
}));

const error = jest.spyOn(notification, 'error');

const next = jest.fn();

const mockTransfers = [
  {
    additionalData: 'testTransfer1',
    traceId: '1231',
    department: { name: 'testDepartment1' },
    location: { name: 'testLocation1' },
    time: [10],
    traces: [],
  },
];

describe('components / ShareData / ShareDataStep', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });
  describe('when shareData returns a valid status code', () => {
    it('shows the error message to contact support', async () => {
      render(
        <ShareDataStep
          privateKey={null}
          next={next}
          transfers={mockTransfers}
          showStepLabel={null}
        />
      );
      await fireEvent.click(screen.getByRole('button'));
      expect(shareData).toBeCalledTimes(1);
      expect(next).toBeCalledTimes(1);
    });
  });
  describe('when shareData returns a failed status code', () => {
    it('shows the error message to contact support', async () => {
      shareData.mockImplementation(() => ({ status: 400 }));
      render(
        <ShareDataStep
          privateKey={null}
          next={next}
          transfers={mockTransfers}
          showStepLabel={null}
        />
      );
      await fireEvent.click(screen.getByRole('button'));
      expect(shareData).toBeCalledTimes(1);
      expect(error).toBeCalledTimes(1);
    });
  });
});
