const prisma = require('../config/db');

// Get all public gallery images (no auth required)
const getPublicGallery = async (req, res) => {
  try {
    // Get all project images (public gallery)
    const images = await prisma.projectImage.findMany({
      orderBy: {
        createdAt: 'desc',
      },
      take: 50, // Limit to 50 most recent images
    });

    return res.status(200).json({
      success: true,
      data: {
        images,
        count: images.length,
      },
    });
  } catch (error) {
    console.error('Get gallery error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch gallery images',
    });
  }
};

module.exports = {
  getPublicGallery,
};

