
export function validate(schema) {
    return (req, res, next) => {
      const result = schema.safeParse(req.body);
  
      if (!result.success) {
        return res.status(422).json({
          success: false,
          message: "Error de validación",
          errors: result.error.issues.map(issue => ({
            field: issue.path.join("."),
            message: issue.message
          }))
        });
      }
  
      req.validatedBody = result.data;
      next();
    };
  }
  