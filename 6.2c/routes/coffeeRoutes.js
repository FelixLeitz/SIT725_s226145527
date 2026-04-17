const express = require('express');
const router = express.Router();    
const coffeeController = require('../controllers/coffeeController');

router.get('/required', coffeeController.getRequiredCoffees);

module.exports = router;