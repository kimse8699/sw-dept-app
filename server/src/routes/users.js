const express = require("express");
const router = express.Router();
const { User } = require("../models");
const { verifyToken, verifyAdmin } = require("../middleware/auth");

// GET /api/users/me - 내 프로필 조회
router.get("/me", verifyToken, async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id, {
      attributes: { exclude: ["password"] },
    });
    if (!user) return res.status(404).json({ error: "유저를 찾을 수 없습니다." });
    res.json(user);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// PATCH /api/users/me - 내 프로필 수정
router.patch("/me", verifyToken, async (req, res) => {
  const { name, email } = req.body;
  try {
    const user = await User.findByPk(req.user.id);
    if (!user) return res.status(404).json({ error: "유저를 찾을 수 없습니다." });
    if (name) user.name = name;
    if (email) user.email = email;
    await user.save();
    res.json({ success: true });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// GET /api/users - 전체 유저 목록 (관리자 전용)
router.get("/", verifyToken, verifyAdmin, async (req, res) => {
  try {
    const users = await User.findAll({
      attributes: { exclude: ["password"] },
      order: [["createdAt", "DESC"]],
    });
    res.json(users);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// PATCH /api/users/:id/admin - 관리자 권한 부여/해제 (관리자 전용)
router.patch("/:id/admin", verifyToken, verifyAdmin, async (req, res) => {
  const { isAdmin } = req.body;
  try {
    const user = await User.findByPk(req.params.id);
    if (!user) return res.status(404).json({ error: "유저를 찾을 수 없습니다." });
    user.isAdmin = !!isAdmin;
    await user.save();
    res.json({ success: true });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

module.exports = router;
