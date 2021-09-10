import forge, { pkcs12 } from 'node-forge';
import jwt from 'jsonwebtoken';

const JWT_ALGORITHM = 'RS512';
const PASSWORD = 'testing';

const decryptPkcs12 = p12file => {
  const p12Asn1 = forge.asn1.fromDer(p12file);
  const p12 = forge.pkcs12.pkcs12FromAsn1(p12Asn1, PASSWORD);

  const certBags = p12.getBags({ bagType: forge.pki.oids.certBag })[
    forge.pki.oids.certBag
  ];

  if (!certBags || certBags.length === 0) {
    throw new Error('Certificate not found');
  }

  const privateKeyBags = p12.getBags({
    bagType: forge.pki.oids.pkcs8ShroudedKeyBag,
  })[forge.pki.oids.pkcs8ShroudedKeyBag];

  if (!privateKeyBags || privateKeyBags.length === 0) {
    throw new Error('Private Key not found');
  }

  const certBag = certBags[0];
  const privateKeyBag = privateKeyBags[0];

  if (!certBag.cert) {
    throw new Error('Certificate not found');
  }

  if (!privateKeyBag.key) {
    throw new Error('Private key not found');
  }

  const certDer = forge.asn1.toDer(forge.pki.certificateToAsn1(certBag.cert));
  const md = forge.md.sha1.create();
  md.update(certDer.data);
  const fingerprint = md.digest().toHex();

  const commonName = certBag.cert.subject.getField('CN')?.value;
  const serialName = certBag.cert.subject.getField({ name: 'serialName' })
    ?.value;

  const cert = forge.pki.certificateToPem(certBag.cert);
  const publicKey = forge.pki.publicKeyToPem(certBag.cert.publicKey);
  const privateKey = forge.pki.privateKeyToPem(privateKeyBag.key);
  return {
    cert: cert.replace(/\r\n/g, '\n'),
    publicKey: publicKey.replace(/\r\n/g, '\n'),
    privateKey: privateKey.replace(/\r\n/g, '\n'),
    fingerprint,
    commonName,
    serialName,
  };
};

const createSignedPublicKeys = (healthDepartment, p12file) => {
  const pkcs12 = decryptPkcs12(p12file);

  const signedPublicHDSKP = jwt.sign(
    {
      sub: healthDepartment.uuid, // health department uuid
      iss: pkcs12.fingerprint, // sha1 fingerprint of cert (hex)
      name: healthDepartment.name, // name of the health department
      key: healthDepartment.publicHDSKP, // public key (base64)
      type: 'publicHDSKP', // key type (base64)
    },
    pkcs12.privateKey,
    { algorithm: JWT_ALGORITHM }
  );

  const signedPublicHDEKP = jwt.sign(
    {
      sub: healthDepartment.uuid, // health department uuid
      iss: pkcs12.fingerprint, // sha1 fingerprint of cert (hex)
      name: healthDepartment.name, // name of the health department
      key: healthDepartment.publicHDEKP, // public key (base64)
      type: 'publicHDEKP', // key type (base64)
    },
    pkcs12.privateKey,
    { algorithm: JWT_ALGORITHM }
  );

  return {
    publicCertificate: pkcs12.cert,
    signedPublicHDSKP,
    signedPublicHDEKP,
  };
};

export const signHealthDepartment = async () => {
  cy.request('GET', '/api/v3/auth/healthDepartmentEmployee/me')
    .then(response => response.body.departmentId)
    .then(departmentId =>
      cy
        .request('GET', `/api/v4/healthDepartments/${departmentId}`)
        .then(response => response.body)
        .then(healthDepartment =>
          cy.readFile('./certs/health.pfx', 'binary').then(pkcs12 => {
            const signedPublicKeys = createSignedPublicKeys(
              healthDepartment,
              pkcs12
            );
            cy.request(
              'POST',
              '/api/internal/end2end/signHealthDepartment',
              signedPublicKeys
            );
          })
        )
    );
};
