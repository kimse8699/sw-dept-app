const { auth } = require("../config/firebase");

// Firebase ID Token 검증 미들웨어
// 클라이언트가 Authorization: Bearer <idToken> 헤더를 보내면 검증 후 req.user에 유저 정보 저장
const verifyToken = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ error: "인증 토큰이 없습니다." });
  }

  const idToken = authHeader.split("Bearer ")[1];
  try {
    const decoded = await auth.verifyIdToken(idToken);
    req.user = decoded; // uid, email 등 포함
    next();
  } catch {
    return res.status(401).json({ error: "유효하지 않은 토큰입니다." });
  }
};

// 관리자 전용 미들웨어 (verifyToken 이후에 사용)
const verifyAdmin = async (req, res, next) => {
  const { db } = require("../config/firebase");
  const userDoc = await db.collection("users").doc(req.user.uid).get();
  if (!userDoc.exists || !userDoc.data().isAdmin) {
    return res.status(403).json({ error: "관리자 권한이 필요합니다." });
  }
  req.userProfile = userDoc.data();
  next();
};

module.exports = { verifyToken, verifyAdmin };
