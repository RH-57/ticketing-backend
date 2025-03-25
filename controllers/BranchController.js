const express = require('express')
const prisma = require('../prisma/client')
const {validationResult} = require('express-validator')

const showBranch = async (req, res) => {
    try {
        const branches = await prisma.branch.findMany({
            select: {
                id: true,
                code: true,
                name: true,
                createdAt: true,
                updatedAt: true,
            },
            orderBy: {
                id: 'desc'
            },
        })

        res.status(200).send({
            status: true,
            message: 'Get All Branch Successfully',
            data: branches
        })
    } catch (error) {
        res.status(500).send({
            status: false,
            message: 'Internal Server Error'
        })
    }
}

const searchBranch = async(req, res) => {
    const {query} = req.query
    if(!query) {
        return res.status(400).json({
            status: false,
            message: 'Query parameter required'
        })
    }

    try{
        const branches = await prisma.branch.findMany({
            where: {
                OR: [
                    {code: {contains: query.toLowerCase()}},
                    {name: {contains: query.toLowerCase()}},
                ],
            },
            select: {
                id: true,
                code: true,
                name: true
            },
            orderBy: {
                id: 'desc'
            },
        })

        res.status(200).send({
            status: true,
            message: 'Search Result',
            data: branches
        })
    } catch(error) {
        console.error(error)
        res.status(500).send({
            status: false,
            message: 'Internal Server Error'
        })
    }
}

const createBranch = async (req, res) => {
    const errors = validationResult(req)

    if(!errors.isEmpty()) {
        return res.status(422).json({
            success: false,
            message: 'Validation Error',
            errors: errors.array(),
        })
    }

    try {
        const branch = await prisma.branch.create({
            data: {
                code: req.body.code,
                name: req.body.name,
            }
        })

        res.status(201).send({
            success: true,
            message: 'New Branch Created',
            data: branch
        })
    } catch (error) {
        res.status(500).send({
            success: false,
            message: 'Internal Server Error'
        })
    }
}

const updateBranch = async (req, res) => {
    const {id} = req.params
    const errors = validationResult(req)

    if(!errors.isEmpty()) {
        return res.status(422).json({
            success: false,
            message: 'Validation Error',
            errors: errors.array()
        })
    }

    try {
        const branch = await prisma.branch.update({
            where: {
                id: Number(id)
            },
            data: {
                code: req.body.code,
                name: req.body.name
            }
        })

        res.status(200).send({
            success: true,
            message: 'Branch Update Successfully',
            data: branch
        })
    } catch (error) {
        res.status(500).send({
            success: false,
            message: 'Internal Server Error'
        })
    }
}

const deleteBranch = async (req, res) => {
    const {id} = req.params
    try {
        await prisma.branch.delete({
            where: {
                id: Number(id)
            },
        })

        res.status(200).send({
            success: true,
            message: 'Branch Deleted Successfully'
        })
    } catch (error) {
        res.status(500).send({
            success: false,
            message: 'Internal Server Error'
        })
    }
}

module.exports = {showBranch, createBranch, updateBranch, deleteBranch, searchBranch}