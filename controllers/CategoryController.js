const express = require('express')
const prisma = require('../prisma/client')
const {validationResult} = require('express-validator')
const slugify = require('slugify')

const showCategories = async (req, res) => {
    try {
        const categories = await prisma.category.findMany({
            include: {
                subCategories: true
            }
        })

        res.status(200).send({
            status: true,
            message: 'get all categories',
            data: categories
        })
    } catch (error) {
        res.status(500).send({
            status: false,
            message: 'Internal Server Error'
        })
    }
}

const showCategoryById = async (req, res) => {
    const {id} = req.params

    try {
        const categories = await prisma.category.findUnique({
            where: {
                id: Number(id)
            },
        })

        if(!categories) {
            return res.status(404).send({
                status: false,
                message: 'Category no found'
            })
        }

        res.status(200).send({
            status: true,
            message: 'Get Category by Id',
            data: categories
        })
    } catch (error) {
        res.status(500).send({
            status: false,
            message: 'Internal Server Error'
        })
    }
}

const createCategories = async (req, res) => {
    const errors = validationResult(req)
    if(!errors.isEmpty()) {
        return res.status(422).json({
            status: false,
            message: 'Validation error',
            errors: errors.array()
        })
    }

    try {
        const {name} = req.body
        let slug = slugify(name, {
            lower: true,
            strict: true
        })

        const category = await prisma.category.create({
            data: {
                name,
                slug
            },
            include: {
                subCategories: true
            }
        })

        res.status(200).send({
            status: true,
            message: 'New category created',
            data: category
        })
    } catch(error) {
        res.status(500).send({
            status: false,
            message: 'Internal Server Error'
        })
    }
}

const updateCategories = async (req, res) => {
    try {
        const {id} = req.params
        const {name} = req.body
        let slug = slugify(name, {
            lower: true,
            strict: true
        })

        const category = await prisma.category.update({
            where: {
                id: Number(id)
            },
            data: {
                name,
                slug
            },
            include: {
                subCategories: true
            }
        })

        res.status(200).send({
            status: true,
            message: 'Category has been updated',
            data: category
        })
    } catch (error) {
        res.status(500).send({
            status: false,
            message: 'Internal Server Error'
        })
    }
}

const deleteCategories = async (req, res) => {
    const {id} = req.params
    try {
        await prisma.category.delete({
            where: {
                id: Number(id)
            }
        })

        res.status(200).send({
            status: true,
            message: 'Category has been deleted',
        })
    } catch (error) {
        res.status(500).send({
            status: false,
            message: 'Internal Server Error'
        })
    }
}

module.exports = {showCategories, createCategories, updateCategories, deleteCategories, showCategoryById}