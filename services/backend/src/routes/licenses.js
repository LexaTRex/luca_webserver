const fs = require('fs');
const router = require('express').Router();

let licenses;
try {
  licenses = fs.readFileSync('./licenses.txt');
} catch {
  licenses = 'Licenses not found.';
}

router.get('/', (request, response) => {
  response.type('text/plain');
  response.send(licenses);
});

module.exports = router;
