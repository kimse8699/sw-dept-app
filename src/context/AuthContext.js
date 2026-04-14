import { onAuthStateChanged, signInWithEmailAndPassword, signOut } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { createContext, useContext, useEffect, useState } from "react";
import { auth, db } from "../config/firebase";

const AuthContext = createContext(null);

// 학번 → Firebase Auth 이메일 변환
// 예: "2022112345" → "2022112345@swdept.kr"
export const toAuthEmail = (studentId) => `${studentId}@swdept.kr`;

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);       // Firebase Auth 유저
  const [profile, setProfile] = useState(null); // Firestore 유저 프로필 (이름, 학번, 학년 등)
  const [loading, setLoading] = useState(true); // 앱 시작 시 로그인 상태 확인 중

  // ── Firebase Auth 상태 변화 감지 (앱 시작 / 로그인 / 로그아웃)
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        setUser(firebaseUser);
        // Firestore에서 유저 프로필 불러오기
        const docRef = doc(db, "users", firebaseUser.uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setProfile(docSnap.data());
        }
      } else {
        setUser(null);
        setProfile(null);
      }
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  // ── 로그인
  const login = async (studentId, password) => {
    const email = toAuthEmail(studentId);
    return signInWithEmailAndPassword(auth, email, password);
  };

  // ── 로그아웃
  const logout = async () => {
    await signOut(auth);
  };

  // ── 프로필 새로고침 (회원가입 후 등에 사용)
  const refreshProfile = async () => {
    if (!user) return;
    const docRef = doc(db, "users", user.uid);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) setProfile(docSnap.data());
  };

  return (
    <AuthContext.Provider value={{ user, profile, loading, login, logout, refreshProfile }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
