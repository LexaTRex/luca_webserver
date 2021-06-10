#!/bin/bash
set -euo pipefail

SERVICES="backend contact-form health-department locations scanner webapp"

for SERVICE in ${SERVICES}
do
  pushd "services/$SERVICE"
  yarn "$@"
  popd
done