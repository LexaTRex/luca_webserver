import styled, { keyframes } from 'styled-components';
import { Media } from 'utils/media';

const show = keyframes`
   0% {
     opacity: 0;
    }
    20% {
      opacity: 1;
    }
    33% {
      opacity: 1;
    }
    53% {
      opacity: 0;
    }
    100% {
      opacity: 0;
    }
`;

export const Left = styled.div`
  background-color: #262626;
  position: absolute;
  left: 0;
  top: 0;
  bottom: 0;
  z-index: -1;

  ${Media.mobile`
    width: 100%;
  `};
`;

const BaseImage = styled.img`
  position: absolute;

  top: 0;
  right: 0;
  bottom: 0;
  left: 50%;

  width: 50%;
  height: 100%;

  z-index: -1;

  object-fit: cover;
  animation-name: ${show};

  animation-iteration-count: infinite;
  animation-timing-function: ease-in-out;
  animation-duration: 18s;

  ${Media.mobile`
    width: 100%;
    height: 50%;

    left: 0;
    top: 50%;
  `}
`;

export const Right1 = styled(BaseImage)`
  animation-delay: 0;
`;

export const Right2 = styled(BaseImage)`
  animation-delay: -12s;
`;
export const Right3 = styled(BaseImage)`
  animation-delay: -6s;
`;

export const Logo = styled.img`
  height: 94px;
  margin-top: 40px;
  margin-left: 56px;

  ${Media.mobile`
    width: 78px;
    height: 59px;

    margin: 32px 0 0 32px;
  `}
`;

export const SubTitle = styled.div`
  color: white;
  display: flex;
  align-items: flex-end;
  margin-left: 24px;
  margin-bottom: -4px;

  ${Media.mobile`
    margin-left: 16px;
    margin-bottom: 8px;

    font-size: 10px;
  `}

  @media (max-width: 900px) and (orientation: landscape) {
    display: none;
  }
`;

export const HeaderWrapper = styled.div`
  display: flex;
`;
