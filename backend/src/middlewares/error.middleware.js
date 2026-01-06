const errorHandler = (err, req, res, next) => {
  // Log error for debugging
  console.error('Error:', {
    message: err.message,
    stack: process.env.NODE_ENV === 'development' ? err.stack : undefined,
    code: err.code,
    name: err.name,
  });

  // Prisma errors
  if (err.code === 'P2002') {
    return res.status(409).json({
      success: false,
      message: 'Duplicate entry. This record already exists.',
    });
  }

  if (err.code === 'P2025') {
    return res.status(404).json({
      success: false,
      message: 'Record not found',
    });
  }

  if (err.code === 'P2003') {
    return res.status(400).json({
      success: false,
      message: 'Invalid reference. Related record does not exist.',
    });
  }

  if (err.code === 'P1001') {
    return res.status(503).json({
      success: false,
      message: 'Database connection error. Please check your database configuration and ensure the database server is running.',
    });
  }

  // Validation errors
  if (err.name === 'ValidationError' || err.name === 'MulterError') {
    return res.status(400).json({
      success: false,
      message: err.message || 'Validation error',
    });
  }

  // JWT errors
  if (err.name === 'JsonWebTokenError') {
    return res.status(401).json({
      success: false,
      message: 'Invalid token. Please login again.',
    });
  }

  if (err.name === 'TokenExpiredError') {
    return res.status(401).json({
      success: false,
      message: 'Token expired. Please login again.',
    });
  }

  // Cast errors (invalid ID format)
  if (err.name === 'CastError') {
    return res.status(400).json({
      success: false,
      message: 'Invalid ID format',
    });
  }

  // Default error - don't expose internal errors in production
  const message = process.env.NODE_ENV === 'development' 
    ? err.message 
    : 'Internal server error';

  return res.status(err.status || 500).json({
    success: false,
    message,
  });
};

module.exports = errorHandler;

