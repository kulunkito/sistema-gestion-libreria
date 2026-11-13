
export function notFound(req, res) {
    res.status(404).json({
      success: false,
      message: `Ruta no encontrada: ${req.method} ${req.originalUrl}`
    });
  }
  
  export function errorHandler(error, req, res, next) {
    console.error(error);
  
    if (res.headersSent) return next(error);
  
    const databaseErrorMessages = {
      SequelizeUniqueConstraintError: [409, "Ya existe un registro con esos datos"],
      SequelizeValidationError: [422, "Los datos no son válidos"],
      SequelizeForeignKeyConstraintError: [409, "No se puede completar la operación por relaciones existentes"]
    };
    const databaseError = databaseErrorMessages[error.name];
    const status = error.status || databaseError?.[0] || 500;
    const message = status === 500
      ? "Error interno del servidor"
      : databaseError?.[1] || error.message;
  
    res.status(status).json({
      success: false,
      message
    });
  }
  