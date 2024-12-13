import { Request, Response, NextFunction } from 'express';
import jwt, { JwtPayload } from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'Carmine_1';

// Extend the Request interface to include the 'user' property for type safety
declare module 'express-serve-static-core' {
  interface Request {
    user?: JwtPayload;
  }
}

// Define the authenticateToken middleware
async function authenticateToken(req: Request, res: Response, next: NextFunction) {
  // Check if the authorization header exists
  const authHeader = req.headers['authorization'];
  if (!authHeader) {
    return res.status(401).json({ message: 'Unauthorized: No token provided' });
  }

  // Extract the token from the Authorization header (e.g., "Bearer <token>")
  const token = authHeader.split(' ')[1];
  if (!token) {
    return res.status(401).json({ message: 'Unauthorized: Token missing' });
  }

  // Verify the token
  try {
    // Use async/await with jwt.verify for better readability
    const decoded = await new Promise<JwtPayload>((resolve, reject) => {
      jwt.verify(token, JWT_SECRET, (err, user) => {
        if (err) {
          reject(new Error('Forbidden: Invalid token'));
        } else {
          resolve(user as JwtPayload);
        }
      });
    });

    // Attach the user object (decoded JWT payload) to the request
    req.user = decoded;

    // Move to the next middleware/handler
    next();
  } catch (error: unknown) {
    // Check if the error is an instance of Error
    if (error instanceof Error) {
      // Send appropriate error response if token verification fails
      return res.status(403).json({ message: error.message });
    }
    // In case of a non-Error object, provide a generic error message
    return res.status(500).json({ message: 'Internal server error' });
  }
}

export default authenticateToken;
