import React, { useState } from 'react';
import { Modal } from 'antd';
import { createGlobalStyle } from 'styled-components';
import { useHistory } from 'react-router';

// Constants
import { zIndex } from 'constants/layout';
import { BASE_GROUP_ROUTE, BASE_LOCATION_ROUTE } from 'constants/routes';

import { CreateGroupModalContent } from './CreateGroupModalContent';

export const CreateGroupModal = ({ onClose }) => {
  const history = useHistory();
  const [group, setGroup] = useState(null);

  const onCloseModal = () => {
    if (group) {
      history.push(
        `${BASE_GROUP_ROUTE}${group.groupId}${BASE_LOCATION_ROUTE}${group.location.locationId}`
      );
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
        <CreateGroupModalContent
          group={group}
          setGroup={setGroup}
          onClose={onCloseModal}
        />
      </Modal>
    </>
  );
};
