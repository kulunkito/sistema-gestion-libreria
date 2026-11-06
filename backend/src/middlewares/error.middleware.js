
export function notFound(req, res) {
    res.status(404).json({
      success: false,
      message: `Ruta no encontrada: ${req.method} ${req.originalUrl}`
    });
  }
  
  export function errorHandler(error, req, res, next) {
    console.error(error);
  
    if (res.headersSent) return next(error);
  
    const status = error.status || 500;
  
    res.status(status).json({
      success: false,
      message: status === 500
        ? "Error interno del servidor"
        : error.message
    });
  }
  