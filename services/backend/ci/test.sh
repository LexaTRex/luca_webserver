set -e
yarn lint
yarn test
yarn improved-yarn-audit --ignore-dev-deps