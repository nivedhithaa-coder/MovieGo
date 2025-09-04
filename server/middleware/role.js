import { clerkClient } from "@clerk/express";

app.post("/api/auth/set-role", async (req, res) => {
  try {
    const { userId, role } = req.body;
    await clerkClient.users.updateUser(userId, {
      privateMetadata: { role },
    });
    res.json({ success: true, message: "Role set successfully" });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
});
// GET /api/auth/role
app.get("/api/auth/role", async (req, res) => {
    try {
      const userId = req.auth().userId;
      const user = await User.findById(userId);
      res.json({ success: true, role: user.role || null });
    } catch (err) {
      res.status(500).json({ success: false, message: err.message });
    }
  });
  