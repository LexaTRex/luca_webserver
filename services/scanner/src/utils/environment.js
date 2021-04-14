import UAParser from 'ua-parser-js';

const parser = new UAParser();
export const isMobile = parser.getDevice().type === 'mobile';
