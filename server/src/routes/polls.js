const express = require("express");
const router = express.Router();
const { Poll, PollOption, PollVote } = require("../models");
const { verifyToken, verifyAdmin } = require("../middleware/auth");
const sequelize = require("../config/database");

// GET /api/polls - 투표 목록
router.get("/", verifyToken, async (req, res) => {
  try {
    const { active } = req.query;
    const where = active !== undefined ? { isActive: active === "true" } : {};

    const polls = await Poll.findAll({
      where,
      include: [{ model: PollOption, as: "options" }],
      order: [["createdAt", "DESC"]],
    });

    // 내 투표 여부 포함
    const userId = req.user.id;
    const result = await Promise.all(
      polls.map(async (poll) => {
        const myVote = await PollVote.findOne({
          where: { pollId: poll.id, userId },
        });
        return {
          ...poll.toJSON(),
          myVote: myVote ? myVote.optionId : null,
        };
      })
    );
    res.json(result);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// POST /api/polls/:id/vote - 투표하기
router.post("/:id/vote", verifyToken, async (req, res) => {
  const { optionId } = req.body;
  if (!optionId) return res.status(400).json({ error: "optionId 필수입니다." });

  const t = await sequelize.transaction();
  try {
    const existing = await PollVote.findOne({
      where: { pollId: req.params.id, userId: req.user.id },
      transaction: t,
    });
    if (existing) {
      await t.rollback();
      return res.status(409).json({ error: "이미 투표했습니다." });
    }

    await PollVote.create(
      { pollId: req.params.id, userId: req.user.id, optionId },
      { transaction: t }
    );
    await PollOption.increment("votes", {
      by: 1,
      where: { id: optionId },
      transaction: t,
    });
    await Poll.increment("total", {
      by: 1,
      where: { id: req.params.id },
      transaction: t,
    });

    await t.commit();
    res.json({ success: true });
  } catch (e) {
    await t.rollback();
    res.status(500).json({ error: e.message });
  }
});

// POST /api/polls - 투표 생성 (관리자 전용)
router.post("/", verifyToken, verifyAdmin, async (req, res) => {
  const { title, desc, options, deadline } = req.body;
  if (!title || !options?.length) {
    return res.status(400).json({ error: "title, options 필수입니다." });
  }

  const t = await sequelize.transaction();
  try {
    const poll = await Poll.create(
      {
        title,
        desc: desc || "",
        deadline: deadline ? new Date(deadline) : null,
        createdById: req.user.id,
      },
      { transaction: t }
    );
    await PollOption.bulkCreate(
      options.map((text) => ({ pollId: poll.id, text })),
      { transaction: t }
    );
    await t.commit();
    res.status(201).json({ id: poll.id });
  } catch (e) {
    await t.rollback();
    res.status(500).json({ error: e.message });
  }
});

// PATCH /api/polls/:id/close - 투표 마감 (관리자 전용)
router.patch("/:id/close", verifyToken, verifyAdmin, async (req, res) => {
  try {
    const poll = await Poll.findByPk(req.params.id);
    if (!poll) return res.status(404).json({ error: "투표를 찾을 수 없습니다." });
    poll.isActive = false;
    await poll.save();
    res.json({ success: true });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

module.exports = router;
