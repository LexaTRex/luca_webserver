import UAParser from 'ua-parser-js';

const supportsWebRTC = (name, version, osName) => {
  // on iOS only safari supports webRTC
  if (osName === 'iOS' && name.toLowerCase() !== 'mobile safari') {
    return false;
  }
  // list of supported  Version from https://caniuse.com/stream
  const major = Number.parseInt(version, 10);
  switch (name.toLowerCase()) {
    case 'chrome':
    case 'chromium':
      return major >= 53;
    case 'firefox':
      return major >= 42;
    case 'opera':
      return major >= 40;
    case 'edge':
      return major >= 12;
    case 'safari':
    case 'mobile safari':
      return major >= 11;
    default:
      return false; // Not officially supported browser.
  }
};

export const hasMobileCamAccess = () => {
  const parser = new UAParser();
  const { name, version } = parser.getBrowser();
  const { name: osName } = parser.getOS();
  const isWebRTCsupported = supportsWebRTC(
    name,
    Number.parseInt(version, 10),
    osName
  );
  const isMobile = parser.getDevice().type === 'mobile';
  const isTablet = parser.getDevice().type === 'tablet';

  return !isTablet && !isMobile ? false : isWebRTCsupported;
};
