import { expose } from 'comlink';
import { jsPDF } from 'jspdf';
import qrcode from 'yaqrcode';

import { bytesToBase64Url } from 'utils/encodings';
import { getCWAFragment } from 'utils/qrCodeData';
import { LUCA_SVG_BASE_64 } from 'constants/base64Logo';

const ROWS = 3;
const COLUMNS = 4;

const generateQRData = (
  location,
  path,
  isTableQRCodeEnabled,
  isCWAEventEnabled,
  keyName
) => {
  const qrData = [];
  const sharedContentPart = `${path}${location.scannerId}`;
  let additionalData = bytesToBase64Url(JSON.stringify({}));

  if (isTableQRCodeEnabled) {
    for (let tableId = 1; tableId < location.tableCount + 1; tableId++) {
      additionalData = bytesToBase64Url(JSON.stringify({ [keyName]: tableId }));
      qrData.push(
        `${sharedContentPart}#${additionalData}${getCWAFragment(
          location,
          isCWAEventEnabled
        )}`
      );
    }
  } else {
    qrData.push(
      `${sharedContentPart}#${additionalData}${getCWAFragment(
        location,
        isCWAEventEnabled
      )}`
    );
  }

  return qrData;
};

const drawQRCode = (pdf, x, y, base64QR, title, subtitle) => {
  pdf.text(title, 35 + x, 10 + y, 'center');
  pdf.rect(0 + x, 0 + y, 70, 74.25);
  pdf.addImage(base64QR, 'png', 15 + x, 15 + y, 40, 40);
  pdf.setFillColor('#FFFFFF');
  pdf.rect(29 + x, 31 + y, 12, 8, 'F');
  pdf.addImage(LUCA_SVG_BASE_64, 'png', 31 + x, 33 + y, 8, 4);
  pdf.text(subtitle, 35 + x, 62 + y, 'center');
};

const PDFCreator = {
  getPDF(
    location,
    isTableQRCodeEnabled,
    isCWAEventEnabled,
    path,
    title,
    subtitle,
    name,
    keyName,
    progressCallback
  ) {
    const pdf = new jsPDF();
    pdf.setFontSize(15);

    const qrCodeData = generateQRData(
      location,
      path,
      isTableQRCodeEnabled,
      isCWAEventEnabled,
      keyName
    );
    const pages = Math.ceil(qrCodeData.length / 12);

    if (isTableQRCodeEnabled) {
      let id = 0;
      for (let page = 0; page < pages; page++) {
        for (let column = 0; column < COLUMNS; column++) {
          for (let row = 0; row < ROWS; row++) {
            if (id >= qrCodeData.length) break;
            const base64QR = qrcode(qrCodeData[id], {
              size: 800,
            });
            id += 1;
            drawQRCode(
              pdf,
              row * 70,
              column * 74.25,
              base64QR,
              `${title} ${id}`,
              subtitle
            );
            const percentage = Math.round((id / qrCodeData.length) * 100);
            progressCallback(percentage);
          }
        }
        pdf.addPage();
      }
      pdf.deletePage(pages + 1);
    } else {
      const base64QR = qrcode(qrCodeData[0], {
        size: 800,
      });
      drawQRCode(pdf, 0, 0, base64QR, `${name}`, subtitle);
    }
    return pdf.output('blob');
  },
};

expose(PDFCreator);
