import React, { useState } from 'react';
import { NoteProcess } from './NoteProcess';
import { EmptyNote } from './EmptyNote';

export const Note = ({ process, keysData, processId }) => {
  const [editMode, setEditMode] = useState(false);

  return (
    <>
      {process.note || editMode ? (
        <NoteProcess
          process={process}
          keys={keysData}
          processId={processId}
          setEditMode={setEditMode}
          editMode={editMode}
        />
      ) : (
        <EmptyNote setEditMode={setEditMode} />
      )}
    </>
  );
};
