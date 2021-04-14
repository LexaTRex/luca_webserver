const fs = require('fs');
const router = require('express').Router();

const fullLicenses = fs.readFileSync('./licenses-full.txt');

router.get('/', (request, response) => {
  response.type('text/plain');
  response.send(fullLicenses);
});

module.exports = router;
