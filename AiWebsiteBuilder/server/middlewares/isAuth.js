import jwt from "jsonwebtoken";
import User from "../models/user.model.js";

const isAuth = async (req, res, next) => {
  try {
    const token = req.cookies.token;
    if (!token) {
      return res.status(400).json({ message: "token not found " });
    }
    const decodedToken = jwt.verify(token, process.env.JWT_SECERET);
    req.user = await User.findById(decodedToken.id);
    next();
  } catch (err) {
    return res.status(400).json({ message: "Invalid token " });
  }
};

export default isAuth;
