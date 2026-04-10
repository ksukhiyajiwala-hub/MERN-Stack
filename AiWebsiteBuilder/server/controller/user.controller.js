export const getCurrentUser = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(400).json({ message: "User not found" });
    }
    return res.status(200).json(req.user);
  } catch (err) {
    return res.status(500).json({ message: `User not found ${err}` });
  }
};
