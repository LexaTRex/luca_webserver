import { useMediaQuery } from 'react-responsive';
import {
  TABLET_BREAKPOINT,
  MOBILE_BREAKPOINT,
  MAX_MOBILE_BREAKPOINT,
} from 'constants/environment';

export function useTabletSize() {
  return useMediaQuery({ maxWidth: TABLET_BREAKPOINT });
}
export function useMobileSize() {
  const isMobileWidth = useMediaQuery({
    maxWidth: MOBILE_BREAKPOINT,
  });
  const isMobileHeight = useMediaQuery({
    maxHeight: MAX_MOBILE_BREAKPOINT,
  });

  return isMobileHeight || isMobileWidth;
}
