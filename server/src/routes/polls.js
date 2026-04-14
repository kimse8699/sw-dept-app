const express = require("express");
const router = express.Router();
const { db } = require("../config/firebase");
const { verifyToken, verifyAdmin } = require("../middleware/auth");
const { FieldValue } = require("firebase-admin/firestore");

// GET /api/polls - 투표 목록
router.get("/", verifyToken, async (req, res) => {
  try {
    const { active } = req.query;
    let query = db.collection("polls").orderBy("createdAt", "desc");
    if (active !== undefined) query = query.where("isActive", "==", active === "true");
    const snapshot = await query.get();

    // 내 투표 여부 포함
    const polls = await Promise.all(snapshot.docs.map(async (d) => {
      const voteDoc = await db.collection("polls").doc(d.id)
        .collection("votes").doc(req.user.uid).get();
      return { id: d.id, ...d.data(), myVote: voteDoc.exists ? voteDoc.data().optionId : null };
    }));
    res.json(polls);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// POST /api/polls/:id/vote - 투표하기
router.post("/:id/vote", verifyToken, async (req, res) => {
  const { optionId } = req.body;
  if (!optionId) return res.status(400).json({ error: "optionId 필수입니다." });

  const pollRef = db.collection("polls").doc(req.params.id);
  const voteRef = pollRef.collection("votes").doc(req.user.uid);

  try {
    const voteDoc = await voteRef.get();
    if (voteDoc.exists) return res.status(409).json({ error: "이미 투표했습니다." });

    await db.runTransaction(async (tx) => {
      tx.set(voteRef, { optionId, votedAt: FieldValue.serverTimestamp() });
      tx.update(pollRef, {
        [`options.${optionId}.votes`]: FieldValue.increment(1),
        total: FieldValue.increment(1),
      });
    });
    res.json({ success: true });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// POST /api/polls - 투표 생성 (관리자 전용)
router.post("/", verifyToken, verifyAdmin, async (req, res) => {
  const { title, desc, options, deadline } = req.body;
  if (!title || !options?.length) return res.status(400).json({ error: "title, options 필수입니다." });

  try {
    const optionMap = {};
    options.forEach((opt, i) => {
      optionMap[`opt_${i}`] = { text: opt, votes: 0 };
    });

    const ref = await db.collection("polls").add({
      title, desc: desc || "",
      options: optionMap,
      total: 0,
      isActive: true,
      deadline: deadline ? new Date(deadline) : null,
      createdBy: req.user.uid,
      createdAt: FieldValue.serverTimestamp(),
    });
    res.status(201).json({ id: ref.id });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// PATCH /api/polls/:id/close - 투표 마감 (관리자 전용)
router.patch("/:id/close", verifyToken, verifyAdmin, async (req, res) => {
  try {
    await db.collection("polls").doc(req.params.id).update({ isActive: false });
    res.json({ success: true });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

module.exports = router;
