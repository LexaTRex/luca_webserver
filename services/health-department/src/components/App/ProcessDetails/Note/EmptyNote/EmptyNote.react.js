import React from 'react';
import { useIntl } from 'react-intl';
import { EmptyNoteWrapper, PlusCircleNote, Title } from './EmptyNote.styled';

export const EmptyNote = ({ setEditMode }) => {
  const intl = useIntl();
  return (
    <EmptyNoteWrapper onClick={() => setEditMode(true)}>
      <PlusCircleNote />
      <Title>
        {intl.formatMessage({
          id: 'processDetails.note.addNote',
        })}
      </Title>
    </EmptyNoteWrapper>
  );
};
