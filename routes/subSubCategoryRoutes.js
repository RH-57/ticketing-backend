const express = require('express')
const router = express.Router()
const subSubCategoryController = require('../controllers/SubSubCategoryController')
const {validateCategories} = require('../utils/validators/category')
const verifyToken = require('../middlewares/auth')

router.get('/:subCategoryId/sub-sub-categories', verifyToken, subSubCategoryController.showSubSubCategoryByCategoryId) 
router.post('/:subCategoryId/sub-sub-categories', verifyToken, validateCategories, subSubCategoryController.createSubSubCategory)
router.put('/:subCategoryId/sub-sub-categories/:subSubCategoryId', verifyToken, validateCategories, subSubCategoryController.updateSubSubCategory)
router.delete('/:subCategoryId/sub-sub-categories/:subSubCategoryId', verifyToken, subSubCategoryController.deleteSubSubCategory)


module.exports = router