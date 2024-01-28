const express = require('express');
const systemeController = require('../controller/systeme.controller');
const router = express.Router();

router.post('/auth', systemeController.authenticated);
router.post('/addProjet', systemeController.addProjet);
router.get('/deleteProjet/:id', systemeController.deleteProjet);
router.post('/editProjet', systemeController.editProjet);


module.exports = router;