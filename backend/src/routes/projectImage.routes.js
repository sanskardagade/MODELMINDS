const express = require('express');
const {
  uploadProjectImages,
  deleteProjectImage,
  getProjectImages,
} = require('../controllers/projectImage.controller');
const { authenticate } = require('../middlewares/auth.middleware');
const { authorize } = require('../middlewares/role.middleware');
const { uploadProjectImages: uploadMiddleware } = require('../middlewares/upload.middleware');

const router = express.Router();

// All routes require authentication
router.use(authenticate);

// Upload images (HEAD only)
router.post(
  '/:projectId/upload',
  authorize('HEAD'),
  uploadMiddleware,
  uploadProjectImages
);

// Delete image (HEAD only)
router.delete('/:id', authorize('HEAD'), deleteProjectImage);

// Get project images (all authenticated users)
router.get('/:projectId', getProjectImages);

module.exports = router;


