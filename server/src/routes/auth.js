const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { User } = require("../models");

const YEAR_LABELS = { y1: "1학년", y2: "2학년", y3: "3학년", y4: "4학년" };

const signToken = (user) =>
  jwt.sign(
    { id: user.id, studentId: user.studentId, isAdmin: user.isAdmin },
    process.env.JWT_SECRET,
    { expiresIn: "30d" }
  );

// POST /api/auth/register
router.post("/register", async (req, res) => {
  const { name, studentId, email, password, yearId } = req.body;

  if (!name || !studentId || !password || !yearId) {
    return res.status(400).json({ error: "이름, 학번, 비밀번호, 학년은 필수입니다." });
  }
  if (!["y1", "y2", "y3", "y4"].includes(yearId)) {
    return res.status(400).json({ error: "올바른 학년을 선택해주세요." });
  }

  try {
    const exists = await User.findOne({ where: { studentId } });
    if (exists) return res.status(409).json({ error: "이미 사용 중인 학번입니다." });

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({
      name,
      studentId,
      email: email || null,
      password: hashedPassword,
      yearId,
      yearLabel: YEAR_LABELS[yearId],
    });

    const token = signToken(user);
    res.status(201).json({
      token,
      user: {
        id: user.id,
        name: user.name,
        studentId: user.studentId,
        email: user.email,
        yearId: user.yearId,
        yearLabel: user.yearLabel,
        isAdmin: user.isAdmin,
      },
    });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// POST /api/auth/login
router.post("/login", async (req, res) => {
  const { studentId, password } = req.body;
  if (!studentId || !password) {
    return res.status(400).json({ error: "학번과 비밀번호를 입력해주세요." });
  }

  try {
    const user = await User.findOne({ where: { studentId } });
    if (!user) return res.status(401).json({ error: "학번 또는 비밀번호가 올바르지 않습니다." });

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) return res.status(401).json({ error: "학번 또는 비밀번호가 올바르지 않습니다." });

    const token = signToken(user);
    res.json({
      token,
      user: {
        id: user.id,
        name: user.name,
        studentId: user.studentId,
        email: user.email,
        yearId: user.yearId,
        yearLabel: user.yearLabel,
        isAdmin: user.isAdmin,
      },
    });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

module.exports = router;
