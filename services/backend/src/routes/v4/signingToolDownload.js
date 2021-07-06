const router = require('express').Router();

const database = require('../../database');

const {
  requireHealthDepartmentAdmin,
} = require('../../middlewares/requireUser');

router.get('/downloads', requireHealthDepartmentAdmin, async (_, response) => {
  const downloads = await database.SigningToolDownload.findAll({
    order: [['version', 'DESC']],
  });

  return response.send(
    downloads.map(({ version, downloadUrl, hash }) => ({
      version,
      downloadUrl,
      hash,
    }))
  );
});

module.exports = router;
