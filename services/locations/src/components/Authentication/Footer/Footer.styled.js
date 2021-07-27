import styled from 'styled-components';
import { Media } from 'utils/media';

export const Link = styled.a`
  font-family: Montserrat-SemiBold, sans-serif;
  font-size: 14px;
  font-weight: 600;
  color: white;
  display: block;
  text-decoration: none;
  ${Media.mobile`
    margin-right: 12px;
  `}
`;

export const Version = styled.span`
  cursor: default;
  user-select: none;
  font-family: Montserrat-SemiBold, sans-serif;
  font-size: 14px;
  font-weight: 600;
  color: white;
  display: block;
  text-decoration: none;
  ${Media.mobile`
    margin-right: 12px;
  `}
`;

export const LegalWrapper = styled.div`
  position: absolute;
  left: 42px;
  bottom: 60px;
  ${Media.mobile`
    bottom: 12px;
    display: flex;
  `}
`;
