#!/bin/bash
set -euo pipefail

CA_DIR="ca"
CERTS_DIR="ca/certs"
PFX_PASS="testing"

if [ -f "$CERTS_DIR/ca_root.pem" ]; then
  echo "Root CA already exists."
else

  mkdir -p $CERTS_DIR

  # generate self-signed root ca
  cfssl genkey -initca $CA_DIR/ca_root.json | cfssljson -bare $CERTS_DIR/ca_root

  # generate intermediate ca
  cfssl genkey $CA_DIR/ca_basic.json | cfssljson -bare $CERTS_DIR/ca_basic
  cfssl sign -config $CA_DIR/config.json -profile ca -ca $CERTS_DIR/ca_root.pem -ca-key $CERTS_DIR/ca_root-key.pem $CERTS_DIR/ca_basic.csr | cfssljson -bare $CERTS_DIR/ca_basic

  # generate Health Department Certificate
  cfssl genkey $CA_DIR/health.json | cfssljson -bare $CERTS_DIR/health
  cfssl sign -config $CA_DIR/config.json -profile client -ca $CERTS_DIR/ca_basic.pem -ca-key $CERTS_DIR/ca_basic-key.pem $CERTS_DIR/health.csr | cfssljson -bare $CERTS_DIR/health

  # generate SSL Certificate
  cfssl genkey $CA_DIR/ssl.json | cfssljson -bare $CERTS_DIR/ssl
  cfssl sign -config $CA_DIR/config.json -profile server -ca $CERTS_DIR/ca_basic.pem -ca-key $CERTS_DIR/ca_basic-key.pem $CERTS_DIR/ssl.csr | cfssljson -bare $CERTS_DIR/ssl

 # generate client certificates
  openssl pkcs12 -export -inkey $CERTS_DIR/health-key.pem  -in $CERTS_DIR/health.pem -name health -passout pass:$PFX_PASS -out $CERTS_DIR/health.pfx

fi
# copy certificates to services
# nginx
cp $CERTS_DIR/ssl.pem services/elb/ssl/ssl.crt.pem
cat $CERTS_DIR/ca_basic.pem >> services/elb/ssl/ssl.crt.pem
cp $CERTS_DIR/ssl-key.pem services/elb/ssl/ssl.key.pem
cp $CERTS_DIR/ca_root.pem services/elb/ssl/ssl.client.pem
cat $CERTS_DIR/ca_basic.pem >> services/elb/ssl/ssl.client.pem
chmod 644 services/elb/ssl/*.pem

# backend
cp $CERTS_DIR/ca_root.pem services/backend/certs/root.pem
cp $CERTS_DIR/ca_basic.pem services/backend/certs/basic.pem
chmod 644 services/backend/certs/*.pem

# e2e
cp $CERTS_DIR/health.pfx e2e/certs/health.pfx
chmod 644  e2e/certs/health.pfx