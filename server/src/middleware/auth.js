const jwt = require("jsonwebtoken");
const { User } = require("../models");

// JWT 검증 미들웨어
const verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ error: "인증 토큰이 없습니다." });
  }

  const token = authHeader.split("Bearer ")[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // { id, studentId, isAdmin }
    next();
  } catch {
    return res.status(401).json({ error: "유효하지 않은 토큰입니다." });
  }
};

// 관리자 전용 미들웨어 (verifyToken 이후 사용)
const verifyAdmin = async (req, res, next) => {
  try {
    const user = await User.findByPk(req.user.id);
    if (!user || !user.isAdmin) {
      return res.status(403).json({ error: "관리자 권한이 필요합니다." });
    }
    req.userProfile = user;
    next();
  } catch {
    return res.status(500).json({ error: "서버 오류가 발생했습니다." });
  }
};

module.exports = { verifyToken, verifyAdmin };
