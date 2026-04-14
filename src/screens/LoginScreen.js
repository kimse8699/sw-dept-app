import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useAuth } from "../context/AuthContext";

const NAVY = "#1B3080";
const SKY = "#5BC8EA";

export default function LoginScreen({ navigation }) {
  const { login } = useAuth();
  const [studentId, setStudentId] = useState("");
  const [password, setPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!studentId.trim() || !password.trim()) {
      Alert.alert("입력 오류", "학번과 비밀번호를 모두 입력해주세요.");
      return;
    }
    if (studentId.trim().length < 8) {
      Alert.alert("입력 오류", "학번을 정확히 입력해주세요.");
      return;
    }

    setLoading(true);
    try {
      await login(studentId.trim(), password);
      // 성공 시 App.js의 onAuthStateChanged가 자동으로 메인 화면으로 이동
    } catch (error) {
      const msg =
        error.code === "auth/user-not-found" ? "등록되지 않은 학번입니다." :
        error.code === "auth/wrong-password" ? "비밀번호가 올바르지 않습니다." :
        error.code === "auth/invalid-credential" ? "학번 또는 비밀번호를 확인해주세요." :
        error.code === "auth/too-many-requests" ? "로그인 시도가 너무 많습니다. 잠시 후 다시 시도해주세요." :
        "로그인 중 오류가 발생했습니다.";
      Alert.alert("로그인 실패", msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.safe}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        {/* ── 상단 로고 영역 ── */}
        <View style={styles.logoSection}>
          {/* SW 투톤 배지 */}
          <View style={styles.swBadge}>
            <View style={styles.swHalf}>
              <Text style={[styles.swLetter, { backgroundColor: SKY }]}>S</Text>
              <Text style={[styles.swLetter, { backgroundColor: NAVY }]}>W</Text>
            </View>
          </View>
          <Text style={styles.deptName}>소프트웨어융합학과</Text>
          <Text style={styles.appName}>SOFTWARE</Text>
          <Text style={styles.appSub}>학과 통합 앱</Text>
        </View>

        {/* ── 로그인 폼 ── */}
        <View style={styles.formCard}>
          <Text style={styles.formTitle}>로그인</Text>

          {/* 학번 */}
          <View style={styles.inputWrap}>
            <Ionicons name="card-outline" size={18} color="#94a3b8" style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              placeholder="학번 (예: 20221xxxxx)"
              placeholderTextColor="#94a3b8"
              value={studentId}
              onChangeText={setStudentId}
              keyboardType="number-pad"
              maxLength={10}
              returnKeyType="next"
            />
          </View>

          {/* 비밀번호 */}
          <View style={styles.inputWrap}>
            <Ionicons name="lock-closed-outline" size={18} color="#94a3b8" style={styles.inputIcon} />
            <TextInput
              style={[styles.input, { flex: 1 }]}
              placeholder="비밀번호"
              placeholderTextColor="#94a3b8"
              value={password}
              onChangeText={setPassword}
              secureTextEntry={!showPw}
              returnKeyType="done"
              onSubmitEditing={handleLogin}
            />
            <TouchableOpacity onPress={() => setShowPw(!showPw)} style={styles.eyeBtn}>
              <Ionicons
                name={showPw ? "eye-outline" : "eye-off-outline"}
                size={18}
                color="#94a3b8"
              />
            </TouchableOpacity>
          </View>

          {/* 로그인 버튼 */}
          <TouchableOpacity
            style={[styles.loginBtn, loading && { opacity: 0.7 }]}
            onPress={handleLogin}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="white" />
            ) : (
              <Text style={styles.loginBtnText}>로그인</Text>
            )}
          </TouchableOpacity>

          {/* 회원가입 링크 */}
          <View style={styles.signupRow}>
            <Text style={styles.signupHint}>아직 계정이 없으신가요?</Text>
            <TouchableOpacity onPress={() => navigation.navigate("Signup")}>
              <Text style={styles.signupLink}>회원가입</Text>
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: NAVY },

  // 로고 섹션
  logoSection: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingTop: 20,
  },
  swBadge: {
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 10,
  },
  swHalf: {
    flexDirection: "row",
    width: 80, height: 80,
    borderRadius: 22,
    overflow: "hidden",
    borderWidth: 2,
    borderColor: "rgba(255,255,255,0.3)",
  },
  swLetter: {
    flex: 1,
    color: "white",
    fontWeight: "900",
    fontSize: 30,
    textAlign: "center",
    textAlignVertical: "center",
    lineHeight: 78,
  },
  deptName: {
    fontSize: 13,
    color: "rgba(255,255,255,0.6)",
    fontWeight: "500",
    letterSpacing: 1,
    marginBottom: 8,
  },
  appName: {
    fontSize: 34,
    fontWeight: "900",
    color: "white",
    letterSpacing: 3,
    marginBottom: 6,
  },
  appSub: {
    fontSize: 14,
    color: SKY,
    fontWeight: "600",
    letterSpacing: 1,
  },

  // 폼 카드
  formCard: {
    backgroundColor: "white",
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    paddingHorizontal: 28,
    paddingTop: 36,
    paddingBottom: Platform.OS === "ios" ? 40 : 28,
  },
  formTitle: {
    fontSize: 22,
    fontWeight: "900",
    color: "#1e293b",
    marginBottom: 24,
  },

  inputWrap: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F5F7FA",
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 4,
    marginBottom: 14,
    borderWidth: 1.5,
    borderColor: "#e2e8f0",
  },
  inputIcon: { marginRight: 10 },
  input: {
    flex: 1,
    fontSize: 16,
    color: "#1e293b",
    paddingVertical: 14,
  },
  eyeBtn: { padding: 6 },

  loginBtn: {
    backgroundColor: NAVY,
    borderRadius: 16,
    paddingVertical: 16,
    alignItems: "center",
    marginTop: 8,
    marginBottom: 20,
    shadowColor: NAVY,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  loginBtnText: {
    fontSize: 17,
    fontWeight: "800",
    color: "white",
    letterSpacing: 0.5,
  },

  signupRow: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 6,
  },
  signupHint: { fontSize: 14, color: "#94a3b8" },
  signupLink: { fontSize: 14, fontWeight: "800", color: NAVY },
});
