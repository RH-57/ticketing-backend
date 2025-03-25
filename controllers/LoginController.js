const express = require('express')
const {validationResult} = require('express-validator')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const prisma = require('../prisma/client')

const login = async (req, res) => {
    const errors = validationResult(req)

    if(!errors.isEmpty()) {
        return res.status(422).json({
            success: false,
            message: 'validation error',
            errors: errors.array(),
        })
    }

    try {
        const user = await prisma.user.findFirst({
            where: {
                email: req.body.email,
                deletedAt: null
            },
            select: {
                id: true,
                name: true,
                email: true,
                password: true,
                role: true
            }
        })

        if(!user)
            return res.status(404).json({
                success: false,
                message: 'User not found'
            })

        const validPassword = await bcrypt.compare(
            req.body.password,
            user.password
        )

        if(!validPassword)
            return res.status(401).json({
                success: false,
                message: 'Invalid Password'
            })
        
        const token = jwt.sign({id: user.id, role: user.role}, process.env.JWT_SECRET, {
            expiresIn: '8h',
        })

        const {password, ...userWithoutPassword} = user

        res.status(200).send({
            success: true,
            message: 'Login successfully',
            data: {
                user: userWithoutPassword,
                token: token,
            },
        })
    } catch {
        res.status(500).send({
            success: false,
            message: 'Internal Server error'
        })
    }
}

module.exports = {login}