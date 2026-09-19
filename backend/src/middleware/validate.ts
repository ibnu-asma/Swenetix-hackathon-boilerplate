import { Request, Response, NextFunction } from "express";
import { ZodType, ZodError } from "zod";

export const validate =
  (schema: ZodType) =>
  (req: Request, res: Response, next: NextFunction): void | Response => {
    try {
      // Safely parse the request body.
      // If your schema expects { body: { ... } }, we pass an object containing body.
      // Otherwise, it falls back to parsing req.body directly.
      if ("shape" in schema && (schema as any).shape.body) {
        schema.parse({ body: req.body, query: req.query, params: req.params });
      } else {
        schema.parse(req.body);
      }

      return next(); // Explicitly return next() execution context
    } catch (error) {
      if (error instanceof ZodError) {
        console.log(
          "❌ Zod Validation Issues:",
          JSON.stringify(error.issues, null, 2),
        );

        // Return the response immediately back to Swagger
        return res.status(400).json({
          success: false,
          message: "Validation failed",
          errors: error.issues.map((issue) => ({
            // Fallback to 'field' if path is empty
            field:
              issue.path.length > 0
                ? issue.path.join(".").replace("body.", "")
                : "form",
            message: issue.message,
          })),
        });
      }

      return res
        .status(500)
        .json({ success: false, message: "Internal server error" });
    }
  };
