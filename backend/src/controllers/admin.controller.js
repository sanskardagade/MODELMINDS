const prisma = require('../config/db');

// Get all employees
const getAllEmployees = async (req, res) => {
  try {
    const employees = await prisma.user.findMany({
      where: {
        role: 'EMPLOYEE',
      },
      select: {
        id: true,
        name: true,
        email: true,
        createdAt: true,
      },
      orderBy: {
        name: 'asc',
      },
    });

    // Get project count for each employee
    const employeesWithProjects = await Promise.all(
      employees.map(async (employee) => {
        const projectCount = await prisma.dailyWorkLog.findMany({
          where: {
            employeeId: employee.id,
          },
          distinct: ['projectId'],
        });

        return {
          ...employee,
          projectCount: projectCount.length,
        };
      })
    );

    return res.status(200).json({
      success: true,
      data: {
        employees: employeesWithProjects,
      },
    });
  } catch (error) {
    console.error('Get employees error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch employees',
    });
  }
};

module.exports = {
  getAllEmployees,
};

