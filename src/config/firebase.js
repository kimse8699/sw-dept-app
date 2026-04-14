import AsyncStorage from "@react-native-async-storage/async-storage";
import { initializeApp } from "firebase/app";
import { getReactNativePersistence, initializeAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// ────────────────────────────────────────────────────────
// Firebase 설정값
// 설정 방법:
//   1. https://console.firebase.google.com 접속
//   2. 프로젝트 생성 → "소프트웨어융합학과 앱"
//   3. 웹 앱 추가 → 아래 값들을 복사해서 붙여넣기
//   4. Authentication → 이메일/비밀번호 로그인 활성화
//   5. Firestore Database → 데이터베이스 만들기 (테스트 모드)
// ────────────────────────────────────────────────────────
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_AUTH_DOMAIN",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_STORAGE_BUCKET",
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
  appId: "YOUR_APP_ID",
};

const app = initializeApp(firebaseConfig);

// 앱을 껐다 켜도 로그인 유지 (AsyncStorage 기반)
export const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage),
});

export const db = getFirestore(app);

export default app;
