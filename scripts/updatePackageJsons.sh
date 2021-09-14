#!/bin/bash
echo "Updating package.json files to version $1"

npx json -I -f package.json -e "this.version=\"$1\""
npx json -I -f e2e/package.json -e "this.version=\"$1\""
npx json -I -f services/backend/package.json -e "this.version=\"$1\""
npx json -I -f services/contact-form/package.json -e "this.version=\"$1\""
npx json -I -f services/health-department/package.json -e "this.version=\"$1\""
npx json -I -f services/locations/package.json -e "this.version=\"$1\""
npx json -I -f services/scanner/package.json -e "this.version=\"$1\""
npx json -I -f services/webapp/package.json -e "this.version=\"$1\""