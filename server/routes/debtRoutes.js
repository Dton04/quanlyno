const express = require('express');
const router = express.Router();
const debtController = require('../controllers/debtController');

router.post('/add', debtController.addDebt);
router.post('/add-user-debt', debtController.addUserAndDebt);
router.get('/', debtController.getDebts);
router.put('/update', debtController.updateDebt);
router.post('/payment/:userId', debtController.makePayment);
router.get('/users', debtController.getUsers);
router.get('/user/:userId', debtController.getUserDebts);
module.exports = router;