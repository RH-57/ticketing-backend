const express = require('express')
const prisma = require('../prisma/client')
const {validationResult} = require('express-validator')

const showDept = async (req, res) => {
    try {
        const departments = await prisma.department.findMany({
            select: {
                id: true,
                name: true,
                branchId: true,
                branch: {
                    select: {
                        code: true
                    }
                },
                divisionId: true,
                division: {
                    select: {
                        name: true
                    }
                }
            },
            orderBy: {
                id: 'desc'
            }
        })

        res.status(200).send({
            status: true,
            message: 'Get All Departments Successfully',
            data: departments
        })
    } catch (error) {
        res.status(500).send({
            status: false,
            message: 'Internal Server Error'
        })
    }
}

const searchDept = async (req, res) => {
    const {query} = req.query

    if(!query) {
        return res.status(400).json({
            status: false,
            message: 'Query parameter required'
        })
    }

    try {
        const departments = await prisma.department.findMany({
            where: {
                name: {contains: query.toLowerCase()}
            },
            select: {
                id: true,
                name: true,
                branchId: true,
                branch: {
                    select: {
                        code: true
                    }
                },
                divisionId: true,
                division: {
                    select: {
                        name: true
                    }
                }
            },
            orderBy: {
                id: 'desc'
            }
        })

        res.status(200).send({
            success: true,
            message: 'Search result',
            data: departments
        })
    } catch (error) {
        res.status(500).send({
            success: false,
            message: 'Internal Server Error'
        })
    }
}

const getDepartmentByDivisionId = async (req, res) => {
    const {division} = req.query

    try {
        const departments = await prisma.department.findMany({
            where: {
                divisionId: Number(division)
            }
        })

        res.status(200).send({
            success: true,
            message: 'Get Department By Division',
            data: departments
        })
    } catch (error) {
        res.status(500).send({
            success: false,
            message: 'Internal Server Error',
        })
    }
}

const createDept = async (req, res) => {
    const errors = validationResult(req)

    if(!errors.isEmpty()) {
        return res.status(422).json({
            success: false,
            message: 'Validation Error',
            errors: errors.array()
        })
    }

    try {
        const departments = await prisma.department.create({
            data: {
                name: req.body.name,
                branchId: Number(req.body.branchId),
                divisionId: Number(req.body.divisionId)
            }
        })

        res.status(201).send({
            success: true,
            message: 'New Department has been created',
            data: departments
        })
    } catch (error) {
        res.status(500).send({
            success: false,
            message: 'Internal Server Error'
        })
    }
}

const updateDept = async (req, res) => {
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
        const departments = await prisma.department.update({
            where: {
                id: Number(id)
            },
            data: {
                name: req.body.name,
                branchId: Number(req.body.branchId),
                divisionId: Number(req.body.divisionId)
            }
        })

        res.status(200).send({
            success: true,
            message: 'Department has been updated',
            data: departments
        })
    } catch (error) {
        res.status(500).send({
            success: false,
            message: 'Internal Server Error'
        })
    }
}

const deleteDept = async (req, res) => {
    const {id} = req.params

    try {
        await prisma.department.delete({
            where: {
                id: Number(id)
            }
        })

        res.status(200).send({
            success: true,
            message: 'Department has been deleted',
        })
    } catch (error) {
        res.status(500).send({
            success: false,
            message: 'Internal Server Error'
        })
    }
}
    

module.exports = {showDept, searchDept, getDepartmentByDivisionId, createDept, updateDept, deleteDept}