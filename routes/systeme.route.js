const express = require('express');
const systemeController = require('../controller/systeme.controller');
const router = express.Router();

router.post('/auth', systemeController.authenticated);
router.post('/addProjet', systemeController.addProjet);
router.get('/listProjet/:uid', systemeController.listProjet);


module.exports = router;