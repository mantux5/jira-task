const express = require('express');
const creatorController = require('../../controllers/creator.controller');

const router = express.Router();

router
  .route('/')
  .get(creatorController.getCreators);

router
  .route('/:creatorId')
  .patch(creatorController.updateCreator);

module.exports = router;