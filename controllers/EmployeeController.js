const express = require('express')
const prisma = require('../prisma/client')
const {validationResult} = require('express-validator')

const showEmployee = async (req, res) => {
    try {
        const employees = await prisma.employee.findMany({
            include: {
                branch: true,
                division: true,
                department: true,
            }
        })

        res.status(200).send({
            status: true,
            message: 'Get All Employee Successfully',
            data: employees,
        })
    } catch (error) {
        res.status(500).send({
            status: false,
            message: 'Internal Server Error'
        })
    }
}

const getEmployeeByDepartmentId = async (req, res) => {
    
    const { department } = req.query;
    
    try {
        console.log("Department ID received:", department);  // Debugging

        const employees = await prisma.employee.findMany({
            where: {
                departmentId: Number(department) // Gunakan "branchId", bukan "branch"
            }
        });

        console.log("Employees fetched:", employees);  // Debugging

        res.status(200).send({
            success: true,
            message: "Get Employee By Department",
            data: employees
        });
    } catch (error) {
        console.error("Error fetching employees:", error); // Debugging
        res.status(500).send({
            success: false,
            message: "Internal Server Error",
            error: error.message // Tambahkan untuk melihat detail error
        });
    }
}

const searchEmployee = async(req, res) => {
    const {query} = req.query
    if(!query) {
        return res.status(400).json({
            status: false,
            message: 'Query parameter required'
        })
    }

    try{
        const employees = await prisma.employee.findMany({
            where: {
                OR: [
                    {name: {contains: query.toLowerCase()}},
                    {branch: {
                        code: {contains: query.toLowerCase()}
                    }},
                ],
            },
            include: {
                branch: true,
                division: true,
                department: true,
            },
            orderBy: {
                id: 'desc'
            },
        })

        res.status(200).send({
            status: true,
            message: 'Search Result',
            data: employees
        })
    } catch(error) {
        console.error(error)
        res.status(500).send({
            status: false,
            message: 'Internal Server Error'
        })
    }
}

const createEmployee = async (req, res) => {
    const errors = validationResult(req)
    if(!errors.isEmpty()) {
        return res.status(422).json({
            success: false,
            message: 'Validation Error',
            errors: errors.array(),
        })
    }

    try {
        const {name, branchId, divisionId, departmentId} = req.body
        const employee = await prisma.employee.create({
            data: {
                name,
                branchId,
                divisionId: divisionId ? parseInt(divisionId) : null,
                departmentId: departmentId ? parseInt(departmentId) : null,
            },
            include: {
                branch: true,
                division: true,
                department: true
            },
        })

        res.status(200).send({
            status: true,
            message: 'New Employee Created',
            data: employee,
        })
    } catch (error) {
        console.log(error)
        res.status(500).send({
            status: false,
            message: 'Internal Server Error'
        })
    }
}

const updateEmployee = async (req, res) => {
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
        const {name, branchId} = req.body

        const existingEmployee = await prisma.employee.findUnique({
            where: {
                id: Number(id)
            },
        })

        if(!existingEmployee) {
            return res.status(404).json({
                status: false,
                message: 'Employee Not Found'
            })
        }

        const employee = await prisma.employee.update({
            where: {
                id: Number(id)
            },
            data: {
                name,
                branchId
            },
            include: {
                branch: true
            }
        })
        
        res.status(200).send({
            status: true,
            message: 'Employee update successfully',
            data: employee
        })
    } catch (error) {
        res.status(500).send({
            status: false,
            message: 'Internal Server Error'
        })
    }
}

const deleteEmployee = async (req, res) => {
    const {id} = req.params
    try {
        const existingEmployee = await prisma.employee.findUnique({
            where: {
                id: Number(id)
            }
        })

        if(!existingEmployee) {
            res.status(404).json({
                success: false,
                message: 'Employee Not Found'
            })
        }

        await prisma.employee.delete({
            where: {
                id: Number(id)
            }
        })
        res.status(200).send({
            status: true,
            message: 'Employee deleted successfully'
        })
    } catch (error) {
        res.status(500).send({
            status: false,
            message: 'Internal Server Error'
        })
    }
}

module.exports = {showEmployee, createEmployee, updateEmployee, deleteEmployee, searchEmployee, getEmployeeByDepartmentId}