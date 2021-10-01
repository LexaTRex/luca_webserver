export enum ChallengeType {
  OperatorDeviceCreation = 'OperatorDeviceCreation',
}

export enum OperatorDeviceCreationChallengeState {
  Ready = 'READY',
  Canceled = 'CANCELED',
  AuthenticationPINRequired = 'AUTHENTICATION_PIN_REQUIRED',
  PrivateKeyRequired = 'PRIVATE_KEY_REQUIRED',
  PrivateKeyPINRequired = 'PRIVATE_KEY_PIN_REQUIRED',
  Done = 'DONE',
}
