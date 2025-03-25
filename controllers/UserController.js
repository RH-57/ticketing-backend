const express = require('express')
const prisma = require('../prisma/client')
const { validationResult } = require('express-validator')
const bcrypt = require('bcryptjs')

const showUser = async (req, res) => {
    try {
        const users = await prisma.user.findMany({
            where: {
                deletedAt: null
            },
            select: {
                id: true,
                name: true,
                email: true,
                role: true
            },
            orderBy: {
                id: 'desc'
            },
        })

        res.status(200).send({
            status: true,
            message: 'Get All Users successfully',
            data: users
        })
    } catch (error) {
        res.status(500).send({
            status: false,
            message: 'Internal Server Error'
        })
    }
}

const createUser = async (req, res) => {
    const errors = validationResult(req)

    if(!errors.isEmpty()) {
        return res.status(422).json({
            success: false,
            message: 'Validation error',
            errors: errors.array()
        });
    }

    const hashedPassword = await bcrypt.hash(req.body.password, 10)

    try {
        const user = await prisma.user.create({
            data: {
                name: req.body.name,
                email: req.body.email,
                password: hashedPassword,
                role: req.body.role
            },
        })

        res.status(201).send({
            status: true,
            message: 'New User Created',
            data: user,
        })
    } catch (error) {
        res.status(500).send({
            status:false,
            message: 'Internal Server Error',
        })
    }
}


const findUser = async (req, res) => {
    const {query} = req.query
        if(!query) {
            return res.status(400).json({
                status: false,
                message: 'Query parameter required'
            })
        }
    try {
        const users = await prisma.user.findMany({
            where: {
                deletedAt: null,
                OR: [
                    {name: {contains: query.toLowerCase()}},
                    {email: {contains: query.toLowerCase()}},
                ],
            },
            orderBy: {
                id: 'desc'
            },
        })

        res.status(200).send({
            status: true,
            message: 'Get User Successfully',
            data: users
        })
    } catch(error) {
        res.status(500).send({
            status: false,
            message: 'Internal Server Error'
        })
    }
}

const findUserById = async (req, res) => {
    const { id } = req.params

    try {
        const user = await prisma.user.findUnique({
            where: {
                id: Number(id),
                deletedAt: null,
            },
            select: {
                id: true,
                name: true,
                email: true,
                role: true,
            },
        })

        res.status(200).send({
            status: true,
            message: `Get user by id ${id}`,
            data: user,
        })
    } catch (error) {
        res.status(500).send({
            status: false,
            message: 'Internal Server Error',
        })
    }
}

const updateUser = async (req, res) => {
    const {id} = req.params

    const errors = validationResult(req)

    if(!errors.isEmpty()) {
        return res.status(422).json({
            status: false,
            message: 'validation error',
            errors: errors.array(),
        })
    }

    try {
        let updateData = {
            name: req.body.name,
            email: req.body.email,
            role: req.body.role,
        }

        if(req.body.password) {
            updateData.password = await bcrypt.hash(req.body.password, 10)
        }
        const user = await prisma.user.update({
            where: {
                id: Number(id),
                deletedAt: null
            },
            data: updateData,
        })

        res.status(200).send({
            success: true,
            message: 'user update successfully',
            data: user
        })
    } catch (error) {
        res.status(500).send({
            status: false,
            message: 'Internal Server Error'
        })
    }
}

const deleteUser = async (req, res) => {
    const {id} = req.params
    try {
        const existingUser = await prisma.user.findUnique({
            where: {
                id: Number(id)
            },
        })

        if(!existingUser || existingUser.deletedAt !== null) {
            return res.status(404).json({
                status: false,
                message: 'user not found or has been deleted'
            })
        }

        await prisma.user.update({
            where: {
                id: Number(id)
            },
            data: {
                deletedAt: new Date()
            },
        })

        res.status(200).json({
            success: true,
            message: 'user delete successfully'
        })
    } catch (error) {
        res.status(500).json({
            status: false,
            mesage: 'Internal Server Error'
        })
    }
}

module.exports = { showUser, createUser, findUser, findUserById, updateUser, deleteUser }