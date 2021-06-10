export class IncompleteDataError extends Error {
  constructor(data, iv) {
    super(
      `encryptedUserContactData is incomplete (data "${data}", iv "${iv}")`
    );
  }
}
