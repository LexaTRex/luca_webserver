export class ExpiredDailyKeyError extends Error {
  descriptionId = 'QRCodeGenerator.error.expiredDailyKey';

  constructor() {
    super('The current daily key is expired');
  }
}

export class InvalidDailyKeySignatureError extends Error {
  descriptionId = 'QRCodeGenerator.error.invalidSignature';

  constructor() {
    super('Signature is not valid');
  }
}

export class MissingKeyError extends Error {
  descriptionId = 'QRCodeGenerator.error.missingKey';
}
