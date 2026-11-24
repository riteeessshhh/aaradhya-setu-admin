// Global error handler — catches unhandled errors from route handlers
function errorHandler(err, req, res, next) {
  console.error('❌ Unhandled Error:', err);
  res.status(500).json({
    success: false,
    message: err.message || 'Internal server error',
  });
}

module.exports = errorHandler;
