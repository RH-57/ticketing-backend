const prisma = require('../prisma/client')
const {validationResult} = require('express-validator')

const showDivision = async (req, res) => {
    try {
        const divisions = await prisma.division.findMany({
            select: {
                id: true,
                name: true,
                branchId: true,
                branch: {
                    select: {
                        code: true
                    }
                }
            },
            orderBy: {
                id: 'desc'
            }
        })

        res.status(200).send({
            success: true,
            message: 'Get All Divisions Successfully',
            data: divisions
        })
    } catch (error) {
        res.status(500).send({
            success: false,
            message: 'Internal Server Error'
        })
    }
}

const searchDivision = async (req, res) => {
    const {query} = req.query

    if(!query) {
        return res.status(400).json({
            success: false,
            messagE: 'Query parameter required'
        })
    }

    try {
        const divisions = await prisma.division.findMany({
            where: {
                name: {
                    contains: query.toLowerCase()
                }
            }, 
            select: {
                id: true,
                name: true,
                branchId: true,
                branch: {
                    select: {
                        code: true
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
            data: divisions
        })
    } catch (error) {
        res.status(500).send({
            succes: false,
            message: 'Internal Server Error'
        })
    }
}

const getDivisionByBranchId = async (req, res) => {
    const {branch} = req.query

    try {
        const divisions = await prisma.division.findMany({
            where: {
                branchId: Number(branch)
            }
        })

        res.status(200).send({
            success: true,
            message: 'Get Division by Branch',
            data: divisions
        })
    } catch (error) {
        res.status(500).send({
            succes: false,
            message: 'Internal Server Error'
        })
    }
}

const createDivision = async (req, res) => {
    const errors = validationResult(req)

    if(!errors.isEmpty()) {
        return res.status(422).json({
            success: false,
            message: 'Validation Error',
            errors: errors.array()
        })
    }

    try {
        const divisions = await prisma.division.create({
            data: {
                name: req.body.name,
                branchId: Number(req.body.branchId)
            }
        })

        res.status(201).send({
            success: true,
            message: 'New Division has been created',
            data: divisions
        })
    } catch (error) {
        res.status(500).send({
            success: false,
            message: 'Internal Server Error'
        })
    }
}

const updateDivision = async (req, res) => {
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
        const divisions = await prisma.division.update({
            where: {
                id: Number(id)
            },
            data: {
                name: req.body.name,
                branchId: Number(req.body.branchId)
            }
        })

        res.status(200).send({
            success: true,
            message: 'Division has been updated',
            data: divisions
        })
    } catch (error) {
        res.status(500).send({
            success: false,
            messagE: 'Internal Server Error'
        })
    }
}

const deleteDivision = async (req, res) => {
    const {id} = req.params

    try {
        await prisma.division.delete({
            where: {
                id: Number(id)
            }
        })

        res.status(200).send({
            success: true,
            message: 'Division has been deleted',
        })
    } catch (error) {
        res.status(500).send({
            success: false,
            messagE: 'Internal Server Error'
        })
    }
}


module.exports = {showDivision, searchDivision, getDivisionByBranchId, createDivision, updateDivision, deleteDivision}