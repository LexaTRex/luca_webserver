import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Modal } from 'antd';
import styled from 'styled-components';

// Hooks
import { useModal } from 'components/hooks/useModal';

// Constants
import { zIndex } from 'constants/layout';

const ModalTitle = styled.h1`
  margin: 0;

  font-size: 32px;
  line-height: 36px;
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
    <Modal
      closable={modalContent?.closable}
      visible={!!stateModal}
      zIndex={zIndex.modalArea}
      title={<ModalTitle>{modalContent?.title}</ModalTitle>}
      onCancel={onCancel}
      centered
      width={modalContent?.wide ? 900 : 600}
      footer={null}
      afterClose={() => setModalContent(null)}
    >
      {modalContent?.content}
    </Modal>
  );
};
