const prisma = require('../config/db');
const { uploadToCloudinary, deleteFromCloudinary } = require('../config/cloudinary');

// Upload images to project
const uploadProjectImages = async (req, res) => {
  try {
    const { projectId } = req.params;

    if (!req.files || req.files.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'No images provided',
      });
    }

    if (req.files.length < 6 || req.files.length > 10) {
      return res.status(400).json({
        success: false,
        message: 'Please upload between 6 and 10 images',
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

    // Upload images to Cloudinary
    const uploadPromises = req.files.map((file) =>
      uploadToCloudinary(file.buffer, `projects/${projectId}`)
    );

    const uploadResults = await Promise.all(uploadPromises);

    // Save image URLs to database
    const projectImages = await Promise.all(
      uploadResults.map(({ imageUrl, publicId }) =>
        prisma.projectImage.create({
          data: {
            imageUrl,
            publicId,
            projectId,
          },
        })
      )
    );

    return res.status(201).json({
      success: true,
      message: 'Images uploaded successfully',
      data: {
        images: projectImages,
        count: projectImages.length,
      },
    });
  } catch (error) {
    console.error('Upload images error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to upload images',
    });
  }
};

// Delete project image
const deleteProjectImage = async (req, res) => {
  try {
    const { id } = req.params;

    const image = await prisma.projectImage.findUnique({
      where: { id },
    });

    if (!image) {
      return res.status(404).json({
        success: false,
        message: 'Image not found',
      });
    }

    // Delete from Cloudinary
    await deleteFromCloudinary(image.publicId);

    // Delete from database
    await prisma.projectImage.delete({
      where: { id },
    });

    return res.status(200).json({
      success: true,
      message: 'Image deleted successfully',
    });
  } catch (error) {
    console.error('Delete image error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to delete image',
    });
  }
};

// Get all images for a project
const getProjectImages = async (req, res) => {
  try {
    const { projectId } = req.params;

    const images = await prisma.projectImage.findMany({
      where: { projectId },
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

module.exports = {
  uploadProjectImages,
  deleteProjectImage,
  getProjectImages,
};


