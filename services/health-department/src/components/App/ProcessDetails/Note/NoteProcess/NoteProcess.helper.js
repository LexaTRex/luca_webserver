import {
  ENCRYPT_DLIES,
  hexToBase64,
  base64ToHex,
  bytesToHex,
  encodeUtf8,
  decodeUtf8,
  hexToBytes,
} from '@lucaapp/crypto';
import { updateProcess } from 'network/api';
import {
  decryptNote,
  generateSignature,
  verifyNoteSignature,
} from 'utils/cryptoKeyOperations';

function updateProcessHandler(keys, note) {
  if (!note || note.trim().length === 0) {
    return {
      note: null,
      noteIV: null,
      noteMAC: null,
      notePublicKey: null,
      noteSignature: null,
    };
  }

  const encodedNote = bytesToHex(encodeUtf8(note));
  const { publicKey, data: encryptedData, iv, mac } = ENCRYPT_DLIES(
    base64ToHex(keys.publicHDEKP),
    encodedNote
  );
  const signature = generateSignature(encryptedData + mac + iv);

  return {
    note: hexToBase64(encryptedData),
    noteIV: hexToBase64(iv),
    noteMAC: hexToBase64(mac),
    notePublicKey: hexToBase64(publicKey),
    noteSignature: hexToBase64(signature),
  };
}

export async function updateProcessRequest(processID, keys, note) {
  const noteHandler = updateProcessHandler(keys, note);

  await updateProcess(processID, noteHandler).then(response => {
    if (response.status >= 400 && response.status <= 500)
      throw new Error('Error');
  });
}

export function getDecryptedNote(process) {
  const { notePublicKey, noteIV, noteMAC, note, noteSignature } = process;

  if (!note) {
    return '';
  }

  verifyNoteSignature(
    base64ToHex(note),
    base64ToHex(noteIV),
    base64ToHex(noteMAC),
    base64ToHex(noteSignature)
  );

  return note
    ? hexToBytes(decodeUtf8(decryptNote(notePublicKey, noteIV, noteMAC, note)))
    : '';
}
