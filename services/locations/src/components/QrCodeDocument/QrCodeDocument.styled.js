import styled from 'styled-components';

export const Wrapper = styled.div`
  height: 0;
  width: 750px;
  visibility: hidden;
`;

export const Row = styled.div`
  display: flex;
  flex-wrap: wrap;
  width: 100%;
`;

export const Item = styled.div`
  align-content: center;
  align-items: center;
  text-align: center;
  flex-wrap: wrap;
  flex: 0 32%;
  display: flex;
  flex-direction: column;
  padding: 16px 0px;
  border: 1px dashed black;

  & > canvas {
    width: 132px !important;
    height: 132px !important;
  }
`;

export const Text = styled.p`
  margin: 0;

  text-align: left;

  font-size: 20px;
  font-family: Montserrat-Bold, sans-serif;
  font-weight: bold;
`;

export const messageStyle = {
  fontFamily: 'Montserrat-Bold, sans-serif',
  fontSize: 14,
};
