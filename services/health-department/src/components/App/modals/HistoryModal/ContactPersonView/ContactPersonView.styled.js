import styled from 'styled-components';

export const CloseButtonStyles = {
  position: 'absolute',
  top: 12,
  right: 12,
  fontSize: 16,
  cursor: 'pointer',
  color: 'black',
};

export const FilterSettingsContainer = styled.div`
  height: 50px;
`;

export const ContactViewWrapper = styled.div`
  position: absolute;

  left: -100px;
  top: -180px;
  right: -100px;

  background-color: white;

  outline: 20px solid #4e6180;

  z-index: 10;
`;

export const HeaderArea = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;

  padding: 24px 24px 24px;
`;

export const DateDisplay = styled.p`
  color: black;
`;

export const TableWrapper = styled.div`
  display: flex;
  background-color: white;
  color: black;
  flex-direction: column;
  max-height: 390px;
  overflow: auto;
`;

export const TableHeader = styled.div`
  display: flex;
  border-bottom: 1px solid rgb(151, 151, 151);
  padding: 24px 24px;
  font-weight: bold;
`;

export const Row = styled.div`
  display: flex;
  border-bottom: 1px solid rgb(151, 151, 151);
  padding: 12px 24px;
`;

export const Column = styled.div`
  display: flex;
  flex: ${({ flex }) => flex};
  justify-content: ${({ align }) => align || ''};
  flex-direction: column;
`;

export const CheckboxWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-end;
`;

export const DataName = styled.div`
  font-weight: bold;
`;

export const AdditionalDataWrapper = styled.h4`
  width: inherit;
  overflow: scroll;
`;
