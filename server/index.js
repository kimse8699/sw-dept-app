require("dotenv").config();
const express = require("express");
const cors = require("cors");
const morgan = require("morgan");

const app = express();
const PORT = process.env.PORT || 3000;

// ── 미들웨어
app.use(cors());
app.use(express.json());
app.use(morgan("dev"));

// ── 라우터
app.use("/api/users", require("./src/routes/users"));
app.use("/api/notices", require("./src/routes/notices"));
app.use("/api/polls", require("./src/routes/polls"));
app.use("/api/reservations", require("./src/routes/reservations"));

// ── 헬스체크
app.get("/", (req, res) => {
  res.json({
    status: "ok",
    message: "SW 소프트웨어융합학과 API 서버",
    version: "1.0.0",
  });
});

// ── 에러 핸들러
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: "서버 오류가 발생했습니다." });
});

app.listen(PORT, () => {
  console.log(`🚀 서버 실행 중 → http://localhost:${PORT}`);
});
