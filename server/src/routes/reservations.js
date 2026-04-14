const express = require("express");
const router = express.Router();
const { db } = require("../config/firebase");
const { verifyToken, verifyAdmin } = require("../middleware/auth");
const { FieldValue } = require("firebase-admin/firestore");

// GET /api/reservations/items - 기자재 목록
router.get("/items", verifyToken, async (req, res) => {
  try {
    const { category } = req.query;
    let query = db.collection("items");
    if (category) query = query.where("category", "==", category);
    const snapshot = await query.get();
    res.json(snapshot.docs.map((d) => ({ id: d.id, ...d.data() })));
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// GET /api/reservations - 내 예약 목록
router.get("/", verifyToken, async (req, res) => {
  try {
    const snapshot = await db.collection("reservations")
      .where("userId", "==", req.user.uid)
      .orderBy("createdAt", "desc")
      .get();
    res.json(snapshot.docs.map((d) => ({ id: d.id, ...d.data() })));
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// POST /api/reservations - 예약 생성
router.post("/", verifyToken, async (req, res) => {
  const { itemId, itemName, startTime, duration, purpose } = req.body;
  if (!itemId || !startTime) return res.status(400).json({ error: "itemId, startTime 필수입니다." });

  const userDoc = await db.collection("users").doc(req.user.uid).get();
  const userName = userDoc.data()?.name || "알 수 없음";

  try {
    // 중복 예약 체크
    const conflict = await db.collection("reservations")
      .where("itemId", "==", itemId)
      .where("status", "==", "active")
      .where("startTime", "==", new Date(startTime))
      .get();

    if (!conflict.empty) return res.status(409).json({ error: "이미 예약된 시간입니다." });

    const ref = await db.collection("reservations").add({
      itemId, itemName,
      userId: req.user.uid,
      userName,
      startTime: new Date(startTime),
      duration: duration || 1,
      purpose: purpose || "",
      status: "active",
      createdAt: FieldValue.serverTimestamp(),
    });

    // 기자재 상태 업데이트
    await db.collection("items").doc(itemId).update({
      available: false,
      reservedBy: userName,
    });

    res.status(201).json({ id: ref.id });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// DELETE /api/reservations/:id - 예약 취소
router.delete("/:id", verifyToken, async (req, res) => {
  try {
    const doc = await db.collection("reservations").doc(req.params.id).get();
    if (!doc.exists) return res.status(404).json({ error: "예약을 찾을 수 없습니다." });
    if (doc.data().userId !== req.user.uid) return res.status(403).json({ error: "권한 없음" });

    await db.collection("reservations").doc(req.params.id).update({ status: "cancelled" });
    await db.collection("items").doc(doc.data().itemId).update({ available: true, reservedBy: null });

    res.json({ success: true });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// GET /api/reservations/all - 전체 예약 목록 (관리자 전용)
router.get("/all", verifyToken, verifyAdmin, async (req, res) => {
  try {
    const snapshot = await db.collection("reservations")
      .orderBy("createdAt", "desc").limit(100).get();
    res.json(snapshot.docs.map((d) => ({ id: d.id, ...d.data() })));
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

module.exports = router;
