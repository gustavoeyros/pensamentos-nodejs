const express = require('express')
const router = express.Router()
const ThoughtController = require('../controllers/ThoughtController')
//controller

router.get('/', ThoughtController.showThoughts)


module.exports = router