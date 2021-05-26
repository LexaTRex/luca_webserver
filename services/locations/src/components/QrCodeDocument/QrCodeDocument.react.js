import React, {
  useRef,
  useMemo,
  useEffect,
  useCallback,
  useState,
  createContext,
} from 'react';
import { useIntl } from 'react-intl';
import { jsPDF } from 'jspdf';
import { message } from 'antd';
import sanitize from 'sanitize-filename';

import {
  MAX_QR_CODES_FILE,
  isLessOrEqual,
  browserSupportsQrCodeDownload,
  arrayChunk,
  createBatches,
} from 'constants/qrGeneration';

import { QrCodes } from './QrCodes';
import { Wrapper, messageStyle } from './QrCodeDocument.styled';

const Context = createContext({ name: 'messageContext' });

async function generateOneFile({
  intl,
  downloadTableQRCodes,
  group,
  processedLocation,
  printReference,
  fileNumber,
}) {
  return new Promise(resolve => {
    const qrPDF = new jsPDF('p', 'pt', 'a4', true);
    let locationName =
      group?.name ||
      processedLocation?.name ||
      intl.formatMessage({ id: 'location.defaultName' });

    locationName = sanitize(
      fileNumber ? `${locationName}_${fileNumber}` : locationName
    );

    qrPDF.html(printReference.current, {
      callback: pdf => {
        pdf.save(
          downloadTableQRCodes
            ? intl.formatMessage(
                { id: 'downloadFile.locations.tableQrCodes' },
                {
                  locationName,
                }
              )
            : intl.formatMessage(
                { id: 'downloadFile.locations.generalQrCode' },
                {
                  locationName,
                }
              )
        );
        resolve();
      },
      html2canvas: { scale: 0.8 },
    });
  });
}

export const QrCodeDocument = ({
  group,
  location,
  downloadTableQRCodes,
  isDownload,
  isCWAEventEnabled,
  setIsDownload,
}) => {
  const intl = useIntl();
  const [messageApi, contextHolder] = message.useMessage();
  const printReference = useRef(null);
  const [qrData, setQrData] = useState([]);
  const [downloadStatus, setDownloadStatus] = useState({});

  const processedLocation = group ? group.location : location;
  const { tableCount } = processedLocation;

  processedLocation.name = processedLocation.name ? processedLocation.name : '';

  const openMessage = useCallback(() => {
    messageApi.loading({
      content: (
        <Context.Consumer>
          {({ current, total }) =>
            intl.formatMessage(
              { id: 'qrDownload.progress' },
              { current, total }
            )
          }
        </Context.Consumer>
      ),
      style: messageStyle,
      duration: 0,
    });
  }, [intl, messageApi]);

  const qrDataChunked = useMemo(() => {
    const tables = [...new Array(tableCount).keys()].map(x => x + 1);
    const tablesChunked = arrayChunk(tables, MAX_QR_CODES_FILE);
    return tablesChunked.map(tableChunk => {
      return createBatches(
        tableChunk,
        'table',
        number =>
          `${intl.formatMessage({
            id: 'modal.qrCodeDocument.table',
          })} ${number}`
      );
    });
  }, [intl, tableCount]);

  const onDownLoad = useCallback(async () => {
    let fileNumber = 0;

    const downloadFunctionParameters = {
      intl,
      downloadTableQRCodes,
      group,
      processedLocation,
      printReference,
      fileNumber,
    };

    if (!downloadTableQRCodes) {
      setDownloadStatus({ current: 1, total: 1 });
      await generateOneFile(downloadFunctionParameters);
      setIsDownload(false);
      return;
    }

    fileNumber = 1;
    setDownloadStatus({ current: fileNumber, total: qrDataChunked.length });
    // eslint-disable-next-line no-restricted-syntax
    for (const qrDataChunk of qrDataChunked) {
      setQrData(qrDataChunk);
      const sleep = delay => new Promise(resolve => setTimeout(resolve, delay));
      // eslint-disable-next-line no-await-in-loop
      await sleep(1000);
      // eslint-disable-next-line no-await-in-loop
      await generateOneFile({
        ...downloadFunctionParameters,
        fileNumber,
      });
      fileNumber += 1;
      setDownloadStatus({
        current: isLessOrEqual(fileNumber, qrDataChunked.length),
        total: qrDataChunked.length,
      });
    }
    setIsDownload(false);
  }, [
    downloadTableQRCodes,
    intl,
    processedLocation,
    group,
    setIsDownload,
    qrDataChunked,
  ]);

  useEffect(() => {
    if (isDownload) {
      if (!browserSupportsQrCodeDownload()) {
        message.error({
          content: intl.formatMessage({ id: 'qrDownload.browserError' }),
          style: messageStyle,
          duration: 6,
        });
        setIsDownload(false);
        return;
      }
      openMessage();
    } else {
      message.destroy();
    }
  }, [isDownload, openMessage, intl, setIsDownload]);

  useEffect(() => {
    if (isDownload && browserSupportsQrCodeDownload()) {
      onDownLoad();
    }
  }, [isDownload, onDownLoad]);

  return (
    <Context.Provider value={downloadStatus}>
      {contextHolder}
      <Wrapper>
        <div ref={printReference}>
          <QrCodes
            qrData={qrData}
            group={group}
            location={processedLocation}
            downloadTableQRCodes={downloadTableQRCodes}
            isCWAEventEnabled={isCWAEventEnabled}
          />
        </div>
      </Wrapper>
    </Context.Provider>
  );
};
