#!/bin/sh

YARN=https://registry.yarnpkg.com/

SERVICES="backend contact-form health-department locations scanner webapp"

sed -i -e "s+image: lucaapp+image: $DOCKER_REPOSITORY+g" docker-compose.yml

# replace npm registry references
for SERVICE in ${SERVICES}
do
  echo "Using private registry for $SERVICE"
    sed -i -e "s+$YARN+$NPM_REGISTRY+g" services/$SERVICE/yarn.lock
    echo "always-auth=true" >> services/$SERVICE/.npmrc
    echo "strict-ssl=false" >> services/$SERVICE/.npmrc
    echo "registry=$NPM_REGISTRY" >> services/$SERVICE/.npmrc
    echo "strict-ssl false" >> services/$SERVICE/.yarnrc
done