const express = require('express')
const prisma = require('../prisma/client')
const {validationResult} = require('express-validator')
const slugify = require('slugify')

const showSubSubCategoryByCategoryId = async (req, res) => {
    try {
        const {subCategoryId} = req.params

        if(isNaN(subCategoryId)) {
            return res.status(400).json({
                status: false,
                message: 'Invalid Sub-Category ID'
            })
        }

        const subSubCategories = await prisma.subSubCategory.findMany({
            where: {
                subCategoryId: Number(subCategoryId)
            }
        })

        if(subSubCategories.length === 0) {
            return res.status(404).json({
                status: false,
                message: 'No sub-sub-categories found for this sub-category',
                data: []
            })
        }

        res.status(200).send({
            status: true,
            message: 'Get Sub-Sub-category Successfully',
            data: subSubCategories
        })
    } catch(error) {
        res.status(500).send({
            status: false,
            message: 'Internal Server Error'
        })
    }
}

const createSubSubCategory = async (req, res) => {
    const errors = validationResult(req)
    if(!errors.isEmpty()) {
        return res.status(422).json({
            status: false,
            message: 'Validation Error',
            errors: errors.array()
        })
    }

    try {
        const {subCategoryId} = req.params
        const {name} = req.body

        const subCategoryExists = await prisma.subCategory.findUnique({
            where: {
                id: Number(subCategoryId)
            }
        })

        if(!subCategoryExists) {
            return res.status(404).json({
                status: false,
                message: 'Sub-Category not found'
            })
        }

        const subSubCategories = await prisma.subSubCategory.create({
            data: {
                name,
                subCategoryId: Number(subCategoryId)
            }
        })

        res.status(200).send({
            status: true,
            message: 'Sub-Sub-Category has been created',
            data: subSubCategories
        })
    } catch (error) {
        res.status(500).send({
            status: false,
            message: 'Internal Server Error',
            error: error.message
        })
    }
}

const updateSubSubCategory = async (req, res) => {
    const errors = validationResult(req)
    if(!errors.isEmpty()) {
        return res.status(422).json({
            status: false,
            message: 'Validation Error',
            errors: errors.array()
        })
    }

    try {
        const {subCategoryId, subSubCategoryId} = req.params
        const {name} = req.body

        const subSubCategoryExists = await prisma.subSubCategory.findFirst({
            where: {
                id: Number(subSubCategoryId),
                subCategoryId: Number(subCategoryId)
            }
        })

        if(!subSubCategoryExists) {
            return res.status(404).json({
                status: false,
                message: 'Sub-Sub-Category not found'
            })
        }

        const subSubCategories = await prisma.subSubCategory.update({
            where: {
                id: Number(subSubCategoryId)
            },
            data: {
                name,
            }
        })

        res.status(200).send({
            status: true,
            message: 'Sub-Sub-Category has been updated',
            data: subSubCategories
        })
    } catch (error) {
        res.status(500).send({
            status: false,
            message: 'Internal Server Error',
            error: error.message
        })
    }
}

const deleteSubSubCategory = async (req, res) => {
    try {
        const {subCategoryId, subSubCategoryId} = req.params
        const subSubCategoryExists = await prisma.subSubCategory.findFirst({
            where: {
                id: Number(subSubCategoryId),
                subCategoryId: Number(subCategoryId)
            }
        })

        if(!subSubCategoryExists) {
            return res.status(404).json({
                status: false,
                message: 'Sub-Sub-Category Not found'
            })
        }

        await prisma.subSubCategory.delete({
            where: {
                id: Number(subSubCategoryId)
            }
        })

        res.status(200).send({
            status: true,
            message: 'Sub-Sub-Category has been deleted'
        })
    } catch (error) {
        res.status(500).send({
            status: false,
            message: 'Internal Server Error',
            error: error.message
        })
    }
}

module.exports = {showSubSubCategoryByCategoryId, createSubSubCategory, updateSubSubCategory, deleteSubSubCategory}