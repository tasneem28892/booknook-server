import { Request, Response, NextFunction } from "express";
import { createRemoteJWKSet, jwtVerify } from "jose";

const JWKS = createRemoteJWKSet(
  new URL("http://localhost:3000/api/auth/jwks")
);

// Add user information to Express Request
declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string;
        email: string;
      };
    }
  }
}

export const verifyToken = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized access",
      });
    }

    const token = authHeader.split(" ")[1];

    const { payload } = await jwtVerify(token, JWKS);

    if (
      typeof payload.id !== "string" ||
      typeof payload.email !== "string"
    ) {
      return res.status(401).json({
        success: false,
        message: "Invalid token payload",
      });
    }

    // Store verified user information
    req.user = {
      id: payload.id,
      email: payload.email,
    };

    next();
  } catch (error) {
    console.error("JWT verification failed:", error);

    return res.status(401).json({
      success: false,
      message: "Invalid or expired token",
    });
  }
};