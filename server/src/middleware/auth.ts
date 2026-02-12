import { CognitoJwtVerifier } from "aws-jwt-verify";
import { Request, Response, NextFunction } from "express";

let verifier: ReturnType<typeof CognitoJwtVerifier.create>;

function getVerifier() {
  if (!verifier) {
    verifier = CognitoJwtVerifier.create({
      userPoolId: process.env.COGNITO_USER_POOL_ID!,
      clientId: process.env.COGNITO_CLIENT_ID!,
      tokenUse: "id",
    });
  }
  return verifier;
}

export async function requireAuth(req: Request, res: Response, next: NextFunction) {
  const token = req.headers.authorization?.replace("Bearer ", "");

  if (!token) {
    res.status(401).json({ error: "No token provided" });
    return;
  }

  try {
    const payload = await getVerifier().verify(token);
    (req as any).user = payload;
    next();
  } catch {
    res.status(401).json({ error: "Invalid token" });
  }
}
