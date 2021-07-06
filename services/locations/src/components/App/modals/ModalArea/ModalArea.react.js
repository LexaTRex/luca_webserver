import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { createGlobalStyle } from 'styled-components';
import { Modal } from 'antd';

// Hooks
import { useModal } from 'components/hooks/useModal';

// Constants
import { zIndex } from 'constants/layout';

const GlobalModalStyle = createGlobalStyle`
  .primary .ant-modal-content,
  .primary .ant-modal-header {
    background-color: #4e6180;
  }

  .black .ant-modal-content,
  .black .ant-modal-header {
    background-color: black;
  }

  .black-transparent .ant-modal-content {
    background-color: rgba(0, 0, 0, 0.85);
  }

  .black-transparent .ant-modal-header {
    background-color: transparent;
  }

  .black-transparent .ant-modal-content,
  .black-transparent .ant-modal-title,
  .black-transparent .ant-modal-close,
  .primary .ant-modal-content,
  .primary .ant-modal-title,
  .primary .ant-modal-close,
  .black .ant-modal-content,
  .black .ant-modal-title,
  .black .ant-modal-close {
    color: white;
  }

  .lightHeader .ant-modal-title {
    color: rgba(255, 255, 255, 0.87);
    font-size: 16px;
    font-weight: 500;
  }

  .noHeader .ant-modal-title {
    display: none;
  }

  .noHeader .ant-steps {
    display: none;
  }
`;

export const ModalArea = () => {
  const [, closeModal] = useModal();
  const [modalContent, setModalContent] = useState(null);
  const stateModal = useSelector(state => state.modal);

  const onCancel = () => {
    if (!modalContent?.closable) {
      return;
    }
    closeModal();
  };

  // Use a copy of the modal content in order to complete the closing animation of the modal with content
  useEffect(() => {
    if (stateModal) setModalContent(stateModal);
  }, [stateModal]);

  if (!modalContent) return null;

  return (
    <>
      <GlobalModalStyle />
      <Modal
        className={modalContent.emphasis}
        closable={modalContent?.closable}
        visible={!!stateModal}
        zIndex={zIndex.modalArea}
        title={modalContent?.title}
        onCancel={onCancel}
        centered
        width="auto"
        footer={null}
        afterClose={() => setModalContent(null)}
      >
        {modalContent?.content}
      </Modal>
    </>
  );
};
