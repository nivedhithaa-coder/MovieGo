// server/routes/userRoutes.js
import express from 'express';
import { clerkClient } from '@clerk/express';
import { requireAuth } from '@clerk/express';

const router = express.Router();

// requires user to be logged in
router.post('/set-role', requireAuth(), async (req, res) => {
  try {
    const { role } = req.body;
    const userId = req.auth.userId;

    await clerkClient.users.updateUser(userId, {
      privateMetadata: { role },
    });

    res.json({ success: true, message: 'Role updated successfully', role });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

export default router;
