// Validation middleware for common inputs

const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

const validateLogin = (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({
      success: false,
      message: 'Email and password are required',
    });
  }

  if (!validateEmail(email)) {
    return res.status(400).json({
      success: false,
      message: 'Invalid email format',
    });
  }

  if (password.length < 6) {
    return res.status(400).json({
      success: false,
      message: 'Password must be at least 6 characters',
    });
  }

  next();
};

const validateProject = (req, res, next) => {
  const { name, dealAmount, progressPercent } = req.body;

  if (!name || name.trim().length === 0) {
    return res.status(400).json({
      success: false,
      message: 'Project name is required',
    });
  }

  if (name.length > 200) {
    return res.status(400).json({
      success: false,
      message: 'Project name must be less than 200 characters',
    });
  }

  if (dealAmount !== undefined) {
    if (typeof dealAmount !== 'number' || dealAmount < 0) {
      return res.status(400).json({
        success: false,
        message: 'Deal amount must be a positive number',
      });
    }
  }

  if (progressPercent !== undefined) {
    if (typeof progressPercent !== 'number' || progressPercent < 0 || progressPercent > 100) {
      return res.status(400).json({
        success: false,
        message: 'Progress percentage must be between 0 and 100',
      });
    }
  }

  next();
};

const validateWorkLog = (req, res, next) => {
  const { workDone, percentage } = req.body;

  if (!workDone || workDone.trim().length === 0) {
    return res.status(400).json({
      success: false,
      message: 'Work description is required',
    });
  }

  if (workDone.length > 1000) {
    return res.status(400).json({
      success: false,
      message: 'Work description must be less than 1000 characters',
    });
  }

  if (percentage !== undefined) {
    if (typeof percentage !== 'number' || percentage < 0 || percentage > 100) {
      return res.status(400).json({
        success: false,
        message: 'Percentage must be between 0 and 100',
      });
    }
  }

  next();
};

const validatePayment = (req, res, next) => {
  const { amount, type } = req.body;

  if (!amount || typeof amount !== 'number' || amount <= 0) {
    return res.status(400).json({
      success: false,
      message: 'Amount must be a positive number',
    });
  }

  if (!type || !['RECEIVED', 'PENDING'].includes(type)) {
    return res.status(400).json({
      success: false,
      message: 'Payment type must be RECEIVED or PENDING',
    });
  }

  next();
};

const validateUUID = (req, res, next) => {
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  
  const params = ['id', 'projectId', 'userId', 'employeeId'];
  for (const param of params) {
    if (req.params[param] && !uuidRegex.test(req.params[param])) {
      return res.status(400).json({
        success: false,
        message: `Invalid ${param} format`,
      });
    }
  }

  next();
};

module.exports = {
  validateLogin,
  validateProject,
  validateWorkLog,
  validatePayment,
  validateUUID,
  validateEmail,
};




