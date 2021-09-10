export class InvalidNoteSignatureError extends Error {
  constructor(publicKey, signature, encryptedData, iv, mac) {
    super(
      `Invalid note signature (signature "${signature}", publicKey ${publicKey}, encryptedData "${encryptedData}", iv "${iv}", mac ${mac})`
    );
  }
}
