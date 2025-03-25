const express = require('express')
const router = express.Router()
const priorityController = require('../controllers/PriorityController')
const {validatePriority} = require('../utils/validators/priority')
const verifyToken = require('../middlewares/auth')
const {verifyCsrfToken} = require('../middlewares/csrf')

router.get('/', verifyToken, priorityController.showPriority)
router.post('/', verifyToken, verifyCsrfToken, validatePriority, priorityController.createPriority)
router.put('/:id', verifyToken, verifyCsrfToken, validatePriority, priorityController.updatePriority)
router.delete('/:id', verifyToken, verifyCsrfToken, priorityController.deletePriority)

module.exports = router