const admin = require("firebase-admin");
const path = require("path");
require("dotenv").config();

// Firebase Admin SDK 초기화 (서버용 - 관리자 권한)
if (!admin.apps.length) {
  let credential;

  if (process.env.FIREBASE_SERVICE_ACCOUNT) {
    // 배포 환경: 환경변수에서 직접 읽기
    const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);
    credential = admin.credential.cert(serviceAccount);
  } else {
    // 개발 환경: 파일에서 읽기
    const serviceAccountPath = path.resolve(
      process.env.FIREBASE_SERVICE_ACCOUNT_PATH || "./firebase-service-account.json"
    );
    credential = admin.credential.cert(require(serviceAccountPath));
  }

  admin.initializeApp({ credential });
}

const db = admin.firestore();
const auth = admin.auth();

module.exports = { admin, db, auth };
