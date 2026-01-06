const prisma = require('../config/db');

// Get assigned projects for user
const getAssignedProjects = async (req, res) => {
  try {
    const userId = req.user.userId;

    const projects = await prisma.project.findMany({
      where: { userId },
      include: {
        head: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        images: {
          orderBy: {
            createdAt: 'asc',
          },
        },
        payments: {
          orderBy: {
            date: 'desc',
          },
        },
        _count: {
          select: {
            workLogs: true,
            images: true,
            payments: true,
          },
        },
      },
      orderBy: {
        updatedAt: 'desc',
      },
    });

    // Calculate pending amount for each project
    const projectsWithPending = projects.map((project) => {
      const pendingAmount = project.dealAmount - project.receivedAmount;
      return {
        ...project,
        pendingAmount,
      };
    });

    return res.status(200).json({
      success: true,
      data: { projects: projectsWithPending },
    });
  } catch (error) {
    console.error('Get assigned projects error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch assigned projects',
    });
  }
};

// Get single project details
const getProjectDetails = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.userId;

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
        images: {
          orderBy: {
            createdAt: 'asc',
          },
        },
        payments: {
          orderBy: {
            date: 'desc',
          },
        },
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
      },
    });

    if (!project) {
      return res.status(404).json({
        success: false,
        message: 'Project not found',
      });
    }

    // Verify project belongs to user
    if (project.userId !== userId) {
      return res.status(403).json({
        success: false,
        message: 'Access denied. This project is not assigned to you.',
      });
    }

    const pendingAmount = project.dealAmount - project.receivedAmount;

    return res.status(200).json({
      success: true,
      data: {
        project: {
          ...project,
          pendingAmount,
        },
      },
    });
  } catch (error) {
    console.error('Get project details error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch project details',
    });
  }
};

// Get project progress
const getProjectProgress = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.userId;

    const project = await prisma.project.findUnique({
      where: { id },
      select: {
        id: true,
        name: true,
        progressPercent: true,
        dealAmount: true,
        receivedAmount: true,
        workLogs: {
          select: {
            id: true,
            workDone: true,
            percentage: true,
            date: true,
            employee: {
              select: {
                name: true,
              },
            },
          },
          orderBy: {
            date: 'desc',
          },
          take: 10,
        },
      },
    });

    if (!project) {
      return res.status(404).json({
        success: false,
        message: 'Project not found',
      });
    }

    // Verify project belongs to user
    const fullProject = await prisma.project.findUnique({
      where: { id },
      select: { userId: true },
    });

    if (fullProject.userId !== userId) {
      return res.status(403).json({
        success: false,
        message: 'Access denied',
      });
    }

    const pendingAmount = project.dealAmount - project.receivedAmount;

    return res.status(200).json({
      success: true,
      data: {
        project: {
          ...project,
          pendingAmount,
        },
      },
    });
  } catch (error) {
    console.error('Get project progress error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch project progress',
    });
  }
};

// Get project images
const getProjectImages = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.userId;

    // Verify project belongs to user
    const project = await prisma.project.findUnique({
      where: { id },
      select: { userId: true },
    });

    if (!project) {
      return res.status(404).json({
        success: false,
        message: 'Project not found',
      });
    }

    if (project.userId !== userId) {
      return res.status(403).json({
        success: false,
        message: 'Access denied',
      });
    }

    const images = await prisma.projectImage.findMany({
      where: { projectId: id },
      orderBy: {
        createdAt: 'asc',
      },
    });

    return res.status(200).json({
      success: true,
      data: {
        images,
        count: images.length,
      },
    });
  } catch (error) {
    console.error('Get project images error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch images',
    });
  }
};

// Get payment status
const getPaymentStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.userId;

    // Verify project belongs to user
    const project = await prisma.project.findUnique({
      where: { id },
      select: {
        id: true,
        name: true,
        userId: true,
        dealAmount: true,
        receivedAmount: true,
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

    if (project.userId !== userId) {
      return res.status(403).json({
        success: false,
        message: 'Access denied',
      });
    }

    const pendingAmount = project.dealAmount - project.receivedAmount;

    return res.status(200).json({
      success: true,
      data: {
        project: {
          id: project.id,
          name: project.name,
          dealAmount: project.dealAmount,
          receivedAmount: project.receivedAmount,
          pendingAmount,
          payments: project.payments,
        },
      },
    });
  } catch (error) {
    console.error('Get payment status error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch payment status',
    });
  }
};

module.exports = {
  getAssignedProjects,
  getProjectDetails,
  getProjectProgress,
  getProjectImages,
  getPaymentStatus,
};


