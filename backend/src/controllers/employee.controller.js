const prisma = require('../config/db');

// Get assigned projects for employee
const getAssignedProjects = async (req, res) => {
  try {
    const employeeId = req.user.userId;

    // Get projects where employee has work logs
    const projects = await prisma.project.findMany({
      where: {
        workLogs: {
          some: {
            employeeId,
          },
        },
      },
      include: {
        head: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        images: {
          take: 1, // Get first image as thumbnail
        },
        workLogs: {
          where: {
            employeeId,
          },
          orderBy: {
            date: 'desc',
          },
          take: 5, // Get last 5 work logs
        },
        _count: {
          select: {
            workLogs: true,
          },
        },
      },
      orderBy: {
        updatedAt: 'desc',
      },
    });

    return res.status(200).json({
      success: true,
      data: { projects },
    });
  } catch (error) {
    console.error('Get assigned projects error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch assigned projects',
    });
  }
};

// Add daily work log
const addWorkLog = async (req, res) => {
  try {
    const { projectId, workDone, percentage } = req.body;
    const employeeId = req.user.userId;

    // Validation
    if (!projectId || !workDone) {
      return res.status(400).json({
        success: false,
        message: 'Project ID and work done description are required',
      });
    }

    if (percentage !== undefined && (percentage < 0 || percentage > 100)) {
      return res.status(400).json({
        success: false,
        message: 'Percentage must be between 0 and 100',
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

    // Create work log
    const workLog = await prisma.dailyWorkLog.create({
      data: {
        projectId,
        employeeId,
        workDone,
        percentage: percentage || 0,
        date: new Date(),
      },
      include: {
        project: {
          select: {
            id: true,
            name: true,
          },
        },
        employee: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    return res.status(201).json({
      success: true,
      message: 'Work log added successfully',
      data: { workLog },
    });
  } catch (error) {
    console.error('Add work log error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to add work log',
    });
  }
};

// Update work log
const updateWorkLog = async (req, res) => {
  try {
    const { id } = req.params;
    const { workDone, percentage } = req.body;
    const employeeId = req.user.userId;

    // Verify work log exists and belongs to employee
    const workLog = await prisma.dailyWorkLog.findUnique({
      where: { id },
    });

    if (!workLog) {
      return res.status(404).json({
        success: false,
        message: 'Work log not found',
      });
    }

    if (workLog.employeeId !== employeeId) {
      return res.status(403).json({
        success: false,
        message: 'You can only update your own work logs',
      });
    }

    const updateData = {};
    if (workDone !== undefined) updateData.workDone = workDone;
    if (percentage !== undefined) {
      if (percentage < 0 || percentage > 100) {
        return res.status(400).json({
          success: false,
          message: 'Percentage must be between 0 and 100',
        });
      }
      updateData.percentage = percentage;
    }

    const updatedWorkLog = await prisma.dailyWorkLog.update({
      where: { id },
      data: updateData,
      include: {
        project: {
          select: {
            id: true,
            name: true,
          },
        },
        employee: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    return res.status(200).json({
      success: true,
      message: 'Work log updated successfully',
      data: { workLog: updatedWorkLog },
    });
  } catch (error) {
    console.error('Update work log error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to update work log',
    });
  }
};

// Get work logs for a project
const getProjectWorkLogs = async (req, res) => {
  try {
    const { projectId } = req.params;
    const employeeId = req.user.userId;

    const workLogs = await prisma.dailyWorkLog.findMany({
      where: {
        projectId,
        employeeId,
      },
      include: {
        project: {
          select: {
            id: true,
            name: true,
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
    console.error('Get work logs error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch work logs',
    });
  }
};

// Get all work logs by employee
const getMyWorkLogs = async (req, res) => {
  try {
    const employeeId = req.user.userId;

    const workLogs = await prisma.dailyWorkLog.findMany({
      where: {
        employeeId,
      },
      include: {
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
    console.error('Get my work logs error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch work logs',
    });
  }
};

module.exports = {
  getAssignedProjects,
  addWorkLog,
  updateWorkLog,
  getProjectWorkLogs,
  getMyWorkLogs,
};



