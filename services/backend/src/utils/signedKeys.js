const forge = require('node-forge');
const jwt = require('jsonwebtoken');
const assert = require('assert');
const config = require('config');
const { z } = require('./validation');

let ROOT_CA_STORE;
let D_TRUST_BASIC_CA;

const loadCertificates = () => {
  const D_TRUST_ROOT_CA = forge.pki.certificateFromPem(
    config.get('certs.dtrust.root')
  );

  D_TRUST_BASIC_CA = forge.pki.certificateFromPem(
    config.get('certs.dtrust.basic')
  );

  ROOT_CA_STORE = forge.pki.createCaStore([D_TRUST_ROOT_CA]);
};

const jwtSchema = z
  .object({
    sub: z.uuid(),
    iss: z.string().length(40),
    name: z.string().max(255),
    key: z.ecPublicKey(),
    type: z.enum(['publicHDEKP', 'publicHDSKP']),
    iat: z.unixTimestamp(),
  })
  .strict();

const getFingerprint = certificate => {
  const certDer = forge.asn1.toDer(forge.pki.certificateToAsn1(certificate));
  const md = forge.md.sha1.create();
  md.update(certDer.data);
  return md.digest().toHex();
};

const verifyCertificateAgainstDTrustChain = certificate => {
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
}) => {
  const content = jwt.verify(token, publicKeyPem, {
    algorithms: ['RS512'],
    subject,
    issuer,
    maxAge: '10 minutes',
  });

  const validatedContent = jwtSchema.parse(content);
  assert.equal(validatedContent.iss, issuer, 'Invalid issuer.');
  assert.equal(validatedContent.sub, subject, 'Invalid subject.');
  assert.equal(validatedContent.name, name, 'Invalid name.');
  assert.equal(validatedContent.type, type, 'Invalid type.');
  assert.equal(validatedContent.key, key, 'Invalid key.');
};

const verifySignedPublicKeys = (
  healthDepartment,
  certificatePem,
  signedPublicHDSKP,
  signedPublicHDEKP
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

module.exports = {
  loadCertificates,
  verifySignedPublicKeys,
  verifyCertificateAgainstDTrustChain,
};
