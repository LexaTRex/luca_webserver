#!/bin/sh
set -o nounset

YARN_PUBLIC_REGISTRY=https://registry.yarnpkg.com/
SERVICES="backend contact-form health-department locations scanner webapp"

sed -i -e "s+image: lucaapp+image: $DOCKER_REPOSITORY+g" docker-compose.yml

# replace npm registry references
for SERVICE in ${SERVICES}
do
  echo "Using private registry for $SERVICE"
  sed -i -e "s+$YARN_PUBLIC_REGISTRY+$NPM_REGISTRY+g" "services/$SERVICE/yarn.lock"

  # change npm and yarn options for compatibility with private registry
  cat <<EOF >> "services/${SERVICE}/.npmrc"
always-auth=true
registry=${NPM_REGISTRY}
strict-ssl=false
EOF
  cat <<EOF >> "services/${SERVICE}/.yarnrc"
strict-ssl false
EOF
done