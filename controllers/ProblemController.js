const express = require('express')
const prisma = require('../prisma/client')
const {validationResult} = require('express-validator')
const {DateTime} = require('luxon')

const showProblem = async (req, res) => {
    try {
        const problems = await prisma.problem.findMany({
            select: {
                reportedAt: true,
                detail_report: true,
                category: {
                    select: {  name: true } // Pilih field dari relasi
                },
                subCategory: {
                    select: { name: true}
                },
                subSubCategory: {
                    select: { name: true }
                },
                branch: {
                    select: {  name: true }
                },
                employee: {
                    select: {  name: true }
                },
                user: {
                    select: { name: true }
                }
            },
        })

        res.status(200).send({
            status: true,
            message: 'Get all problem',
            data: problems
        })
    } catch (error) {
        res.status(500).send({
            status: false,
            message: 'Internal Server Error'
        })
    }
}

const showProblemById = async (req, res) => {
    const {id} = req.params

    try {
        const problems = await prisma.problem.findUnique({
            where: {
                id: Number(id)
            },
            select: {
                id: true,
                reportedAt: true,
                category: { select: { name: true } },
                subCategory: { select: { name: true } },
                subSubCategory: { select: { name: true } },
                branch: { select: { name: true } },
                employee: { select: { name: true } },
                user: { select: { name: true } },
                detail_report: true,
                detail_problem: true,
                detail_solution: true,
                finishedAt: true
            }
        })

        if(!problems) {
            return res.status(404).send({
                status: false,
                message: 'Problem Not Found',
            })
        }

        res.status(200).send({
            status: true,
            message: 'Get Problem By Id',
            data: problems
        })
    } catch (error) {
        
        res.status(500).send({
            status: false,
            message: 'Internal Server Error'
        })
    }
}

const createProblem = async (req, res) => {
    // Validasi input
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ status: false, errors: errors.array() });
    }

    try {
        const {
            categoryId,
            subCategoryId,
            subSubCategoryId,
            branchId,
            employeeId,
            userId,
            detail_report,
            detail_problem,
            detail_solution,
            reportedAt,
            finishedAt
        } = req.body;

        const reportedAtUTC = DateTime.fromISO(reportedAt, { zone: 'Asia/Jakarta' }).toUTC().toISO();
        const finishedAtUTC = DateTime.fromISO(finishedAt, { zone: 'Asia/Jakarta' }).toUTC().toISO();

        const newProblem = await prisma.problem.create({
            data: {
                categoryId,
                subCategoryId,
                subSubCategoryId,
                branchId,
                employeeId,
                userId,
                detail_report,
                detail_problem,
                detail_solution,
                reportedAt: reportedAtUTC,
                finishedAt: finishedAtUTC,
            }
        });

        res.status(201).send({
            status: true,
            message: 'Problem created successfully',
            data: newProblem
        });

    } catch (error) {
        console.error(error);
        res.status(500).send({
            status: false,
            message: 'Internal Server Error'
        });
    }
};


module.exports = {showProblem, showProblemById, createProblem}