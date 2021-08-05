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

const drawCuttedText = (text, length, pdf, x, y) => {
  const parts = pdf.splitTextToSize(text, length);
  const isTextFitting = parts.length === 1;
  pdf.text(`${parts[0]}${isTextFitting ? '' : '...'}`, x, y, {
    align: 'center',
  });
};

const drawQRCode = ({
  pdf,
  x,
  y,
  base64QR,
  areaName = '',
  table = '',
  locationName,
}) => {
  const maxTextLength = 40;
  if (areaName) {
    pdf.setFontSize(9);
    pdf.setFont(undefined, 'bold');
    const yOffset = table ? 10 : 15;
    drawCuttedText(areaName, maxTextLength, pdf, 35 + x, yOffset + y);
  }
  if (table) {
    pdf.setFontSize(8);
    pdf.setFont(undefined, 'normal');
    drawCuttedText(table, maxTextLength, pdf, 35 + x, 15 + y);
  }
  pdf.rect(0 + x, 0 + y, 70, 74.25);
  pdf.addImage(base64QR, 'png', 15 + x, 17 + y, 40, 40);
  pdf.setFillColor('#FFFFFF');
  pdf.rect(29 + x, 33 + y, 12, 8, 'F');
  pdf.addImage(LUCA_SVG_BASE_64, 'png', 31 + x, 35 + y, 8, 4);
  pdf.setFontSize(9);
  pdf.setFont(undefined, 'bold');
  drawCuttedText(locationName, maxTextLength, pdf, 35 + x, 62 + y);
};

const PDFCreator = {
  getPDF(
    location,
    isTableQRCodeEnabled,
    isCWAEventEnabled,
    path,
    table,
    keyName,
    progressCallback
  ) {
    const pdf = new jsPDF();

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
            drawQRCode({
              pdf,
              x: row * 70,
              y: column * 74.25,
              base64QR,
              areaName: location.name,
              table: `${table} ${id}`,
              locationName: location.groupName,
            });
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
      drawQRCode({
        pdf,
        x: 0,
        y: 0,
        base64QR,
        areaName: location.name,
        locationName: location.groupName,
      });
    }
    return pdf.output('blob');
  },
};

expose(PDFCreator);
