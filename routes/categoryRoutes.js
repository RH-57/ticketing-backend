const express = require('express')
const router = express.Router()
const categoryController = require('../controllers/CategoryController')
const {validateCategories} = require('../utils/validators/category')
const verifyToken = require('../middlewares/auth')

router.get('/', verifyToken, categoryController.showCategories) 
router.get('/:id', verifyToken, categoryController.showCategoryById) 
router.post('/', verifyToken, validateCategories, categoryController.createCategories)  
router.put('/:id', verifyToken, validateCategories, categoryController.updateCategories)  
router.delete('/:id', verifyToken, categoryController.deleteCategories)


module.exports = router