const prisma = require('../config/db');
const { hashPassword } = require('../utils/bcrypt');

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

// Get all clients (USER role)
const getAllClients = async (req, res) => {
  try {
    const clients = await prisma.user.findMany({
      where: {
        role: 'USER',
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

    // Get project count for each client
    const clientsWithProjects = await Promise.all(
      clients.map(async (client) => {
        const projectCount = await prisma.project.count({
          where: {
            userId: client.id,
          },
        });

        return {
          ...client,
          projectCount,
        };
      })
    );

    return res.status(200).json({
      success: true,
      data: {
        clients: clientsWithProjects,
      },
    });
  } catch (error) {
    console.error('Get clients error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch clients',
    });
  }
};

// Get all employee work logs (feedback)
const getAllEmployeeWorkLogs = async (req, res) => {
  try {
    const workLogs = await prisma.dailyWorkLog.findMany({
      include: {
        employee: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        project: {
          select: {
            id: true,
            name: true,
            progressPercent: true,
          },
        },
      },
      orderBy: {
        date: 'desc',
      },
    });

    return res.status(200).json({
      success: true,
      data: { workLogs },
    });
  } catch (error) {
    console.error('Get employee work logs error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch employee work logs',
    });
  }
};

// Assign project to employee (admin function)
const assignProjectToEmployee = async (req, res) => {
  try {
    const { employeeId, projectId, taskDescription } = req.body;

    if (!employeeId || !projectId) {
      return res.status(400).json({
        success: false,
        message: 'Employee ID and Project ID are required',
      });
    }

    if (!taskDescription || !taskDescription.trim()) {
      return res.status(400).json({
        success: false,
        message: 'Task description is required',
      });
    }

    // Verify employee exists and is EMPLOYEE role
    const employee = await prisma.user.findUnique({
      where: { id: employeeId },
    });

    if (!employee) {
      return res.status(404).json({
        success: false,
        message: 'Employee not found',
      });
    }

    if (employee.role !== 'EMPLOYEE') {
      return res.status(400).json({
        success: false,
        message: 'User is not an employee',
      });
    }

    // Verify project exists
    const project = await prisma.project.findUnique({
      where: { id: projectId },
    });

    if (!project) {
      return res.status(404).json({
        success: false,
        message: 'Project not found',
      });
    }

    // Check if assignment already exists (check for any work log with this employee and project)
    const existingLog = await prisma.dailyWorkLog.findFirst({
      where: {
        employeeId,
        projectId,
      },
      orderBy: {
        date: 'desc',
      },
    });

    // Only warn if there's a recent assignment, but still allow creating new tasks
    // We'll allow multiple tasks for the same project-employee combination

    // Create work log entry to assign the project with task description
    const workLog = await prisma.dailyWorkLog.create({
      data: {
        projectId,
        employeeId,
        workDone: taskDescription.trim(),
        percentage: 0,
        date: new Date(),
      },
      include: {
        employee: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        project: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    return res.status(201).json({
      success: true,
      message: 'Task assigned to employee successfully',
      data: { workLog },
    });
  } catch (error) {
    console.error('Assign project to employee error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to assign project',
    });
  }
};

// Create a new employee
const createEmployee = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Validation
    if (!name || !name.trim()) {
      return res.status(400).json({
        success: false,
        message: 'Name is required',
      });
    }

    if (!email || !email.trim()) {
      return res.status(400).json({
        success: false,
        message: 'Email is required',
      });
    }

    if (!password || password.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'Password is required and must be at least 6 characters',
      });
    }

    // Check if email already exists
    const existingUser = await prisma.user.findUnique({
      where: { email: email.trim().toLowerCase() },
    });

    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: 'Email already exists',
      });
    }

    // Hash password
    const hashedPassword = await hashPassword(password);

    // Create employee
    const employee = await prisma.user.create({
      data: {
        name: name.trim(),
        email: email.trim().toLowerCase(),
        password: hashedPassword,
        role: 'EMPLOYEE',
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
      },
    });

    return res.status(201).json({
      success: true,
      message: 'Employee created successfully',
      data: { employee },
    });
  } catch (error) {
    console.error('Create employee error:', error);
    if (error.code === 'P2002') {
      return res.status(409).json({
        success: false,
        message: 'Email already exists',
      });
    }
    return res.status(500).json({
      success: false,
      message: 'Failed to create employee',
    });
  }
};

// Create a new client
const createClient = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Validation
    if (!name || !name.trim()) {
      return res.status(400).json({
        success: false,
        message: 'Name is required',
      });
    }

    if (!email || !email.trim()) {
      return res.status(400).json({
        success: false,
        message: 'Email is required',
      });
    }

    if (!password || password.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'Password is required and must be at least 6 characters',
      });
    }

    // Check if email already exists
    const existingUser = await prisma.user.findUnique({
      where: { email: email.trim().toLowerCase() },
    });

    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: 'Email already exists',
      });
    }

    // Hash password
    const hashedPassword = await hashPassword(password);

    // Create client
    const client = await prisma.user.create({
      data: {
        name: name.trim(),
        email: email.trim().toLowerCase(),
        password: hashedPassword,
        role: 'USER',
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
      },
    });

    return res.status(201).json({
      success: true,
      message: 'Client created successfully',
      data: { client },
    });
  } catch (error) {
    console.error('Create client error:', error);
    if (error.code === 'P2002') {
      return res.status(409).json({
        success: false,
        message: 'Email already exists',
      });
    }
    return res.status(500).json({
      success: false,
      message: 'Failed to create client',
    });
  }
};

module.exports = {
  getAllEmployees,
  getAllClients,
  getAllEmployeeWorkLogs,
  assignProjectToEmployee,
  createEmployee,
  createClient,
};
