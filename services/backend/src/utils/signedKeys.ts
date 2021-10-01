import forge from 'node-forge';
import jwt from 'jsonwebtoken';
import assert from 'assert';
import config from 'config';
import { publicKeyToECPublicKeyPEM, base64ToHex } from '@lucaapp/crypto';
import { z } from './validation';

let ROOT_CA_STORE: forge.pki.CAStore;
let D_TRUST_BASIC_CA: forge.pki.Certificate;

export const loadCertificates = () => {
  const D_TRUST_ROOT_CA = forge.pki.certificateFromPem(
    config.get('certs.dtrust.root')
  );

  D_TRUST_BASIC_CA = forge.pki.certificateFromPem(
    config.get('certs.dtrust.basic')
  );

  ROOT_CA_STORE = forge.pki.createCaStore([D_TRUST_ROOT_CA]);
};

const signedKeySchema = z
  .object({
    sub: z.uuid(),
    iss: z.string().length(40),
    name: z.string().max(255),
    key: z.ecPublicKey(),
    type: z.enum(['publicHDEKP', 'publicHDSKP']),
    iat: z.unixTimestamp(),
  })
  .strict();

const getFingerprint = (certificate: forge.pki.Certificate) => {
  const certDer = forge.asn1.toDer(forge.pki.certificateToAsn1(certificate));
  const md = forge.md.sha1.create();
  md.update(certDer.data);
  return md.digest().toHex();
};

export const verifyCertificateAgainstDTrustChain = (
  certificate: forge.pki.Certificate
) => {
  return forge.pki.verifyCertificateChain(ROOT_CA_STORE, [
    certificate,
    D_TRUST_BASIC_CA,
  ]);
};

const verifySignedJwt = ({
  token,
  publicKeyPem,
  issuer,
  subject,
  name,
  type,
  key,
}: {
  token: string;
  publicKeyPem: string;
  issuer: string;
  subject: string;
  name: string;
  type: string;
  key: string;
}) => {
  const content = jwt.verify(token, publicKeyPem, {
    algorithms: ['RS512'],
    subject,
    issuer,
    maxAge: '10 minutes',
  });

  const validatedContent = signedKeySchema.parse(content);
  assert.equal(validatedContent.iss, issuer, 'Invalid issuer.');
  assert.equal(validatedContent.sub, subject, 'Invalid subject.');
  assert.equal(validatedContent.name, name, 'Invalid name.');
  assert.equal(validatedContent.type, type, 'Invalid type.');
  assert.equal(validatedContent.key, key, 'Invalid key.');
};

export const verifySignedPublicKeys = (
  /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
  healthDepartment: any,
  certificatePem: string,
  signedPublicHDSKP: string,
  signedPublicHDEKP: string
) => {
  const certificate = forge.pki.certificateFromPem(certificatePem);
  const publicKeyPem = forge.pki.publicKeyToPem(certificate.publicKey);
  const fingerprint = getFingerprint(certificate);
  const commonName = certificate.subject.getField('CN')?.value;

  // verify against D-Trust Chain
  const isChainValid = verifyCertificateAgainstDTrustChain(certificate);

  assert.ok(isChainValid, 'Certificate chain is invalid.');

  assert.equal(
    commonName,
    healthDepartment.commonName,
    'Common name mismatch.'
  );

  // verify signedPublicHDSKP
  verifySignedJwt({
    token: signedPublicHDSKP,
    publicKeyPem,
    issuer: fingerprint,
    subject: healthDepartment.uuid,
    name: healthDepartment.name,
    type: 'publicHDSKP',
    key: healthDepartment.publicHDSKP,
  });

  // verify signedPublicHDEKP
  verifySignedJwt({
    token: signedPublicHDEKP,
    publicKeyPem,
    issuer: fingerprint,
    subject: healthDepartment.uuid,
    name: healthDepartment.name,
    type: 'publicHDEKP',
    key: healthDepartment.publicHDEKP,
  });
};

const locationTransferSigningSchema = z
  .object({
    iss: z.uuid(),
    type: z.literal('locationTransfer'),
    locationId: z.uuid(),
    time: z.array(z.unixTimestamp()).length(2),
    iat: z.unixTimestamp(),
  })
  .strict();

export const extractAndVerifyLocationTransfer = ({
  signedLocationTransfer,
  healthDepartment,
  locationId,
  time,
}: {
  signedLocationTransfer: string;
  locationId: string;
  time: number[];
  /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
  healthDepartment: any;
}) => {
  const content = jwt.verify(
    signedLocationTransfer,
    publicKeyToECPublicKeyPEM(base64ToHex(healthDepartment.publicHDSKP)),
    {
      algorithms: ['ES256'],
      issuer: healthDepartment.uuid,
    }
  );

  const validatedContent = locationTransferSigningSchema.parse(content);

  assert.equal(validatedContent.iss, healthDepartment.uuid, 'Invalid issuer.');
  assert.equal(validatedContent.locationId, locationId, 'Invalid location.');
  assert.equal(validatedContent.type, 'locationTransfer', 'Invalid type.');
  assert.deepEqual(validatedContent.time, time, 'Invalid timeframe.');

  return validatedContent;
};
