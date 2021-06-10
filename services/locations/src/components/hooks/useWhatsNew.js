import React, { useEffect, useState } from 'react';
import { useIntl } from 'react-intl';

import { updateOperator } from 'network/api';
import { WhatsNewModal, Link } from 'components/App/modals/WhatsNewModal';
import AVV from 'assets/documents/AVV_Luca.pdf';

import { useModal } from './useModal';

const getOldestRelevantModalContent = (operatorState, intl) => {
  if (!operatorState) return null;
  const { avvAccepted } = operatorState;

  if (!avvAccepted)
    return {
      headline: intl.formatMessage({
        id: 'whatsNew.avv.title',
      }),
      content: intl.formatMessage(
        {
          id: 'whatsNew.avv.content',
        },
        {
          download: (
            <Link
              download={intl.formatMessage({ id: 'downloadFile.profile.avv' })}
              href={AVV}
            >
              {intl.formatMessage({ id: 'whatsNew.avv.download' })}
            </Link>
          ),
        }
      ),

      closable: false,
      onAcceptAction: () => {
        updateOperator({ avvAccepted: true });
      },
      newState: { ...operatorState, avvAccepted: true },
      isLastModal: true,
    };

  return null;
};

const showNextMessage = (
  intl,
  openModal,
  closeModal,
  operatorState,
  setOperatorState
) => {
  const modalSettings = getOldestRelevantModalContent(operatorState, intl);
  if (!modalSettings) return;

  const {
    headline,
    content,
    closable,
    onAcceptAction,
    isLastModal,
    newState,
  } = modalSettings;

  openModal({
    title: intl.formatMessage({
      id: 'whatsNew.title',
    }),
    content: (
      <WhatsNewModal
        onClose={() => {
          closeModal();
        }}
        headline={headline}
        content={content}
        onAccept={() => {
          onAcceptAction();
          if (isLastModal) {
            updateOperator({
              lastVersionSeen: process.env.REACT_APP_VERSION,
            });
            closeModal();
          }
          setOperatorState(newState);
        }}
      />
    ),
    emphasis: 'black-transparent lightHeader',
    closable,
  });
};

export const useWhatsNew = operator => {
  const intl = useIntl();
  const [openModal, closeModal] = useModal();
  const [operatorState, setOperatorState] = useState({
    avvAccepted: operator.avvAccepted,
    lastVersionSeen: operator.lastVersionSeen,
  });

  useEffect(() => {
    showNextMessage(
      intl,
      openModal,
      closeModal,
      operatorState,
      setOperatorState
    );
  }, [intl, openModal, closeModal, operatorState, setOperatorState]);

  return {
    avvAccepted: operatorState.avvAccepted,
    isActiveVersion:
      operatorState.lastVersionSeen === process.env.REACT_APP_VERSION,
  };
};
