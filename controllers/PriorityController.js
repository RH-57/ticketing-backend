const prisma = require('../prisma/client')
const {validationResult} = require('express-validator')
const {toJakartaTime} = require('../utils/timeUtils')

const showPriority = async (req, res) => {
    try {
        const priorities = await prisma.priority.findMany({
            select: {
                id: true,
                name: true
            },
            orderBy: {
                id: 'desc'
            }
        })

        res.status(200).send({
            status: true,
            message: 'Get All Priority',
            data: priorities
        })
    } catch (error) {
        res.status(500).send({
            status: false,
            message: 'Internal Server Error'
        })
    }
}

const createPriority = async (req, res) => {
    const errors = validationResult(req)

    if(!errors.isEmpty()) {
        return res.status(422).json({
            success: false,
            message: 'Validation Error',
            errors: errors.array()
        })
    }
    
    try {
        const now = new Date();
        const jakartaTime = toJakartaTime(now);

        const priority = await prisma.priority.create({
            data: {
                name: req.body.name,
                createdAt: jakartaTime,
            }
        })
        res.status(201).send({
            success: true,
            message: 'New Priority Created',
            data: priority,
        })
    } catch (error) {
        res.status(500).send({
            success: false,
            message: 'Internal Server Error'
        })
    }
}

const updatePriority = async (req, res) => {
    const {id} = req.params
    const errors = validationResult(req)

    if(!errors.isEmpty()) {
        return res.status(422).json({
            status: false,
            message: 'Validation Error',
            errors: errors.array()
        })
    }

    try {
        const priority = await prisma.priority.update({
            where: {
                id: Number(id)
            },
            data: {
                name: req.body.name
            }
        })

        res.status(200).send({
            status: true,
            message: 'Priority has been updated',
            data: priority
        })
    } catch (error) {
        res.status(500).send({
            status: false,
            message: 'Internal Server Error'
        })
    }
}

const deletePriority = async (req, res) => {
    const {id} = req.params

    try {
        await prisma.priority.delete({
            where: {
                id: Number(id)
            },
        })

        res.status(200).send({
            status: true,
            message: 'Priority has been deleted'
        })
    } catch (error) {
        res.status(500).send({
            status: false,
            message: 'Internal Server Error'
        })
    }
}

module.exports = {showPriority, createPriority, updatePriority, deletePriority}