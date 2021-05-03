import styled from 'styled-components';

export const StyledContainer = styled.div`
  margin-right: 16px;
`;
export const StyledFilterTitle = styled.div`
  color: #000;
  font-size: 14px;
  font-weight: bold;
  line-height: 14px;
  margin-bottom: 8px;
  font-family: Montserrat-Bold, sans-serif;
`;
export const StyledOptionTitle = styled.div``;
export const StyledOptionContainer = styled.div`
  display: flex;
  align-items: center;
  flex-direction: row;

  .ant-checkbox-wrapper {
    padding-right: 8px;

    .ant-checkbox-inner {
      border-radius: 0 !important;
      border-color: #000 !important;

      &:after {
        border-color: #000;
      }
    }
  }
`;
