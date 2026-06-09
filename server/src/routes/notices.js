const express = require("express");
const router = express.Router();
const { Notice } = require("../models");
const { verifyToken, verifyAdmin } = require("../middleware/auth");
const { Op } = require("sequelize");

// GET /api/notices - 공지 목록 (전체 유저)
router.get("/", verifyToken, async (req, res) => {
  try {
    const { type } = req.query;
    const where = type ? { type } : {};
    const notices = await Notice.findAll({
      where,
      order: [["createdAt", "DESC"]],
      limit: 50,
    });
    res.json(notices);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// GET /api/notices/:id - 공지 상세 조회
router.get("/:id", verifyToken, async (req, res) => {
  try {
    const notice = await Notice.findByPk(req.params.id);
    if (!notice) return res.status(404).json({ error: "공지를 찾을 수 없습니다." });
    await notice.increment("views");
    res.json(notice);
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
    const notice = await Notice.create({
      title,
      content,
      type,
      createdById: req.user.id,
      createdByName: req.userProfile.name,
    });
    res.status(201).json(notice);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// PATCH /api/notices/:id - 공지 수정 (관리자 전용)
router.patch("/:id", verifyToken, verifyAdmin, async (req, res) => {
  const { title, content, type } = req.body;
  try {
    const notice = await Notice.findByPk(req.params.id);
    if (!notice) return res.status(404).json({ error: "공지를 찾을 수 없습니다." });
    if (title) notice.title = title;
    if (content) notice.content = content;
    if (type) notice.type = type;
    await notice.save();
    res.json({ success: true });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// DELETE /api/notices/:id - 공지 삭제 (관리자 전용)
router.delete("/:id", verifyToken, verifyAdmin, async (req, res) => {
  try {
    const notice = await Notice.findByPk(req.params.id);
    if (!notice) return res.status(404).json({ error: "공지를 찾을 수 없습니다." });
    await notice.destroy();
    res.json({ success: true });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

module.exports = router;
