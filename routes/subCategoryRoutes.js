const express = require('express')
const router = express.Router()
const subCategoryController = require('../controllers/SubCategoryController')
const {validateCategories} = require('../utils/validators/category')
const verifyToken = require('../middlewares/auth')

router.get('/:categoryId/sub-categories', verifyToken, subCategoryController.showSubCategoryByCategory) 
router.get('/:categoryId/sub-categories/:subCategoryId', verifyToken, subCategoryController.showSubCategoryById) 
router.post('/:categoryId/sub-categories', verifyToken, validateCategories, subCategoryController.createSubCategory)
router.put('/:categoryId/sub-categories/:subCategoryId', verifyToken, validateCategories, subCategoryController.updateSubCategory)
router.delete('/:categoryId/sub-categories/:subCategoryId', verifyToken, subCategoryController.deleteSubCategory)


module.exports = router