
export function validate(schema, source = "body") {
    return (req, res, next) => {
        const result = schema.safeParse(req[source]);
  
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
  
        req[source === "query" ? "validatedQuery" : "validatedBody"] = result.data;
      next();
    };
  }
  