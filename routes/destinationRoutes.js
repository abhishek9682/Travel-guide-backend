const express = require('express');
const { addDestination, getDestinations, getDestinationById } = require('../controllers/destinationController');

const router = express.Router();

router.post('/', addDestination);
router.get('/', getDestinations);
router.get('/:id', getDestinationById);

module.exports = router;
