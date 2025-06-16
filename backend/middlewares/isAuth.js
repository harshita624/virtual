import jwt from "jsonwebtoken"

const isAuth = async (req, res, next) => {
  try {
    const token = req.cookies?.token;

    if (!token) {
      return res.status(401).json({ message: "Not authenticated" });
    }

    const verifyToken = jwt.verify(
      token,
      process.env.JWT_SECRET
    );

    req.userId = verifyToken.userId;

    return next();

  } catch (error) {
    console.error(error);
    return res.status(401).json({ message: "Invalid or expired token" });
  }
};

export default isAuth;
