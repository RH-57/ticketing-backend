const express = require('express')
const router = express.Router()
const userController = require('../controllers/UserController')
const {validateUser} = require('../utils/validators/user')
const verifyToken = require('../middlewares/auth')
const role = require('../middlewares/role')

router.get('/', verifyToken, userController.showUser)
router.post('/', verifyToken, validateUser, userController.createUser)
router.get('/search', verifyToken, role(['superadmin']), userController.findUser);
router.get('/:id', verifyToken, role(['superadmin']), userController.findUserById)
router.put('/:id', verifyToken, role(['superadmin']), validateUser, userController.updateUser)
router.delete('/:id', verifyToken, role(['superadmin']), userController.deleteUser)

module.exports = router