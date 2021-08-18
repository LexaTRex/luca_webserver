import styled from 'styled-components';
import { Upload } from 'antd';

export const InfoBlock = styled.p`
  font-size: 14px;
  font-weight: 500;
  margin-bottom: 21px;
`;

export const RequestContent = styled.div`
  margin-bottom: 40px;
`;

export const UploadMessage = styled.p`
  font-size: 14px;
  font-weight: 500;
  margin-bottom: 16px !important;
  text-align: center;
`;

export const UploadProgress = styled.div`
  display: flex;
  width: 200px;
`;

export const FileUpload = styled(Upload)`
  display: flex;
  width: 100%;
  flex-direction: column;
  justify-content: space-evenly;
  align-items: center;
  text-align: center;
  height: 172px;
  border: 2px solid rgb(151, 151, 151);
  border-radius: 0;
`;
