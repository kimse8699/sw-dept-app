const express = require("express");
const router = express.Router();
const { db } = require("../config/firebase");
const { verifyToken, verifyAdmin } = require("../middleware/auth");
const { FieldValue } = require("firebase-admin/firestore");

// GET /api/notices - 공지 목록 (전체 유저)
router.get("/", verifyToken, async (req, res) => {
  try {
    const { type } = req.query; // 필터: 필독 | 학사 | 장학 | 일반
    let query = db.collection("notices").orderBy("createdAt", "desc");
    if (type) query = query.where("type", "==", type);
    const snapshot = await query.limit(50).get();
    res.json(snapshot.docs.map((d) => ({ id: d.id, ...d.data() })));
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// POST /api/notices - 공지 작성 (관리자 전용)
router.post("/", verifyToken, verifyAdmin, async (req, res) => {
  const { title, content, type } = req.body;
  if (!title || !content || !type) {
    return res.status(400).json({ error: "title, content, type 필수입니다." });
  }
  try {
    const ref = await db.collection("notices").add({
      title, content, type,
      createdBy: req.user.uid,
      createdByName: req.userProfile.name,
      createdAt: FieldValue.serverTimestamp(),
      views: 0,
    });
    res.status(201).json({ id: ref.id });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// PATCH /api/notices/:id - 공지 수정 (관리자 전용)
router.patch("/:id", verifyToken, verifyAdmin, async (req, res) => {
  const { title, content, type } = req.body;
  try {
    await db.collection("notices").doc(req.params.id).update({
      ...(title && { title }),
      ...(content && { content }),
      ...(type && { type }),
      updatedAt: FieldValue.serverTimestamp(),
    });
    res.json({ success: true });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// DELETE /api/notices/:id - 공지 삭제 (관리자 전용)
router.delete("/:id", verifyToken, verifyAdmin, async (req, res) => {
  try {
    await db.collection("notices").doc(req.params.id).delete();
    res.json({ success: true });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

module.exports = router;
