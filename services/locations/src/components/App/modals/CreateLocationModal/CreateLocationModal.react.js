import React, { useState } from 'react';
import { Modal } from 'antd';
import { createGlobalStyle } from 'styled-components';
import { useHistory } from 'react-router';

// Constants
import { zIndex } from 'constants/layout';
import { BASE_GROUP_ROUTE } from 'constants/routes';

import { CreateLocationModalContent } from './CreateLocationModalContent';

export const CreateLocationModal = ({ onClose, groupId }) => {
  const history = useHistory();
  const [locationId, setLocationId] = useState(null);

  const onCloseModal = () => {
    if (locationId) {
      history.push(`${BASE_GROUP_ROUTE}${groupId}/location/${locationId}`);
    }
    onClose();
  };

  const GlobalModalStyle = createGlobalStyle`
  .noHeader .ant-modal-title {
    display: none;
  }

  .noHeader .ant-steps {
    display: none;
  }
`;

  return (
    <>
      <GlobalModalStyle />
      <Modal
        className="noHeader"
        visible
        zIndex={zIndex.modalArea}
        onCancel={onCloseModal}
        centered
        width="auto"
        footer={null}
      >
        <CreateLocationModalContent
          groupId={groupId}
          onClose={onCloseModal}
          setLocationId={setLocationId}
        />
      </Modal>
    </>
  );
};
