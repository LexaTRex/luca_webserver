import React from 'react';
import { useIntl } from 'react-intl';
import { ButtonWrapper, LinkButton } from './NoteButtonWrapper.styled';

export const NoteButtonWrapper = ({
  editMode,
  setEditMode,
  handleNoteProcess,
  isButtonDisabled,
}) => {
  const intl = useIntl();
  return (
    <ButtonWrapper>
      {editMode && (
        <LinkButton onClick={() => setEditMode(false)} hasMarginRight>
          {intl.formatMessage({
            id: 'processDetails.cancelProcessNote',
          })}
        </LinkButton>
      )}
      <LinkButton
        onClick={handleNoteProcess}
        disabled={editMode ? isButtonDisabled : false}
      >
        {intl.formatMessage({
          id: editMode
            ? 'processDetails.saveProcessNote'
            : 'processDetails.updateProcessNote',
        })}
      </LinkButton>
    </ButtonWrapper>
  );
};
