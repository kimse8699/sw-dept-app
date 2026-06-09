const express = require("express");
const router = express.Router();
const { Item, Reservation, User } = require("../models");
const { verifyToken, verifyAdmin } = require("../middleware/auth");
const sequelize = require("../config/database");
const { Op } = require("sequelize");

// GET /api/reservations/items - 기자재 목록
router.get("/items", verifyToken, async (req, res) => {
  try {
    const { category } = req.query;
    const where = category ? { category } : {};
    const items = await Item.findAll({ where });
    res.json(items);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// GET /api/reservations/all - 전체 예약 목록 (관리자 전용) — /all 먼저 등록
router.get("/all", verifyToken, verifyAdmin, async (req, res) => {
  try {
    const reservations = await Reservation.findAll({
      order: [["createdAt", "DESC"]],
      limit: 100,
    });
    res.json(reservations);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// GET /api/reservations - 내 예약 목록
router.get("/", verifyToken, async (req, res) => {
  try {
    const reservations = await Reservation.findAll({
      where: { userId: req.user.id },
      order: [["createdAt", "DESC"]],
    });
    res.json(reservations);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// POST /api/reservations - 예약 생성
router.post("/", verifyToken, async (req, res) => {
  const { itemId, itemName, startTime, duration, purpose } = req.body;
  if (!itemId || !startTime) {
    return res.status(400).json({ error: "itemId, startTime 필수입니다." });
  }

  const t = await sequelize.transaction();
  try {
    // 중복 예약 체크
    const conflict = await Reservation.findOne({
      where: {
        itemId,
        status: "active",
        startTime: new Date(startTime),
      },
      transaction: t,
    });
    if (conflict) {
      await t.rollback();
      return res.status(409).json({ error: "이미 예약된 시간입니다." });
    }

    const user = await User.findByPk(req.user.id);
    const reservation = await Reservation.create(
      {
        itemId,
        itemName: itemName || "",
        userId: req.user.id,
        userName: user.name,
        startTime: new Date(startTime),
        duration: duration || 1,
        purpose: purpose || "",
      },
      { transaction: t }
    );

    await Item.update(
      { available: false, reservedBy: user.name },
      { where: { id: itemId }, transaction: t }
    );

    await t.commit();
    res.status(201).json(reservation);
  } catch (e) {
    await t.rollback();
    res.status(500).json({ error: e.message });
  }
});

// DELETE /api/reservations/:id - 예약 취소
router.delete("/:id", verifyToken, async (req, res) => {
  try {
    const reservation = await Reservation.findByPk(req.params.id);
    if (!reservation) return res.status(404).json({ error: "예약을 찾을 수 없습니다." });
    if (reservation.userId !== req.user.id) {
      return res.status(403).json({ error: "권한 없음" });
    }

    reservation.status = "cancelled";
    await reservation.save();

    await Item.update(
      { available: true, reservedBy: null },
      { where: { id: reservation.itemId } }
    );

    res.json({ success: true });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

module.exports = router;
