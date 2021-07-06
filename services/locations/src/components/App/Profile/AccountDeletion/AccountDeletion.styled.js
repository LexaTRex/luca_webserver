import styled from 'styled-components';

export const Heading = styled.div`
  color: ${properties =>
    properties.deletionInProgress ? '#e16f2d' : 'rgba(0, 0, 0, 0.87);'};
  font-size: 16px;
  font-weight: 500;
  margin-bottom: 16px;
`;

export const Text = styled.p``;

export const buttonStyles = {
  fontFamily: 'Montserrat-Bold, sans-serif',
  fontSize: 14,
  fontWeight: 'bold',
  padding: '0 40px',
  border: '1px solid rgb(80, 102, 124)',
};
