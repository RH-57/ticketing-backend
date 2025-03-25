const express = require('express')
const prisma = require('../prisma/client')
const {validationResult} = require('express-validator')
const slugify = require('slugify')

const showSubCategoryByCategory = async (req, res) => {
    try {
        const {categoryId} = req.params

        if(isNaN(categoryId)) {
            return res.status(400).json({
                status: false,
                message: 'Invalid Category ID',
            })
        }

        const subCategories = await prisma.subCategory.findMany({
            where: {
                categoryId: Number(categoryId)
            }
        })

        if(subCategories.lenght === 0) {
            return res.status(404).json({
                status: false,
                message: 'No sub-categories found for this category',
                data: []
            })
        }

        res.status(200).send({
            status: true,
            message: 'Get Sub-Category Successfully',
            data: subCategories
        })
    } catch (error) {
        res.status(500).send({
            status: false,
            message: 'Internal Server Error'
        })
    }
}

const showSubCategoryById = async (req, res) => {
    const {subCategoryId} = req.params

    try {
        const subCategories = await prisma.subCategory.findUnique({
            where: {
                id: Number(subCategoryId)
            },
        })

        if(!subCategories) {
            return res.status(404).send({
                status: false,
                message: 'Category no found'
            })
        }

        res.status(200).send({
            status: true,
            message: 'Get Category by Id',
            data: subCategories
        })
    } catch (error) {
        console.error(error)
        res.status(500).send({
            status: false,
            message: 'Internal Server Error'
        })
    }
}

const createSubCategory = async (req, res) => {
    const errors = validationResult(req)
    if(!errors.isEmpty()) {
        return res.status(422).json({
            status: false,
            message: 'Validation Error',
            errors: errors.array()
        })
    }

    try {
        const {name} = req.body
        const {categoryId} = req.params
        let slug = slugify(name, {
            lower: true,
            strict: true
        })

        const categoryExists = await prisma.category.findUnique({
            where: {
                id: Number(categoryId)
            }
        })

        if(!categoryExists) {
            return res.status(404).json({
                status: false,
                message: 'category not found'
            })
        }

        const subCategory = await prisma.subCategory.create({
            data: {
                name,
                slug,
                categoryId: Number(categoryId)
            }
        })

        res.status(200).send({
            status: true,
            message: 'sub-category has been created',
            data: subCategory
        })
    } catch (error) {
        console.log(error)
        res.status(500).send({
            status: false,
            message: 'Internal Server Error'
        })
    }
}

const updateSubCategory = async (req, res) => {
    const errors = validationResult(req)
    if(!errors.isEmpty()) {
        return res.status(422).json({
            status: false,
            message: 'Validation Error',
            errors: errors.array()
        })
    }

    try {
        const {categoryId, subCategoryId} = req.params
        const {name} = req.body
        let slug = slugify(name, {
            lower: true,
            strict: true
        })

        const categoryExists = await prisma.category.findUnique({
            where: {
                id: Number(categoryId)
            }
        })

        if(!categoryExists) {
            return res.status(404).json({
                status: false,
                message: 'category not found'
            })
        }

        const subCategoryExists = await prisma.subCategory.findFirst({
            where: {
                id: Number(subCategoryId),
                categoryId: Number(categoryId)
            }
        })

        if(!subCategoryExists) {
            return res.status(404).json({
                status: false,
                message: 'sub-category not found'
            })
        }

        const subCategory = await prisma.subCategory.update({
            where: {
                id: Number(subCategoryId)
            },
            data: {
                name,
                slug
            }
        })

        res.status(200).send({
            status: true,
            message: 'sub-category has been updated',
            data: subCategory
        })
    } catch (error) {
        res.status(500).send({
            status: false,
            message: 'Internal Server Error'
        })
    }
}

const deleteSubCategory = async (req, res) => {
    try {
        const {categoryId, subCategoryId} = req.params

        const categoryExists = await prisma.category.findUnique({
            where: {
                id: Number(categoryId),
            }
        })

        if(!categoryExists) {
            return res.status(404).json({
                status: false,
                message: 'Category not found'
            })
        }

        const subCategoryExists = await prisma.subCategory.findFirst({
            where: {
                id: Number(subCategoryId),
                categoryId: Number(categoryId)
            }
        })

        if(!subCategoryExists) {
            return res.status(404).json({
                status: false,
                message: 'Sub-Category not found'
            })
        }

        await prisma.subCategory.delete({
            where: {
                id: Number(subCategoryId)
            }
        })

        res.status(200).send({
            status: true,
            message: 'Sub-Category has been deleted'
        })
    } catch (error) {
        res.status(500).send({
            status: false,
            message: 'Internal Server Error'
        })
    }
}

module.exports = {showSubCategoryByCategory, showSubCategoryById, createSubCategory, updateSubCategory, deleteSubCategory}