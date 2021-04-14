import { css } from 'styled-components';

// Constants
import { MOBILE_BREAKPOINT } from 'constants/environment';

const createMedia = size => {
  return styles => css`
    @media (max-width: ${size}px) {
      ${styles}
    }
  `;
};

export const Media = {
  mobile: createMedia(MOBILE_BREAKPOINT),
};
