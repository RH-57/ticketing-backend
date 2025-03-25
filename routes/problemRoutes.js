const express = require('express')
const router = express.Router()
const problemController = require('../controllers/ProblemController')
const {validateProblem} = require('../utils/validators/problem')
const verifyToken = require('../middlewares/auth')
const {verifyCsrfToken} = require('../middlewares/csrf')

router.get('/', verifyToken, problemController.showProblem)
router.get('/:id', verifyToken, problemController.showProblemById)
router.post('/', verifyToken, verifyCsrfToken, validateProblem, problemController.createProblem)

module.exports = router