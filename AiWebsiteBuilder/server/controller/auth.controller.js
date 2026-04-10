import User from "../models/user.model.js";
import jwt from "jsonwebtoken";

export const googleAuth = async (req, res) => {
  try {
    const { name, email, avatar } = req.body;
    if (!email) {
      return res.status(400).json({
        message: "email is required",
      });
    }
    let user = await User.findOne({ email });
    if (!user) {
      user = await User.create({ name, email, avatar });
      console.log(user);
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECERET, {
      expiresIn: "7d",
    });
    console.log(token);

    return res
      .cookie("token", token, {
        httpOnly: true,
        secure: true,
        sameSite: "none",
        maxAge: 7 * 24 * 60 * 60 * 1000,
      })
      .status(200)
      .json(user);
  } catch (err) {
    return res.status(500).json({
      message: `google auth error ${err}`,
    });
  }
};

export const logout = async (req, res) => {
  try {
    return res
      .clearCookie("token", {
        httpOnly: true,
        secure: true,
        sameSite: "none",
      })
      .status(200)
      .json({ message: "Logged out successfully" });
  } catch (err) {
    return res.status(500).json({
      message: `Log out error ${err}`,
    });
  }
};
