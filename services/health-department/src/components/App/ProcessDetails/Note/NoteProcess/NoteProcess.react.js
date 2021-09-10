import React, { useMemo, useState } from 'react';
import { useIntl } from 'react-intl';
import { useQueryClient } from 'react-query';
import { Input, notification, Form } from 'antd';

import { MAX_PROCESS_NOTE_LENGTH } from 'constants/valueLength';
import { InvalidNoteSignatureError } from 'errors/InvalidNoteSignatureError';

import { updateProcessRequest, getDecryptedNote } from './NoteProcess.helper';

import { NoteButtonWrapper } from './NoteButtonWrapper';
import { NoteWrapper, Title, TextNote, NoteHeader } from './NoteProcess.styled';

export const NoteProcess = ({
  process,
  processId,
  keys,
  editMode,
  setEditMode,
}) => {
  const intl = useIntl();
  const queryClient = useQueryClient();
  const [form] = Form.useForm();
  const [isButtonDisabled, setIsButtonDisabled] = useState(true);
  const processNote = useMemo(() => {
    try {
      return getDecryptedNote(process);
    } catch (error) {
      console.error(error);

      if (error instanceof InvalidNoteSignatureError) {
        notification.error({
          message: intl.formatMessage({
            id: 'processDetails.note.invalidSignature',
          }),
        });
      }

      return '';
    }
  }, [intl, process]);

  const onEditModeChanged = changedEditMode => {
    if (!changedEditMode) {
      form.resetFields();
    }

    setEditMode(changedEditMode);
  };

  const addNoteToProcess = () => {
    const note = form.getFieldValue('note');
    if (note === processNote) {
      setEditMode(false);
      return;
    }

    updateProcessRequest(process.uuid, keys, note)
      .then(() => {
        setEditMode(false);
        queryClient.invalidateQueries(`process${processId}`);
        notification.success({
          message: intl.formatMessage({
            id: 'processDetails.note.success',
          }),
        });
      })
      .catch(() => {
        notification.error({
          message: intl.formatMessage({
            id: 'processDetails.note.error',
          }),
        });
      });
  };

  const onValueUpdate = (_, values) => {
    return values.note === processNote
      ? setIsButtonDisabled(true)
      : setIsButtonDisabled(false);
  };

  const handleNoteProcess = () =>
    !editMode ? setEditMode(true) : addNoteToProcess();

  return (
    <NoteWrapper>
      <NoteHeader>
        <Title>{intl.formatMessage({ id: 'processDetails.labelNote' })}</Title>
        <NoteButtonWrapper
          editMode={editMode}
          setEditMode={onEditModeChanged}
          handleNoteProcess={handleNoteProcess}
          isButtonDisabled={isButtonDisabled}
        />
      </NoteHeader>
      {editMode ? (
        <Form
          form={form}
          onFinish={addNoteToProcess}
          onValuesChange={onValueUpdate}
          initialValues={{ note: processNote }}
        >
          <Form.Item name="note">
            <Input.TextArea
              showCount
              value={processNote}
              maxLength={MAX_PROCESS_NOTE_LENGTH}
            />
          </Form.Item>
        </Form>
      ) : (
        <TextNote>
          {processNote ||
            intl.formatMessage({
              id: 'processDetails.labelNote.empty',
            })}
        </TextNote>
      )}
    </NoteWrapper>
  );
};
