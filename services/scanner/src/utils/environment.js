import platform from 'platform';

export const isMobile =
  platform.os.family === 'Android' ||
  platform.os.family === 'iOS' ||
  platform.os.family === 'Windows Phone';
