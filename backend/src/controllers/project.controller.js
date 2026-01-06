const prisma = require('../config/db');

// Create project
const createProject = async (req, res) => {
  try {
    const { name, description, dealAmount, userId, employeeId } = req.body;
    const headId = req.user.userId;

    // Validation
    if (!name) {
      return res.status(400).json({
        success: false,
        message: 'Project name is required',
      });
    }

    // Create project
    const project = await prisma.project.create({
      data: {
        name,
        description: description || null,
        dealAmount: dealAmount || 0,
        receivedAmount: 0,
        progressPercent: 0,
        headId,
        userId: userId || null,
      },
      include: {
        head: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        user: userId ? {
          select: {
            id: true,
            name: true,
            email: true,
          },
        } : false,
      },
    });

    return res.status(201).json({
      success: true,
      message: 'Project created successfully',
      data: { project },
    });
  } catch (error) {
    console.error('Create project error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to create project',
    });
  }
};

// Get all projects (HEAD can see all)
const getAllProjects = async (req, res) => {
  try {
    const projects = await prisma.project.findMany({
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
        images: true,
        _count: {
          select: {
            workLogs: true,
            payments: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return res.status(200).json({
      success: true,
      data: { projects },
    });
  } catch (error) {
    console.error('Get all projects error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch projects',
    });
  }
};

// Get single project
const getProjectById = async (req, res) => {
  try {
    const { id } = req.params;

    const project = await prisma.project.findUnique({
      where: { id },
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
        images: true,
        workLogs: {
          include: {
            employee: {
              select: {
                id: true,
                name: true,
                email: true,
              },
            },
          },
          orderBy: {
            date: 'desc',
          },
        },
        payments: {
          orderBy: {
            date: 'desc',
          },
        },
      },
    });

    if (!project) {
      return res.status(404).json({
        success: false,
        message: 'Project not found',
      });
    }

    return res.status(200).json({
      success: true,
      data: { project },
    });
  } catch (error) {
    console.error('Get project error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch project',
    });
  }
};

// Assign project to USER
const assignProjectToUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { userId } = req.body;

    if (!userId) {
      return res.status(400).json({
        success: false,
        message: 'User ID is required',
      });
    }

    // Verify user exists and is USER role
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    if (user.role !== 'USER') {
      return res.status(400).json({
        success: false,
        message: 'Can only assign projects to users with USER role',
      });
    }

    const project = await prisma.project.update({
      where: { id },
      data: { userId },
      include: {
        user: {
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
      message: 'Project assigned to user successfully',
      data: { project },
    });
  } catch (error) {
    console.error('Assign project to user error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to assign project',
    });
  }
};

// Update project progress percentage
const updateProgress = async (req, res) => {
  try {
    const { id } = req.params;
    const { progressPercent } = req.body;

    if (progressPercent === undefined || progressPercent < 0 || progressPercent > 100) {
      return res.status(400).json({
        success: false,
        message: 'Progress percentage must be between 0 and 100',
      });
    }

    const project = await prisma.project.update({
      where: { id },
      data: { progressPercent },
    });

    return res.status(200).json({
      success: true,
      message: 'Project progress updated successfully',
      data: { project },
    });
  } catch (error) {
    console.error('Update progress error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to update progress',
    });
  }
};

// Update deal amount and received amount
const updateAmounts = async (req, res) => {
  try {
    const { id } = req.params;
    const { dealAmount, receivedAmount } = req.body;

    const updateData = {};
    if (dealAmount !== undefined) {
      if (dealAmount < 0) {
        return res.status(400).json({
          success: false,
          message: 'Deal amount cannot be negative',
        });
      }
      updateData.dealAmount = dealAmount;
    }

    if (receivedAmount !== undefined) {
      if (receivedAmount < 0) {
        return res.status(400).json({
          success: false,
          message: 'Received amount cannot be negative',
        });
      }
      updateData.receivedAmount = receivedAmount;
    }

    if (Object.keys(updateData).length === 0) {
      return res.status(400).json({
        success: false,
        message: 'At least one amount field is required',
      });
    }

    const project = await prisma.project.update({
      where: { id },
      data: updateData,
    });

    return res.status(200).json({
      success: true,
      message: 'Project amounts updated successfully',
      data: { project },
    });
  } catch (error) {
    console.error('Update amounts error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to update amounts',
    });
  }
};

// Update project details
const updateProject = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description } = req.body;

    if (!name || name.trim().length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Project name is required',
      });
    }

    const updateData = { name: name.trim() };
    if (description !== undefined) {
      updateData.description = description.trim() || null;
    }

    const project = await prisma.project.update({
      where: { id },
      data: updateData,
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
        images: true,
      },
    });

    return res.status(200).json({
      success: true,
      message: 'Project updated successfully',
      data: { project },
    });
  } catch (error) {
    console.error('Update project error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to update project',
    });
  }
};

// Delete project
const deleteProject = async (req, res) => {
  try {
    const { id } = req.params;

    await prisma.project.delete({
      where: { id },
    });

    return res.status(200).json({
      success: true,
      message: 'Project deleted successfully',
    });
  } catch (error) {
    console.error('Delete project error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to delete project',
    });
  }
};

module.exports = {
  createProject,
  getAllProjects,
  getProjectById,
  assignProjectToUser,
  updateProgress,
  updateAmounts,
  updateProject,
  deleteProject,
};


