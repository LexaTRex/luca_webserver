import { proxy } from 'comlink';
import { message } from 'antd';
import FileSaver from 'file-saver';
import sanitize from 'sanitize-filename';
import { LOADING_MESSAGE, openLoadingMessage } from 'components/notifications';
import { WEB_APP_BASE_PATH } from 'constants/links';

const TABLE_KEY = 'table';

export const downloadPDF = async ({
  setIsDownloading,
  pdfWorkerApiReference,
  location,
  intl,
  isTableQRCodeEnabled,
  isCWAEventEnabled,
}) => {
  const messageText = intl.formatMessage({ id: 'message.generatingPDF' });
  const locationName = `_${location.name}`;
  const fileName = `${location.groupName.replace(' ', '_')}${
    location.name ? locationName.replace(' ', '_') : ''
  }`;
  const showLoadingProgress = percentage =>
    openLoadingMessage(percentage, messageText);
  setIsDownloading(true);
  showLoadingProgress(0);
  const { getPDF } = pdfWorkerApiReference.current;
  const pdf = await getPDF(
    location,
    isTableQRCodeEnabled,
    isCWAEventEnabled,
    WEB_APP_BASE_PATH,
    intl.formatMessage({
      id: 'modal.qrCodeDocument.table',
    }),
    TABLE_KEY,
    proxy(showLoadingProgress)
  );
  showLoadingProgress(100);

  const fileNameLocale = isTableQRCodeEnabled
    ? 'downloadFile.locations.tableQrCodes'
    : 'downloadFile.locations.generalQrCode';

  const filename = sanitize(
    intl.formatMessage({ id: fileNameLocale }, { fileName })
  );

  FileSaver.saveAs(pdf, filename);
  setIsDownloading(false);
  message.destroy(LOADING_MESSAGE);
};
