const express = require('express');
const {
  uploadPublicImages,
  uploadProjectImages,
  deleteProjectImage,
  getProjectImages,
  getAllImages,
} = require('../controllers/projectImage.controller');
const { authenticate } = require('../middlewares/auth.middleware');
const { authorize } = require('../middlewares/role.middleware');
const { uploadProjectImages: uploadMiddleware } = require('../middlewares/upload.middleware');
const { validateUUID } = require('../middlewares/validation.middleware');

const router = express.Router();

// Upload public gallery images (HEAD only, no project required)
router.post(
  '/upload',
  authenticate,
  authorize('HEAD'),
  uploadMiddleware,
  uploadPublicImages
);

// Get all images (HEAD only, for admin dashboard)
router.get('/', authenticate, authorize('HEAD'), getAllImages);

// All other routes require authentication
router.use(authenticate);

// Upload images to specific project (HEAD only)
router.post(
  '/:projectId/upload',
  validateUUID,
  authorize('HEAD'),
  uploadMiddleware,
  uploadProjectImages
);

// Delete image (HEAD only)
router.delete('/:id', validateUUID, authorize('HEAD'), deleteProjectImage);

// Get project images (public - no auth required for viewing)
router.get('/:projectId', validateUUID, getProjectImages);

module.exports = router;

