const express = require("express");
const router = express.Router();
const { db } = require("../config/firebase");
const { verifyToken, verifyAdmin } = require("../middleware/auth");

// GET /api/users/me - 내 프로필 조회
router.get("/me", verifyToken, async (req, res) => {
  try {
    const doc = await db.collection("users").doc(req.user.uid).get();
    if (!doc.exists) return res.status(404).json({ error: "유저를 찾을 수 없습니다." });
    res.json(doc.data());
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// PATCH /api/users/me - 내 프로필 수정
router.patch("/me", verifyToken, async (req, res) => {
  const { name, email } = req.body;
  const updates = {};
  if (name) updates.name = name;
  if (email) updates.email = email;

  try {
    await db.collection("users").doc(req.user.uid).update(updates);
    res.json({ success: true });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// GET /api/users - 전체 유저 목록 (관리자 전용)
router.get("/", verifyToken, verifyAdmin, async (req, res) => {
  try {
    const snapshot = await db.collection("users").orderBy("createdAt", "desc").get();
    const users = snapshot.docs.map((d) => d.data());
    res.json(users);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// PATCH /api/users/:uid/admin - 관리자 권한 부여/해제 (관리자 전용)
router.patch("/:uid/admin", verifyToken, verifyAdmin, async (req, res) => {
  const { isAdmin } = req.body;
  try {
    await db.collection("users").doc(req.params.uid).update({ isAdmin: !!isAdmin });
    res.json({ success: true });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

module.exports = router;
