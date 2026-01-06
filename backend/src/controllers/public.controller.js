const prisma = require('../config/db');

// Get public project details (no auth required)
const getPublicProject = async (req, res) => {
  try {
    const { id } = req.params;

    const project = await prisma.project.findUnique({
      where: { id },
      select: {
        id: true,
        name: true,
        description: true,
        progressPercent: true,
        images: {
          orderBy: {
            createdAt: 'asc',
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
    console.error('Get public project error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch project',
    });
  }
};

// Get all public projects (for homepage)
const getPublicProjects = async (req, res) => {
  try {
    const projects = await prisma.project.findMany({
      where: {
        images: {
          some: {},
        },
      },
      select: {
        id: true,
        name: true,
        description: true,
        progressPercent: true,
        images: {
          take: 1, // Get first image as thumbnail
          orderBy: {
            createdAt: 'asc',
          },
        },
        _count: {
          select: {
            images: true,
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
    console.error('Get public projects error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch projects',
    });
  }
};

module.exports = {
  getPublicProject,
  getPublicProjects,
};

