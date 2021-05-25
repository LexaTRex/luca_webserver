import styled from 'styled-components';

export const StyledContainer = styled.div`
  margin-right: 16px;

  .ant-select {
    width: 150px;
  }
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
