import AsyncStorage from "@react-native-async-storage/async-storage";
import { createContext, useContext, useEffect, useState } from "react";
import api from "../services/api";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  // ── 앱 시작 시 저장된 토큰으로 자동 로그인
  useEffect(() => {
    const restoreSession = async () => {
      try {
        const token = await AsyncStorage.getItem("token");
        if (token) {
          const res = await api.get("/users/me");
          setUser(res.data);
          setProfile(res.data);
        }
      } catch {
        await AsyncStorage.removeItem("token");
      } finally {
        setLoading(false);
      }
    };
    restoreSession();
  }, []);

  // ── 로그인
  const login = async (studentId, password) => {
    const res = await api.post("/auth/login", { studentId, password });
    await AsyncStorage.setItem("token", res.data.token);
    setUser(res.data.user);
    setProfile(res.data.user);
  };

  // ── 회원가입
  const register = async (data) => {
    const res = await api.post("/auth/register", data);
    await AsyncStorage.setItem("token", res.data.token);
    setUser(res.data.user);
    setProfile(res.data.user);
  };

  // ── 로그아웃
  const logout = async () => {
    await AsyncStorage.removeItem("token");
    setUser(null);
    setProfile(null);
  };

  // ── 프로필 새로고침
  const refreshProfile = async () => {
    try {
      const res = await api.get("/users/me");
      setProfile(res.data);
    } catch {}
  };

  return (
    <AuthContext.Provider value={{ user, profile, loading, login, register, logout, refreshProfile }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
