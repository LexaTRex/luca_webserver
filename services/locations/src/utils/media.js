import { css } from 'styled-components';

import { MOBILE_BREAKPOINT, TABLET_BREAKPOINT } from 'constants/environment';

const createMedia = size => {
  return styles => css`
    @media (max-width: ${size}px) {
      ${styles}
    }
  `;
};

export const Media = {
  tablet: createMedia(TABLET_BREAKPOINT),
  mobile: createMedia(MOBILE_BREAKPOINT),
};
