import { isSafari, isFirefox, isChrome } from 'react-device-detect';
import LucaLogo from 'assets/luca_logo_padding.svg';

const PER_CHUNK = 3;
export const MAX_QR_CODES_FILE = 48;

export const imageSettings = {
  src: LucaLogo,
  x: null,
  y: null,
  height: 32 * 5,
  width: 32 * 8,
  excavate: true,
};

export const isLessOrEqual = (a, b) => (a <= b ? a : b);

export const browserSupportsQrCodeDownload = () =>
  isSafari || isFirefox || isChrome;

export const arrayChunk = (array, size) =>
  array.reduce((accumulator, _, index) => {
    if (index % size === 0) accumulator.push(array.slice(index, index + size));
    return accumulator;
  }, []);

export const createBatches = (labels, key, getTitle) => {
  const items = [];

  const itemCount = labels.length;
  const lowerCount = Math.floor(itemCount / PER_CHUNK);

  for (let index = 0; index < lowerCount; index += 1) {
    items.push({ qrCodes: [], rowIndex: index });

    for (
      let innerIndex = 0;
      innerIndex < Math.min(itemCount, PER_CHUNK);
      innerIndex += 1
    ) {
      const value = labels[index * PER_CHUNK + innerIndex];

      items[index].qrCodes.push({ title: getTitle(value), key, value });
    }
  }

  if (!items.length) return items;

  for (let index = lowerCount * PER_CHUNK; index < itemCount; index += 1) {
    items[items.length - 1].qrCodes.push({
      key,
      value: labels[index],
      title: getTitle(labels[index]),
    });
  }
  return items;
};
